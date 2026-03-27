import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Alert,
} from '@mui/material';
import { Liquid } from 'liquidjs';
import yaml from 'js-yaml';
import { useDispatch, useSelector } from 'react-redux';

import { updateFile } from '../store/slices/filesSlice';
import { selectSchemaByFolder } from '../store/slices/schemaSlice';
import FieldRenderer from './fields/FieldRenderer';

const engine = new Liquid();

const stripCssBlock = (str) => {
  if (!str) return str;
  return str
    .replace(/<!-- CSS -->[\s\S]*?<!-- \/CSS -->\n?/g, '')
    .replace(/<!-- \/CSS -->\n?/g, '');
};

export default function EditFileDataDialog({ open, onClose, file, folderId, onSaved }) {
  const dispatch = useDispatch();
  const schema   = useSelector(selectSchemaByFolder(folderId));

  const [fields,         setFields]         = useState({});
  const [template,       setTemplate]       = useState('');
  const [frontMatter,    setFrontMatter]    = useState({});
  const [formData,       setFormData]       = useState({});
  const [loading,        setLoading]        = useState(false);
  const [loaded,         setLoaded]         = useState(false);
  const [errors,         setErrors]         = useState({});
  const [expandedArrays, setExpandedArrays] = useState({});

  useEffect(() => {
    if (!open) {
      setFormData({});
      setErrors({});
      setExpandedArrays({});
      setLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !file || !schema) return;

    try {
      const parsed = yaml.load(schema.schemaYaml || '');
      if (!parsed) return;

      setFields(parsed.fields || {});
      setTemplate(stripCssBlock(schema.templateHtml || ''));
      setFrontMatter(parsed);

      // Pre-fill form with existing metadata
      const existingMeta = file.metadata || {};
      const initialData  = {};

      Object.entries(parsed.fields || {}).forEach(([key, config]) => {
        if (key in existingMeta) {
          // Metadata values are JSON strings from backend
          try {
            initialData[key] = JSON.parse(existingMeta[key]);
          } catch {
            initialData[key] = existingMeta[key];
          }
        } else if (config.default !== undefined) {
          initialData[key] = config.default;
        } else if (config.type === 'checkbox') {
          initialData[key] = false;
        } else if (config.type === 'array') {
          initialData[key] = [];
        } else {
          initialData[key] = '';
        }
      });

      setFormData(initialData);
      setErrors({});
      setLoaded(true);
    } catch (err) {
      console.error('Schema parse error:', err);
    }
  }, [open, file, schema]);

  const validateForm = () => {
    const newErrors = {};
    for (const [key, config] of Object.entries(fields)) {
      const value = formData[key];
      if (config.required) {
        if (value === undefined || value === null || value === '' ||
            (Array.isArray(value) && value.length === 0)) {
          newErrors[key] = `${config.label || key} is required`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderTemplate = async () => {
    try {
      return await engine.parseAndRender(stripCssBlock(template), {
        ...formData,
        frontmatter: frontMatter,
      });
    } catch (err) {
      console.error('Liquid error:', err);
      return stripCssBlock(template);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const renderedHtml = await renderTemplate();

      let fileName = file.name;
      if (frontMatter.filename) {
        fileName = await engine.parseAndRender(frontMatter.filename, {
          ...formData, frontmatter: frontMatter,
        });
      }

      const metadata = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, JSON.stringify(v)])
      );

      await dispatch(updateFile({
        id:          file.id,
        name:        fileName,
        renderedHtml,
        metadata,
      }));

      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update file');
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) return null;

  if (loaded && Object.keys(fields).length === 0) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent>
          <Alert severity="warning">No schema found for this file.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}
      disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
      <DialogTitle>Edit Data</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {Object.entries(fields).map(([key, config]) => (
            <FieldRenderer
              key={key} fieldKey={key} config={config}
              value={formData} error={errors}
              onChange={setFormData}
              expandedArrays={expandedArrays}
              onToggleArrayExpand={(k, expanded) =>
                setExpandedArrays((prev) => ({ ...prev, [k]: expanded }))}
              disabled={loading}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
