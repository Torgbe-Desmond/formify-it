import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    ButtonGroup,
    Button,
    Tooltip,
    useMediaQuery,
    useTheme,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
} from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Liquid } from 'liquidjs';
import yaml from 'js-yaml';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { alpha } from '@mui/material/styles';

import {
    loadSchema,
    upsertSchema,
    selectSchemaByFolder,
    selectSchemasMap,
    selectEntrySchemaName,
    updateNamedSchema,
    addNamedSchema,
    removeNamedSchema,
    renameNamedSchema,
    setEntrySchema,
} from '../store/slices/schemaSlice';

import {
    renameFolder, deleteFolder, selectFolderById, loadFolders,
} from '../store/slices/foldersSlice';

import EditorActions from '../components/fileEditor/EditorActions';
import RenameFileDialog from '../components/fileEditor/RenameFileDialog';
import DeleteFileDialog from '../components/fileEditor/DeleteFileDialog';
import FormSchemaBuilder from '../components/FormSchemaBuilder';
import SchemaEditorHeader from '../components/fileEditor/SchemaEditorHeader';

const SCHEMA_FILE_MIME = 'application/json';
const SCHEMA_FILE_EXT = '.schema.json';

// ── helpers ──────────────────────────────────────────────────────

function parseYamlToBuilder(yamlString) {
    try {
        const parsed = yaml.load(yamlString);
        if (!parsed || typeof parsed !== 'object') return null;
        const fields = Object.entries(parsed.fields || {}).map(([key, val]) => ({
            id: key,
            type: val.type || 'text',
            label: val.label || '',
            required: val.required || false,
            placeholder: val.placeholder || '',
            items: val.items || '',   // for array schema refs
            fields: val.type === 'array' && val.fields ? Object.entries(val.fields).map(([k, v]) => ({
                id: k,
                type: v.type || 'text',
                label: v.label || '',
                required: v.required || false,
                placeholder: v.placeholder || '',
            })) : [],
        }));
        return { name: parsed.name || '', description: parsed.description || '', fields };
    } catch {
        return null;
    }
}

// ── NewSchemaDialog ───────────────────────────────────────────────

function NewSchemaDialog({ open, onClose, onConfirm, existing }) {
    const [value, setValue] = useState('');
    const error = existing.includes(value.trim());

    const handleConfirm = () => {
        const v = value.trim();
        if (!v || error) return;
        onConfirm(v);
        setValue('');
    };

    return (<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>New Schema</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus fullWidth label="Schema name" value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                error={error}
                helperText={error ? 'A schema with this name already exists.' : 'e.g. Address, LineItem, Category'}
                sx={{ mt: 1 }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirm} disabled={!value.trim() || error}>
                Create
            </Button>
        </DialogActions>
    </Dialog>);
}

// ── RenameSchemaDialog ────────────────────────────────────────────

function RenameSchemaDialog({ open, onClose, onConfirm, current, existing }) {
    const [value, setValue] = useState(current);
    useEffect(() => setValue(current), [current]);
    const isDuplicate = existing.filter((n) => n !== current).includes(value.trim());

    return (<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Rename Schema</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus fullWidth label="New name" value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isDuplicate && value.trim() && onConfirm(value.trim())}
                error={isDuplicate}
                helperText={isDuplicate ? 'Name already in use.' : ''}
                sx={{ mt: 1 }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained"
                onClick={() => onConfirm(value.trim())}
                disabled={!value.trim() || isDuplicate || value.trim() === current}>
                Rename
            </Button>
        </DialogActions>
    </Dialog>);
}

// ── Main page ─────────────────────────────────────────────────────

