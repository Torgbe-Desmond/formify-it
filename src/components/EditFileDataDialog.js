import { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, Alert, IconButton, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Liquid } from 'liquidjs';
import yaml from 'js-yaml';
import { useDispatch, useSelector } from 'react-redux';

import { updateFile } from '../store/slices/filesSlice';
import {
  selectSchemaByFolder,
  selectSchemasMap,
  selectEntrySchemaName,
} from '../store/slices/schemaSlice';
import FieldRenderer from './fields/FieldRenderer';

const engine = new Liquid();

const stripCssBlock = (str) => {
  if (!str) return str;
  return str
    .replace(/<!-- CSS -->[\s\S]*?<!-- \/CSS -->\n?/g, '')
    .replace(/<!-- \/CSS -->\n?/g, '');
};

function flattenMetadata(data) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, JSON.stringify(v)])
  );
}

function parseMetadata(metadataArray) {
  const map = {};
  (Array.isArray(metadataArray) ? metadataArray : []).forEach((item) => {
    try { map[item.key] = JSON.parse(item.value); }
    catch { map[item.key] = item.value; }
  });
  return map;
}

function buildInitialData(fieldsMap, existingMap, schemasMap, parsedCache, depth = 0) {
  if (!fieldsMap || depth > 10) return {};
  const result = {};

  Object.entries(fieldsMap).forEach(([key, cfg]) => {
    const existing = existingMap?.[key];

    if (cfg.type === 'array') {
      result[key] = Array.isArray(existing) ? existing : (cfg.default ?? []);
      return;
    }

    if (cfg.type?.startsWith('$')) {
      const refName = cfg.type.replace(/^\$/, '');
      const nestedFields = getFieldsFromRef(refName, schemasMap, parsedCache);
      const nestedExisting = (typeof existing === 'object' && existing !== null) ? existing : {};
      result[key] = nestedFields
        ? buildInitialData(nestedFields, nestedExisting, schemasMap, parsedCache, depth + 1)
        : nestedExisting;
      return;
    }

    if (existing !== undefined) { result[key] = existing; return; }
    result[key] = cfg.default !== undefined ? cfg.default
      : cfg.type === 'checkbox' ? false
      : cfg.type === 'array'    ? []
      : '';
  });

  return result;
}

function getFieldsFromRef(refName, schemasMap, parsedCache) {
  if (parsedCache.current[refName]) return parsedCache.current[refName];
  const raw = schemasMap?.[refName];
  if (!raw?.schemaYaml) return null;
  try {
    const parsed = yaml.load(raw.schemaYaml);
    parsedCache.current[refName] = parsed?.fields || {};
    return parsedCache.current[refName];
  } catch { return null; }
}

export default function EditFileDataDialog({ open, onClose, file, folderId, onSaved }) {
  const dispatch        = useDispatch();
  const theme           = useTheme();
  const isMobile        = useMediaQuery(theme.breakpoints.down('sm'));

  const folderSchema    = useSelector(selectSchemaByFolder(folderId));
  const schemasMap      = useSelector(selectSchemasMap(folderId));
  const entrySchemaName = useSelector(selectEntrySchemaName(folderId));

  const parsedCache = useRef({});

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
      parsedCache.current = {};
    }
  }, [open]);

  useEffect(() => {
    if (!open || !file || !folderSchema) return;
    try {
      const entryData = folderSchema.schemas?.[entrySchemaName || folderSchema.entrySchema];
      if (!entryData) return;

      const parsed = yaml.load(entryData.schemaYaml || '');
      if (!parsed) return;

      setFields(parsed.fields || {});
      setTemplate(stripCssBlock(entryData.templateHtml || ''));
      setFrontMatter(parsed);

      const existingMap = parseMetadata(file.metadata);
      const initialData = buildInitialData(
        parsed.fields || {},
        existingMap,
        schemasMap,
        parsedCache,
        0
      );

      setFormData(initialData);
      setLoaded(true);
    } catch (err) {
      console.error('Schema parse error:', err);
    }
  }, [open, file, folderSchema, schemasMap, entrySchemaName]);

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

      const metadata = flattenMetadata(formData);

      await dispatch(updateFile({
        id:       file._id,
        name:     fileName,
        content:  renderedHtml,
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
      <Dialog open={open} fullScreen={isMobile} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Edit Data
          {isMobile && (
            <IconButton edge="end" onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
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
    <Dialog
      open={open}
      disableEscapeKeyDown={loading}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{
        sx: isMobile ? {
          // On mobile: slide up from the bottom like a sheet
          m: 0,
          borderRadius: '16px 16px 0 0',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '92dvh',
        } : {},
      }}
    >
      {/* Title row — close X on mobile instead of relying on swipe/back */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: isMobile ? 2 : undefined,
          // Drag handle hint on mobile
          '&::before': isMobile ? {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 36,
            height: 4,
            borderRadius: 2,
            bgcolor: 'divider',
          } : {},
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Edit Data
        </Typography>
        <IconButton
          edge="end"
          onClick={onClose}
          disabled={loading}
          size="small"
          aria-label="close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          // On mobile the content scrolls within the sheet; prevent body scroll
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Stack spacing={2}>
          {Object.entries(fields).map(([key, config]) => (
            <FieldRenderer
              key={key}
              fieldKey={key}
              config={config}
              value={formData}
              error={errors}
              onChange={setFormData}
              expandedArrays={expandedArrays}
              onToggleArrayExpand={(k, expanded) =>
                setExpandedArrays((prev) => ({ ...prev, [k]: expanded }))}
              disabled={loading}
              schemasMap={schemasMap}
              parsedCache={parsedCache}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 1.5 },
          gap: 1,
          // Stack buttons full-width on mobile
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          '& .MuiButton-root': {
            width: { xs: '100%', sm: 'auto' },
          },
        }}
      >
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}