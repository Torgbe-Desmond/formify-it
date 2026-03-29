import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Typography, Alert,
} from '@mui/material';
import { Liquid } from 'liquidjs';
import { useDispatch, useSelector } from 'react-redux';
import { Buffer } from 'buffer';
import yaml from 'js-yaml';

import { createFile } from '../store/slices/filesSlice';
import { selectSchemaByFolder } from '../store/slices/schemaSlice';
import FieldRenderer from './fields/FieldRenderer';

window.Buffer = Buffer;

const engine = new Liquid();

/**
 * Strip the <!-- CSS --> ... <!-- /CSS --> block from a template string
 * so it never gets saved into rendered file content.
 */
const stripCssBlock = (str) => {
  if (!str) return str;
  return str
    .replace(/<!-- CSS -->[\s\S]*?<!-- \/CSS -->\n?/g, '')
    .replace(/<!-- \/CSS -->\n?/g, '');
};

export default function AddFile({ open, onClose, folderId, onFileAdded }) {
  const dispatch = useDispatch();
  const schema   = useSelector(selectSchemaByFolder(folderId));

  const [fields,          setFields]          = useState({});
  const [template,        setTemplate]        = useState('');
  const [frontMatter,     setFrontMatter]     = useState({});
  const [formData,        setFormData]        = useState({});
  const [errors,          setErrors]          = useState({});
  const [loading,         setLoading]         = useState(false);
  const [expandedArrays,  setExpandedArrays]  = useState({});

  // Populate form from Redux schema
  useEffect(() => {
    if (!open || !schema) return;

    try {
      const parsed = yaml.load(schema.schemaYaml || '');
      if (!parsed) return;

      const templateHtml = stripCssBlock(schema.templateHtml || '');

      setFields(parsed.fields || {});
      setTemplate(templateHtml);
      setFrontMatter(parsed);

      const initialData = {};
      Object.entries(parsed.fields || {}).forEach(([key, config]) => {
        if (config.default !== undefined)    initialData[key] = config.default;
        else if (config.type === 'checkbox') initialData[key] = false;
        else if (config.type === 'array')    initialData[key] = [];
        else                                 initialData[key] = '';
      });

      setFormData(initialData);
      setErrors({});
    } catch (err) {
      console.error('Failed to parse schema:', err);
    }
  }, [open, schema]);

  useEffect(() => {
    if (!open) {
      setFormData({});
      setErrors({});
      setExpandedArrays({});
    }
  }, [open]);

  const renderTemplate = async (tmpl, values, fm) => {
    const context = { ...values, frontmatter: fm };
    try {
      return await engine.parseAndRender(stripCssBlock(tmpl), context);
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

      // Convert metadata values to strings for the backend
      const metadata = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, JSON.stringify(v)])
      );

      await dispatch(createFile({ name: fileName, folderId, content:renderedHtml, metadata }));

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

  if (!schema || Object.keys(fields).length === 0) {
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
              key={key} fieldKey={key} config={config}
              value={formData} error={errors}
              onChange={setFormData} disabled={loading}
              expandedArrays={expandedArrays}
              onToggleArrayExpand={(k, expanded) =>
                setExpandedArrays((prev) => ({ ...prev, [k]: expanded }))}
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
