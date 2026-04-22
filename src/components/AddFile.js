import { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Alert,
} from '@mui/material';
import { Liquid } from 'liquidjs';
import { useDispatch, useSelector } from 'react-redux';
import { Buffer } from 'buffer';
import yaml from 'js-yaml';

import { createFile } from '../store/slices/filesSlice';
import {
  selectSchemaByFolder,
  selectSchemasMap,
  selectEntrySchemaName,
} from '../store/slices/schemaSlice';
import FieldRenderer from './fields/FieldRenderer';

window.Buffer = Buffer;

const engine = new Liquid();

const stripCssBlock = (str) => {
  if (!str) return str;
  return str
    .replace(/<!-- CSS -->[\s\S]*?<!-- \/CSS -->\n?/g, '')
    .replace(/<!-- \/CSS -->\n?/g, '');
};

/**
 * Build initial empty form data from a fields map.
 * Handles $SchemaRef types by recursively building nested objects.
 */
function buildInitialData(fieldsMap, schemasMap, parsedCache, depth = 0) {
  if (!fieldsMap || depth > 10) return {};
  const result = {};

  Object.entries(fieldsMap).forEach(([key, cfg]) => {
    if (cfg.type === 'array') {
      result[key] = cfg.default ?? [];
      return;
    }

    if (cfg.type?.startsWith('$')) {
      const refName = cfg.type.replace(/^\$/, '');
      const nestedFields = getFieldsFromRef(refName, schemasMap, parsedCache);
      result[key] = nestedFields
        ? buildInitialData(nestedFields, schemasMap, parsedCache, depth + 1)
        : {};
      return;
    }

    result[key] = cfg.default !== undefined ? cfg.default
      : cfg.type === 'checkbox' ? false
      : '';
  });

  return result;
}

function getFieldsFromRef(refName, schemasMap, parsedCache) {
  if (parsedCache[refName]) return parsedCache[refName];
  const raw = schemasMap?.[refName];
  if (!raw?.schemaYaml) return null;
  try {
    const parsed = yaml.load(raw.schemaYaml);
    parsedCache[refName] = parsed?.fields || {};
    return parsedCache[refName];
  } catch { return null; }
}

export default function AddFile({ open, onClose, folderId, onFileAdded }) {
  const dispatch        = useDispatch();
  const folderSchema    = useSelector(selectSchemaByFolder(folderId));
  const schemasMap      = useSelector(selectSchemasMap(folderId));
  const entrySchemaName = useSelector(selectEntrySchemaName(folderId));

  // Mutable YAML parse cache — stable across renders
  const parsedCache = useRef({});

  const [fields,         setFields]         = useState({});
  const [template,       setTemplate]       = useState('');
  const [frontMatter,    setFrontMatter]    = useState({});
  const [formData,       setFormData]       = useState({});
  const [errors,         setErrors]         = useState({});
  const [loading,        setLoading]        = useState(false);
  const [expandedArrays, setExpandedArrays] = useState({});

  // Reset on close
  useEffect(() => {
    if (!open) {
      setFormData({});
      setErrors({});
      setExpandedArrays({});
      parsedCache.current = {};
    }
  }, [open]);

  // Populate form from entry schema
  useEffect(() => {
    if (!open || !folderSchema) return;

    try {
      const entryData = folderSchema.schemas?.[entrySchemaName || folderSchema.entrySchema];
      if (!entryData) return;

      const parsed = yaml.load(entryData.schemaYaml || '');
      if (!parsed) return;

      setFields(parsed.fields || {});
      setTemplate(stripCssBlock(entryData.templateHtml || ''));
      setFrontMatter(parsed);

      const initialData = buildInitialData(
        parsed.fields || {},
        schemasMap,
        parsedCache.current,
        0
      );

      setFormData(initialData);
      setErrors({});
    } catch (err) {
      console.error('Failed to parse schema:', err);
    }
  }, [open, folderSchema, schemasMap, entrySchemaName]);

  const renderTemplate = async (tmpl, values, fm) => {
    try {
      return await engine.parseAndRender(stripCssBlock(tmpl), { ...values, frontmatter: fm });
    } catch (err) {
      console.error('Liquid render error:', err);
      return stripCssBlock(tmpl);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    for (const [key, config] of Object.entries(fields)) {
      if (config.required) {
        const value = formData[key];
        if (value === undefined || value === null || value === '' ||
            (Array.isArray(value) && value.length === 0)) {
          newErrors[key] = `${config.label || key} is required`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const renderedHtml = await renderTemplate(template, formData, frontMatter);

      let fileName = formData.title || formData.name || 'Untitled';
      if (frontMatter.filename) {
        fileName = await renderTemplate(frontMatter.filename, formData, frontMatter);
      }

      // Metadata: JSON-stringify each top-level value
      // Nested objects/arrays are preserved as JSON strings
      const metadata = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, JSON.stringify(v)])
      );

      await dispatch(createFile({ name: fileName, folderId, content: renderedHtml, metadata }));

      setFormData({});
      setErrors({});
      if (onFileAdded) onFileAdded();
    } catch (err) {
      console.error('Failed to create file:', err);
      alert('Failed to create file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!folderSchema || Object.keys(fields).length === 0) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>New File</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2 }}>
            No schema defined for this folder. Create a schema first.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}
      fullWidth maxWidth="sm" disableEscapeKeyDown={loading}>
      <DialogTitle>
        New File
        {frontMatter.description && (
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            {frontMatter.description}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          {Object.entries(fields).map(([key, config]) => (
            <FieldRenderer
              key={key}
              fieldKey={key}
              config={config}
              value={formData}
              error={errors}
              onChange={setFormData}
              disabled={loading}
              expandedArrays={expandedArrays}
              onToggleArrayExpand={(k, expanded) =>
                setExpandedArrays((prev) => ({ ...prev, [k]: expanded }))}
              schemasMap={schemasMap}
              parsedCache={parsedCache}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={loading}>
          {loading ? 'Creating...' : 'Create File'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