export default function SchemaTemplateEditorPage() {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const p = theme.palette;

    const codeMirrorTheme = createTheme({
        theme: theme.palette.mode,
        settings: {
            background: p.background.paper,
            foreground: p.text.primary,
            caret: p.primary.main,
            selection: alpha(p.primary.main, 0.2),
            selectionMatch: alpha(p.primary.main, 0.1),
            lineHighlight: alpha(p.primary.main, 0.05),
            gutterBackground: p.background.default,
            gutterForeground: p.text.disabled,
            gutterBorder: p.divider,
        },
        styles: [
            { tag: t.comment, color: p.text.disabled, fontStyle: 'italic' },
            { tag: t.keyword, color: p.primary.main, fontWeight: 'bold' },
            { tag: t.string, color: p.mode === 'dark' ? '#a5d6a7' : '#2e7d32' },
            { tag: t.tagName, color: p.primary.main },
            { tag: t.attributeName, color: p.secondary.main },
            { tag: t.attributeValue, color: p.mode === 'dark' ? '#ffcc80' : '#e65100' },
            { tag: t.className, color: p.primary.light },
            { tag: t.propertyName, color: p.primary.main },
            { tag: t.number, color: p.error.main },
            { tag: t.operator, color: p.text.secondary },
            { tag: t.punctuation, color: p.text.secondary },
        ],
    });

    const folderSchema = useSelector(selectSchemaByFolder(folderId));
    const schemasMap = useSelector(selectSchemasMap(folderId));
    const entrySchema = useSelector(selectEntrySchemaName(folderId));
    const folder = useSelector(selectFolderById(folderId));

    // Currently selected schema name in the sidebar
    const [activeSchema, setActiveSchema] = useState('');

    // Per-schema editor state (keyed by schema name)
    const [schemaContent, setSchemaContent] = useState('');
    const [cssContent, setCssContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [renderedContent, setRenderedContent] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [view, setView] = useState('builder');
    const [templateSubView, setTemplateSubView] = useState('html');

    // Builder state for active schema
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([]);
    const [expandedArrays, setExpandedArrays] = useState({});

    // Dialogs
    const [anchorEl, setAnchorEl] = useState(null);
    const [renameOpen, setRenameOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [newSchemaOpen, setNewSchemaOpen] = useState(false);
    const [renameSchemaOpen, setRenameSchemaOpen] = useState(false);
    const [deleteSchemaOpen, setDeleteSchemaOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const fileInputRef = useRef(null);
    const open = Boolean(anchorEl);

    const schemaNames = Object.keys(schemasMap);

    // ── Load on mount ──────────────────────────────────────────────
    useEffect(() => {
        if (!folderId) return;
        dispatch(loadSchema({ folderId }));
        if (!folder) dispatch(loadFolders({ projectId: '' }));
    }, [folderId, dispatch, folder]);

    // ── Sync active schema when folder schema loads ────────────────
    useEffect(() => {
        if (!folderSchema) return;
        const names = Object.keys(folderSchema.schemas || {});
        if (!names.length) return;
        // Pick entry schema or first available
        const initial = names.includes(folderSchema.entrySchema) ? folderSchema.entrySchema : names[0];
        setActiveSchema(initial);
    }, [folderSchema]);

    // ── Load editor state when active schema changes ───────────────
    useEffect(() => {
        if (!activeSchema || !schemasMap[activeSchema]) return;
        const s = schemasMap[activeSchema];
        setSchemaContent(s.schemaYaml || '');
        setCssContent(s.templateCss || '');
        setHtmlContent(s.templateHtml || '');
        const parsed = parseYamlToBuilder(s.schemaYaml || '');
        if (parsed) {
            setName(parsed.name);
            setDescription(parsed.description);
            setFields(parsed.fields);
        } else {
            setName('');
            setDescription('');
            setFields([]);
        }
        setExpandedArrays({});
    }, [activeSchema, schemasMap]);

    // ── Folder name ────────────────────────────────────────────────
    useEffect(() => {
        if (folder) setNewFolderName(folder.name || '');
    }, [folder]);

    // ── Live preview ───────────────────────────────────────────────
    useEffect(() => {
        if (!htmlContent.trim()) {
            setRenderedContent('');
            return;
        }
        const engine = new Liquid();
        let context = {};
        try {
            const parsed = schemaContent ? yaml.load(schemaContent) : {};
            if (parsed?.fields) {
                context = {
                    ...parsed, ...Object.fromEntries(Object.keys(parsed.fields).map((k) => [k, ''])),
                };
            }
        } catch {
            context = {};
        }

        const renderStr = cssContent.trim() ? `<style>${cssContent}</style>\n${htmlContent}` : htmlContent;

        engine.parseAndRender(renderStr, context)
            .then(setRenderedContent)
            .catch(() => setRenderedContent(renderStr));
    }, [cssContent, htmlContent, schemaContent]);

    // ── Schema management ──────────────────────────────────────────

    const handleAddSchema = (schemaName) => {
        dispatch(addNamedSchema({ folderId, schemaName }));
        setActiveSchema(schemaName);
        setIsEditing(true);
        setView('builder');
        setNewSchemaOpen(false);
    };

    const handleRenameSchema = (newName) => {
        dispatch(renameNamedSchema({ folderId, oldName: activeSchema, newName }));
        setActiveSchema(newName);
        setRenameSchemaOpen(false);
    };

    const handleDeleteSchema = () => {
        dispatch(removeNamedSchema({ folderId, schemaName: activeSchema }));
        // Switch to whatever remains
        const remaining = schemaNames.filter((n) => n !== activeSchema);
        setActiveSchema(remaining[0] || '');
        setDeleteSchemaOpen(false);
    };

    const handleSetEntry = (name) => {
        dispatch(setEntrySchema({ folderId, entrySchema: name }));
    };

    // ── Editor helpers ─────────────────────────────────────────────

    const handleGenerateYAML = (yamlString) => {
        setSchemaContent(yamlString);
        const parsed = parseYamlToBuilder(yamlString);
        if (parsed) {
            setName(parsed.name);
            setDescription(parsed.description);
            setFields(parsed.fields);
        }
        // Optimistically update Redux so other components see the change
        dispatch(updateNamedSchema({ folderId, schemaName: activeSchema, patch: { schemaYaml: yamlString } }));
    };

    const flushActiveToRedux = () => {
        dispatch(updateNamedSchema({
            folderId,
            schemaName: activeSchema,
            patch: { schemaYaml: schemaContent, templateHtml: htmlContent, templateCss: cssContent },
        }));
    };

    const handleSave = async () => {
        flushActiveToRedux();
        // Build the full schemas map from Redux (which now has our latest patch)
        const latestMap = {
            ...schemasMap,
            [activeSchema]: { schemaYaml: schemaContent, templateHtml: htmlContent, templateCss: cssContent },
        };
        await dispatch(upsertSchema({ folderId, schemas: latestMap, entrySchema }));
        setIsEditing(false);
        setSnackbar({ open: true, message: 'Schema saved.', severity: 'success' });
    };

    const handleCancelEdit = () => {
        // Reset to last saved state
        const s = schemasMap[activeSchema];
        if (s) {
            setSchemaContent(s.schemaYaml || '');
            setCssContent(s.templateCss || '');
            setHtmlContent(s.templateHtml || '');
        }
        setIsEditing(false);
    };

    // ── Download / Upload ──────────────────────────────────────────

    const handleDownload = () => {
        const payload = { schemas: schemasMap, entrySchema };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: SCHEMA_FILE_MIME });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(folder?.name || 'schema').replace(/\s+/g, '_')}${SCHEMA_FILE_EXT}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.json') && !file.name.endsWith(SCHEMA_FILE_EXT)) {
            setSnackbar({
                open: true, message: 'Invalid file type. Please upload a .schema.json file.', severity: 'error'
            });
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (typeof parsed !== 'object' || parsed === null) throw new Error('Not a valid JSON object.');

                // Support both old flat shape and new multi-schema shape
                if (parsed.schemas && typeof parsed.schemas === 'object') {
                    // New shape
                    Object.entries(parsed.schemas).forEach(([sName, sData]) => {
                        dispatch(addNamedSchema({ folderId, schemaName: sName }));
                        dispatch(updateNamedSchema({ folderId, schemaName: sName, patch: sData }));
                    });
                    if (parsed.entrySchema) dispatch(setEntrySchema({ folderId, entrySchema: parsed.entrySchema }));
                    setActiveSchema(parsed.entrySchema || Object.keys(parsed.schemas)[0] || '');
                } else {
                    // Old flat shape — load into active schema
                    const uploadedYaml = parsed.schemaYaml || '';
                    const uploadedHtml = parsed.templateHtml || '';
                    const uploadedCss = parsed.templateCss || '';
                    setSchemaContent(uploadedYaml);
                    setHtmlContent(uploadedHtml);
                    setCssContent(uploadedCss);
                    dispatch(updateNamedSchema({
                        folderId,
                        schemaName: activeSchema,
                        patch: { schemaYaml: uploadedYaml, templateHtml: uploadedHtml, templateCss: uploadedCss }
                    }));
                    const pb = parseYamlToBuilder(uploadedYaml);
                    if (pb) {
                        setName(pb.name);
                        setDescription(pb.description);
                        setFields(pb.fields);
                    }
                }

                setIsEditing(true);
                setView('builder');
                setSnackbar({ open: true, message: 'Schema uploaded. Review and save when ready.', severity: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: `Failed to parse file: ${err.message}`, severity: 'error' });
            }
        };
        reader.onerror = () => setSnackbar({ open: true, message: 'Failed to read the file.', severity: 'error' });
        reader.readAsText(file);
    };

    const handleDeleteFolder = async () => {
        await dispatch(deleteFolder({ id: folderId }));
        navigate(-1);
    };

    // Names of schemas OTHER than the active one — passed to builder as reference options
    const otherSchemaNames = schemaNames.filter((n) => n !== activeSchema);

    const hasContent = schemaContent || htmlContent || cssContent;
    const isEntrySchema = activeSchema === entrySchema;

    return (<Container maxWidth="lg" sx={{ py: 4, pb: isMobile ? '80px' : 4 }}>
        <SchemaEditorHeader
            fileName={folder?.name || 'Schema Editor'}
            anchorEl={anchorEl} open={open}
            onMenuClick={(e) => setAnchorEl(e.currentTarget)}
            onMenuClose={() => setAnchorEl(null)}
            onEditClick={() => {
                setIsEditing(true);
                setView('builder');
                setAnchorEl(null);
            }}
            onRenameClick={() => {
                setRenameOpen(true);
                setAnchorEl(null);
            }}
            onDeleteClick={() => {
                setDeleteOpen(true);
                setAnchorEl(null);
            }}
        />

        {/* Download / Upload toolbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Box>
                {hasContent && (<Tooltip title="Download all schemas as a .schema.json file">
                    <Button size="small" variant="outlined" startIcon={<DownloadRoundedIcon />}
                        onClick={handleDownload}>
                        Download Schema
                    </Button>
                </Tooltip>)}
                <Tooltip title="Upload a previously downloaded .schema.json file">
                    <Button size="small" variant="outlined" color="secondary"
                        startIcon={<UploadRoundedIcon />} onClick={handleUploadClick}>
                        Upload Schema
                    </Button>
                </Tooltip>
            </Box>
            <input ref={fileInputRef} type="file" accept=".json,.schema.json"
                style={{ display: 'none' }} onChange={handleFileChange} />
            <EditorActions isEditing={isEditing} onSave={handleSave} onCancel={handleCancelEdit}
                hideMobileBar={view === 'builder'} />
        </Box>

        {/* Main layout: sidebar + editor */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>

            {/* ── Schema sidebar ──────────────────────────────────── */}
            <Paper elevation={1} sx={{
                width: isMobile ? '100%' : 220,
                flexShrink: 0,
                borderRadius: 2,
                overflow: 'hidden', ...(isMobile ? { mb: 2 } : {}),
            }}>
                <Box sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="subtitle2" fontWeight={700}>Schemas</Typography>
                    <Tooltip title="Add a new schema">
                        <IconButton size="small" onClick={() => setNewSchemaOpen(true)}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <List dense disablePadding>
                    {schemaNames.length === 0 && (<ListItem>
                        <ListItemText primary={<Typography variant="caption" color="text.secondary">No schemas
                            yet</Typography>} />
                    </ListItem>)}
                    {schemaNames.map((sName) => (<ListItemButton key={sName} selected={sName === activeSchema}
                        onClick={() => {
                            setActiveSchema(sName);
                            setIsEditing(false);
                        }}
                        sx={{ py: 1 }}>
                        <ListItemText
                            primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="body2" fontWeight={sName === activeSchema ? 700 : 400}
                                    sx={{ fontFamily: 'monospace' }}>
                                    {sName}
                                </Typography>
                                {sName === entrySchema && (<Chip label="entry" size="small"
                                    sx={{
                                        fontSize: 9,
                                        height: 16,
                                        bgcolor: 'primary.main',
                                        color: '#fff'
                                    }} />)}
                            </Box>}
                        />
                    </ListItemButton>))}
                </List>
            </Paper>

            {/* ── Editor area ─────────────────────────────────────── */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Active schema toolbar */}
                {activeSchema && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                            {activeSchema}
                        </Typography>

                        {/* Set as entry */}
                        <Tooltip
                            title={isEntrySchema ? 'This is the entry schema' : 'Set as entry schema (used to render files)'}>
                            <span>
                                <IconButton size="small" onClick={() => handleSetEntry(activeSchema)} disabled={isEntrySchema}>
                                    {isEntrySchema ? <StarIcon fontSize="small" color="primary" /> : <StarBorderIcon fontSize="small" />}
                                </IconButton>
                            </span>
                        </Tooltip>

                        {/* Rename */}
                        <Tooltip title="Rename schema">
                            <IconButton size="small" onClick={() => setRenameSchemaOpen(true)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Delete — disabled if only one schema remains */}
                        <Tooltip
                            title={schemaNames.length <= 1 ? 'Cannot delete the last schema' : 'Delete schema'}>
                            <span>
                                <IconButton size="small" color="error"
                                    onClick={() => setDeleteSchemaOpen(true)} disabled={schemaNames.length <= 1}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>

                        {!isEditing && (<Button size="small" variant="outlined" sx={{ ml: 'auto' }}
                            onClick={() => {
                                setIsEditing(true);
                                setView('builder');
                            }}>
                            Edit
                        </Button>)}
                    </Box>)}

                {isEditing ? (<>
                    {/* View tabs */}
                    <Box sx={{ mb: 2 }}>
                        <ButtonGroup>
                            {['builder', 'schema', ...(isEntrySchema ? ['template', 'preview'] : [])].map((v) => (
                                <Button key={v} variant={view === v ? 'contained' : 'outlined'}
                                    onClick={() => setView(v)}>
                                    {v.charAt(0).toUpperCase() + v.slice(1)}
                                </Button>))}
                        </ButtonGroup>
                        {!isEntrySchema && (<Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            Template/preview only available on the entry schema.
                        </Typography>)}
                    </Box>

                    {view === 'builder' && (<FormSchemaBuilder
                        fields={fields} setFields={setFields}
                        name={name} setName={setName}
                        description={description} setDescription={setDescription}
                        expandedArrays={expandedArrays} setExpandedArrays={setExpandedArrays}
                        onGenerate={handleGenerateYAML}
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                        otherSchemas={otherSchemaNames}
                    />)}

                    {view === 'schema' && (<Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>Schema (YAML)</Typography>
                        <TextField multiline minRows={14} fullWidth value={schemaContent}
                            onChange={(e) => setSchemaContent(e.target.value)}
                            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }} />
                    </Box>)}

                    {view === 'template' && isEntrySchema && (<Box sx={{ mb: 4 }}>
                        <Box sx={{ mb: 1.5 }}>
                            <ButtonGroup size="small">
                                {['html', 'css'].map((sub) => (<Button key={sub}
                                    variant={templateSubView === sub ? 'contained' : 'outlined'}
                                    onClick={() => setTemplateSubView(sub)}>
                                    {sub.toUpperCase()}
                                </Button>))}
                            </ButtonGroup>
                        </Box>

                        {templateSubView === 'html' && (<>
                            <Typography variant="subtitle1" gutterBottom>HTML Template +
                                Liquid</Typography>
                            <Paper variant="outlined"
                                sx={{ overflow: 'hidden', borderRadius: 1, bgcolor: 'inherit' }}>
                                <CodeMirror
                                    value={htmlContent}
                                    height="500px"
                                    extensions={[html({})]}
                                    onChange={setHtmlContent}
                                    theme={codeMirrorTheme}
                                    basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: true, tabSize: 2 }}
                                />
                            </Paper>
                        </>)}

                        {templateSubView === 'css' && (<>
                            <Typography variant="subtitle1" gutterBottom>CSS Styles</Typography>
                            <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 1 }}>
                                <CodeMirror
                                    value={cssContent}
                                    height="500px"
                                    extensions={[css()]}
                                    onChange={setCssContent}
                                    theme={codeMirrorTheme}   // ← add this
                                    basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: true, tabSize: 2 }}
                                />
                            </Paper>
                        </>)}
                    </Box>)}

                    {view === 'preview' && isEntrySchema && (
                        <Paper elevation={2} sx={{ p: 3, minHeight: '50vh', borderRadius: 2 }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: renderedContent || '<p>No content to preview yet...</p>' }} />
                        </Paper>)}


                </>) : (<Paper elevation={1} sx={{ p: 3, minHeight: '60vh', borderRadius: 2 }}>
                    {activeSchema ? (<div dangerouslySetInnerHTML={{
                        __html: renderedContent || '<p>No template content yet. Use the Edit button to add one.</p>'
                    }} />) : (<Typography color="text.secondary">
                        Select or create a schema from the sidebar.
                    </Typography>)}
                </Paper>)}
            </Box>
        </Box>

        {/* ── Dialogs ───────────────────────────────────────────── */}

        <NewSchemaDialog
            open={newSchemaOpen}
            onClose={() => setNewSchemaOpen(false)}
            onConfirm={handleAddSchema}
            existing={schemaNames}
        />

        <RenameSchemaDialog
            open={renameSchemaOpen}
            onClose={() => setRenameSchemaOpen(false)}
            onConfirm={handleRenameSchema}
            current={activeSchema}
            existing={schemaNames}
        />

        <Dialog open={deleteSchemaOpen} onClose={() => setDeleteSchemaOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Delete "{activeSchema}"?</DialogTitle>
            <DialogContent>
                <Typography>
                    This will remove the schema definition. Any fields in other schemas that reference{' '}
                    <strong>${activeSchema}</strong> will need to be updated manually.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteSchemaOpen(false)}>Cancel</Button>
                <Button variant="contained" color="error" onClick={handleDeleteSchema}>Delete</Button>
            </DialogActions>
        </Dialog>

        <RenameFileDialog
            open={renameOpen} onClose={() => setRenameOpen(false)}
            fileName={newFolderName} onFileNameChange={setNewFolderName}
            onSave={async () => {
                if (newFolderName.trim() && folderId) {
                    await dispatch(renameFolder({ id: folderId, name: newFolderName.trim() }));
                }
                setRenameOpen(false);
            }}
        />

        <DeleteFileDialog
            open={deleteOpen} onClose={() => setDeleteOpen(false)}
            fileName={folder?.name} onDelete={handleDeleteFolder}
        />

        <Snackbar open={snackbar.open} autoHideDuration={4000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert severity={snackbar.severity}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))} variant="filled">
                {snackbar.message}
            </Alert>
        </Snackbar>
    </Container>);
}
