import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Paper,
  TextField, ButtonGroup, Button, Tooltip,
  useMediaQuery, useTheme, Snackbar, Alert,
} from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import UploadRoundedIcon   from '@mui/icons-material/UploadRounded';
import { Liquid } from 'liquidjs';
import yaml from 'js-yaml';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css }  from '@codemirror/lang-css';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadSchema,
  upsertSchema,
  selectSchemaByFolder,
} from '../store/slices/schemaSlice';

import {
  renameFolder,
  deleteFolder,
  selectFolderById,
  loadFolders,
} from '../store/slices/foldersSlice';

import EditorActions      from '../components/fileEditor/EditorActions';
import RenameFileDialog   from '../components/fileEditor/RenameFileDialog';
import DeleteFileDialog   from '../components/fileEditor/DeleteFileDialog';
import FormSchemaBuilder  from '../components/FormSchemaBuilder';
import SchemaEditorHeader from '../components/fileEditor/SchemaEditorHeader';

// ── Schema file format ────────────────────────────────────────────
// A downloaded schema file is a JSON object with three keys:
// { schemaYaml, templateHtml, templateCss }
const SCHEMA_FILE_MIME = 'application/json';
const SCHEMA_FILE_EXT  = '.schema.json';

export default function SchemaTemplateEditorPage() {
  const { folderId } = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const theme        = useTheme();
  const isMobile     = useMediaQuery(theme.breakpoints.down('sm'));

  const schema = useSelector(selectSchemaByFolder(folderId));
  const folder = useSelector(selectFolderById(folderId));

  const [schemaContent,   setSchemaContent]   = useState('');
  const [cssContent,      setCssContent]      = useState('');
  const [htmlContent,     setHtmlContent]     = useState('');
  const [renderedContent, setRenderedContent] = useState('');
  const [isEditing,       setIsEditing]       = useState(false);
  const [view,            setView]            = useState('builder');
  const [templateSubView, setTemplateSubView] = useState('html');

  const [anchorEl,        setAnchorEl]        = useState(null);
  const [renameOpen,      setRenameOpen]      = useState(false);
  const [newFolderName,   setNewFolderName]   = useState('');
  const [deleteOpen,      setDeleteOpen]      = useState(false);

  // Builder state
  const [name,            setName]            = useState('');
  const [description,     setDescription]     = useState('');
  const [fields,          setFields]          = useState([]);
  const [expandedArrays,  setExpandedArrays]  = useState({});

  // Snackbar for upload feedback
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Hidden file input ref for upload
  const fileInputRef = useRef(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!folderId) return;
    dispatch(loadSchema({ folderId }));
    if (!folder) dispatch(loadFolders({ projectId: '' }));
  }, [folderId, dispatch]);

  useEffect(() => {
    if (!schema) return;
    setSchemaContent(schema.schemaYaml   || '');
    setCssContent(schema.templateCss     || '');
    setHtmlContent(schema.templateHtml   || '');
    if (schema.schemaYaml) parseYamlToBuilder(schema.schemaYaml);
  }, [schema]);

  useEffect(() => {
    if (folder) setNewFolderName(folder.name || '');
  }, [folder]);

  // Live preview
  useEffect(() => {
    if (!htmlContent.trim()) { setRenderedContent(''); return; }

    const engine = new Liquid();
    let context  = {};

    try {
      const parsed = schemaContent ? yaml.load(schemaContent) : {};
      if (parsed?.fields) {
        context = {
          ...parsed,
          ...Object.fromEntries(Object.keys(parsed.fields).map((k) => [k, ''])),
        };
      }
    } catch { context = {}; }

    const renderStr = cssContent.trim()
      ? `<style>${cssContent}</style>\n${htmlContent}`
      : htmlContent;

    engine.parseAndRender(renderStr, context)
      .then(setRenderedContent)
      .catch(() => setRenderedContent(renderStr));
  }, [cssContent, htmlContent, schemaContent]);

  const parseYamlToBuilder = (yamlString) => {
    try {
      const parsed = yaml.load(yamlString);
      if (!parsed || typeof parsed !== 'object') return;
      setName(parsed.name || '');
      setDescription(parsed.description || '');
      const parsedFields = Object.entries(parsed.fields || {}).map(([key, val]) => ({
        id:          key,
        type:        val.type || 'text',
        label:       val.label || '',
        required:    val.required || false,
        placeholder: val.placeholder || '',
        fields:      val.type === 'array'
          ? Object.entries(val.fields || {}).map(([k, v]) => ({
              id: k, type: v.type || 'text', label: v.label || '',
              required: v.required || false, placeholder: v.placeholder || '',
            }))
          : [],
      }));
      setFields(parsedFields);
    } catch (err) { console.warn('YAML parse failed:', err); }
  };

  const handleGenerateYAML = (yamlString) => {
    setSchemaContent(yamlString);
    parseYamlToBuilder(yamlString);
  };

  const handleSave = async () => {
    await dispatch(upsertSchema({
      folderId,
      schemaYaml:   schemaContent,
      templateHtml: htmlContent,
      templateCss:  cssContent,
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (schema) {
      setSchemaContent(schema.schemaYaml   || '');
      setCssContent(schema.templateCss     || '');
      setHtmlContent(schema.templateHtml   || '');
    }
    setIsEditing(false);
  };

  const handleDeleteFolder = async () => {
    await dispatch(deleteFolder({ id: folderId }));
    navigate(-1);
  };

  // ── Download ────────────────────────────────────────────────────
  const handleDownload = () => {
    const payload = {
      schemaYaml:   schemaContent,
      templateHtml: htmlContent,
      templateCss:  cssContent,
    };

    const blob     = new Blob([JSON.stringify(payload, null, 2)], { type: SCHEMA_FILE_MIME });
    const url      = URL.createObjectURL(blob);
    const fileName = `${(folder?.name || 'schema').replace(/\s+/g, '_')}${SCHEMA_FILE_EXT}`;

    const a    = document.createElement('a');
    a.href     = url;
    a.download = fileName;
    a.click();

    // Clean up the object URL after download starts
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ── Upload ──────────────────────────────────────────────────────
  const handleUploadClick = () => {
    // Reset the input so the same file can be re-uploaded if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate extension
    if (!file.name.endsWith('.json') && !file.name.endsWith(SCHEMA_FILE_EXT)) {
      setSnackbar({
        open:     true,
        message:  'Invalid file type. Please upload a .schema.json file.',
        severity: 'error',
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        // Validate that the file has the expected structure
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('File is not a valid schema JSON object.');
        }

        const uploadedYaml = parsed.schemaYaml   || '';
        const uploadedHtml = parsed.templateHtml || '';
        const uploadedCss  = parsed.templateCss  || '';

        // Populate all state
        setSchemaContent(uploadedYaml);
        setHtmlContent(uploadedHtml);
        setCssContent(uploadedCss);

        // Sync builder UI from the uploaded YAML
        if (uploadedYaml) parseYamlToBuilder(uploadedYaml);

        // Switch to editing mode so the user can review what was uploaded
        setIsEditing(true);
        setView('builder');

        setSnackbar({
          open:     true,
          message:  'Schema uploaded successfully. Review and save when ready.',
          severity: 'success',
        });
      } catch (err) {
        console.error('Schema upload error:', err);
        setSnackbar({
          open:     true,
          message:  `Failed to parse file: ${err.message}`,
          severity: 'error',
        });
      }
    };

    reader.onerror = () => {
      setSnackbar({
        open:     true,
        message:  'Failed to read the file.',
        severity: 'error',
      });
    };

    reader.readAsText(file);
  };

  const hasContent = schemaContent || htmlContent || cssContent;

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: isMobile ? '80px' : 4 }}>
      <SchemaEditorHeader
        fileName={folder?.name || 'Schema Editor'}
        anchorEl={anchorEl}
        open={open}
        onMenuClick={(e) => setAnchorEl(e.currentTarget)}
        onMenuClose={() => setAnchorEl(null)}
        onEditClick={() => { setIsEditing(true); setView('builder'); setAnchorEl(null); }}
        onRenameClick={() => { setRenameOpen(true); setAnchorEl(null); }}
        onDeleteClick={() => { setDeleteOpen(true); setAnchorEl(null); }}
      />

      {/* ── Download / Upload toolbar ─────────────────────────── */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        flexWrap: 'wrap',
      }}>
        {/* Download — only shown when there is content to download */}
        {hasContent && (
          <Tooltip title="Download schema as a .schema.json file">
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleDownload}
            >
              Download Schema
            </Button>
          </Tooltip>
        )}

        {/* Upload */}
        <Tooltip title="Upload a previously downloaded .schema.json file">
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<UploadRoundedIcon />}
            onClick={handleUploadClick}
          >
            Upload Schema
          </Button>
        </Tooltip>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.schema.json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>

      {isEditing ? (
        <>
          {/* View tabs */}
          <Box sx={{ mb: 2 }}>
            <ButtonGroup>
              {['builder', 'schema', 'template', 'preview'].map((v) => (
                <Button
                  key={v}
                  variant={view === v ? 'contained' : 'outlined'}
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {view === 'builder' && (
            <FormSchemaBuilder
              fields={fields}         setFields={setFields}
              name={name}             setName={setName}
              description={description} setDescription={setDescription}
              expandedArrays={expandedArrays} setExpandedArrays={setExpandedArrays}
              onGenerate={handleGenerateYAML}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          )}

          {view === 'schema' && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>Schema (YAML)</Typography>
              <TextField
                multiline minRows={14} fullWidth
                value={schemaContent}
                onChange={(e) => setSchemaContent(e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
              />
            </Box>
          )}

          {view === 'template' && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ mb: 1.5 }}>
                <ButtonGroup size="small">
                  {['html', 'css'].map((sub) => (
                    <Button
                      key={sub}
                      variant={templateSubView === sub ? 'contained' : 'outlined'}
                      onClick={() => setTemplateSubView(sub)}
                    >
                      {sub.toUpperCase()}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>

              {templateSubView === 'html' && (
                <>
                  <Typography variant="subtitle1" gutterBottom>HTML Template + Liquid</Typography>
                  <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 1 }}>
                    <CodeMirror
                      value={htmlContent} height="500px"
                      extensions={[html({})]}
                      onChange={setHtmlContent}
                      basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: true, tabSize: 2 }}
                    />
                  </Paper>
                </>
              )}

              {templateSubView === 'css' && (
                <>
                  <Typography variant="subtitle1" gutterBottom>CSS Styles</Typography>
                  <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 1 }}>
                    <CodeMirror
                      value={cssContent} height="500px"
                      extensions={[css()]}
                      onChange={setCssContent}
                      basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: true, tabSize: 2 }}
                    />
                  </Paper>
                </>
              )}
            </Box>
          )}

          {view === 'preview' && (
            <Paper elevation={2} sx={{ p: 3, minHeight: '50vh', borderRadius: 2 }}>
              <div dangerouslySetInnerHTML={{
                __html: renderedContent || '<p>No content to preview yet...</p>'
              }} />
            </Paper>
          )}

          <EditorActions
            onSave={handleSave}
            onCancel={handleCancelEdit}
            hideMobileBar={view === 'builder'}
          />
        </>
      ) : (
        <Paper elevation={1} sx={{ p: 3, minHeight: '60vh', borderRadius: 2 }}>
          <div dangerouslySetInnerHTML={{
            __html: renderedContent || '<p>No schema content yet. Use the menu to edit.</p>'
          }} />
        </Paper>
      )}

      <RenameFileDialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        fileName={newFolderName}
        onFileNameChange={setNewFolderName}
        onSave={async () => {
          if (newFolderName.trim() && folderId) {
            await dispatch(renameFolder({ id: folderId, name: newFolderName.trim() }));
          }
          setRenameOpen(false);
        }}
      />

      <DeleteFileDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fileName={folder?.name}
        onDelete={handleDeleteFolder}
      />

      {/* Upload / error feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}