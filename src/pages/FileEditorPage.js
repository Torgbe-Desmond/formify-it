import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, useMediaQuery, useTheme, LinearProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Liquid } from 'liquidjs';

import {
    loadFileById,
    updateFile,
    deleteFile,
    selectCurrentFile,
    selectCurrentContent,
    clearCurrentFile,
    selectFilesLoading,
} from '../store/slices/filesSlice';

import { loadSchema, selectSchemaByFolder, selectEntrySchemaName } from '../store/slices/schemaSlice';

import EditorHeader from '../components/fileEditor/EditorHeader';
import MarkdownEditor from '../components/fileEditor/MarkdownEditor';
import EditorActions from '../components/fileEditor/EditorActions';
import RenameFileDialog from '../components/fileEditor/RenameFileDialog';
import DeleteFileDialog from '../components/fileEditor/DeleteFileDialog';
import EditFileDataDialog from '../components/EditFileDataDialog';
import PaginationPreview from '../components/fileEditor/PaginationPreview';
import EmailComposerDialog from '../components/email/EmailComposerDialog'
import { v4 as uuidv4 } from 'uuid';

import { breadcrumbApi, pdfExport } from '../store/api/apiClient';

function stripCssBlock(content) {
    if (!content) return content;
    return content
        .replace(/<!-- CSS -->[\s\S]*?<!-- \/CSS -->\n?/g, '')
        .replace(/<!-- \/CSS -->\n?/g, '');
}

export default function FileEditorPage() {
    const { fileId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const file = useSelector(selectCurrentFile);
    const storedContent = useSelector(selectCurrentContent);
    const folderSchema = useSelector(selectSchemaByFolder(file?.folderId));
    const entrySchemaName = useSelector(selectEntrySchemaName(file?.folderId));
    const isLoading = useSelector(selectFilesLoading);

    const schema = folderSchema?.schemas?.[entrySchemaName] || null;

    const [content, setContent] = useState('');
    const [renderedContent, setRenderedContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [renameOpen, setRenameOpen] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editDataOpen, setEditDataOpen] = useState(false);
    const [previewMargins, setPreviewMargins] = useState(60);
    const [emailOpen, setEmailOpen] = useState(false);
    const [downloading, setDownloading] = useState(false)

    const open = Boolean(anchorEl);

    // Load file on mount
    useEffect(() => {
        if (!fileId) return;
        dispatch(loadFileById({ id: fileId }));
        return () => {
            dispatch(clearCurrentFile());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId, dispatch]);

    // Load folder schema for template rendering
    useEffect(() => {
        if (!fileId) return;
        const loadFolderSchema = async () => {
            try {
                const res = await breadcrumbApi.get('file', fileId);
                const folder = res?.data.filter((f) => f.type === 'folder')[0];
                if (folder) {
                    dispatch(loadSchema({ folderId: folder.id }));
                }
            } catch (err) {
                console.log(err);
            }
        };
        loadFolderSchema();
    }, [fileId, dispatch]);

    // Sync local state when store updates
    useEffect(() => {
        if (storedContent) setContent(stripCssBlock(storedContent));
        if (file) setNewFileName(file.name || '');
    }, [storedContent, file]);

    // Render Liquid template + inject schema CSS
    useEffect(() => {
        if (!content || !file) {
            setRenderedContent('');
            return;
        }

        const engine = new Liquid();
        const css = schema?.templateCss || '';
        const context = {
            name: file.name || '',
            createdAt: file.createdAt || '',
            updatedAt: file.updatedAt || '',
            ...(file.metadata
                ? Object.fromEntries(
                    Object.entries(file.metadata).map(([k, v]) => {
                        try {
                            // metadata values may be JSON strings (old) or already parsed objects (new)
                            return [k, typeof v === 'string' ? JSON.parse(v) : v];
                        } catch {
                            return [k, v];
                        }
                    })
                )
                : {}),
        };

        engine
            .parseAndRender(content, context)
            .then((html) => {
                setRenderedContent(css.trim() ? `<style>${css}</style>\n${html}` : html);
            })
            .catch(() => {
                setRenderedContent(css.trim() ? `<style>${css}</style>\n${content}` : content);
            });
    }, [content, file, schema]);

    const handleSave = async () => {
        if (!fileId || !file) return;
        await dispatch(
            updateFile({
                id: fileId,
                name: file.name,
                renderedHtml: content,
                metadata: file.metadata || {},
            })
        );
        setIsEditing(false);
    };

    const handleRenameSave = async () => {
        const name = newFileName.trim();
        if (!name || !fileId || !file) return;
        try {
            await dispatch(
                updateFile({
                    id: fileId,
                    name,
                    renderedHtml: content,
                    metadata: file.metadata || {},
                })
            );
            setRenameOpen(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!fileId) return;
        await dispatch(deleteFile({ id: fileId }));
        navigate(-1);
    };

    const handleDownloadPDF = async () => {
        if (!renderedContent || !file) return;
        try {
            setDownloading(true)
            const id = uuidv4()
            const res = await pdfExport.post(id,{
                html: renderedContent,
                filename: file.name,
                margins: previewMargins,
            }, { responseType: 'blob' })

            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            setDownloading(false)
        } catch (err) {
            console.error('PDF export failed:', err);
            setDownloading(false)
            alert('Failed to generate PDF. Please try again.');
        }
    };


    const handleEmailSend = async ({ from, to, subject, body, attachments }) => {
        // Call your backend endpoint here
        await fetch('/api/send-email', {
            method: 'POST',
            body: JSON.stringify({ from, to, subject, body }),
        });
    }

    if (!file) {
        return (
            <Container maxWidth="lg" sx={{}}>
                <Box sx={{ position: "sticky", top: 0, right: 0, left: 0 }} >
                    <LinearProgress aria-label="Loading…" />
                </Box>
            </Container>
        );
    }

    if (downloading) {
        return (
            <Container maxWidth="lg" sx={{}}>
                <Box sx={{ position: "sticky", top: 0, right: 0, left: 0, color: "orange" }} >
                    <LinearProgress aria-label="Loading…" />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ overflowX: 'hidden', pb: isMobile ? '80px' : 4 }}>
            <EditorHeader
                fileName={file.name}
                anchorEl={anchorEl}
                open={open}
                onMenuClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                }}
                onMenuClose={() => setAnchorEl(null)}
                onRenameClick={() => {
                    setAnchorEl(null);
                    setRenameOpen(true);
                }}
                onDeleteClick={() => {
                    setAnchorEl(null);
                    setDeleteOpen(true);
                }}
                onEditMetadataClick={() => {
                    setAnchorEl(null);
                    setEditDataOpen(true);
                }}
                onPDFDownload={handleDownloadPDF}
                onEmailClick={() => {
                    setEmailOpen(true)
                }}
            />

            {isEditing ? (
                <>
                    <MarkdownEditor
                        content={content}
                        onContentChange={setContent}
                        isMobile={isMobile}
                        theme={theme}
                    />
                    <EditorActions
                        onSave={handleSave}
                        onCancel={() => {
                            setContent(stripCssBlock(storedContent));
                            setIsEditing(false);
                        }}
                    />
                </>
            ) : (
                <PaginationPreview
                    content={renderedContent}
                    margins={previewMargins}
                    onMarginChange={setPreviewMargins}
                    onEdit={() => setIsEditing(true)}
                />
            )}

            <RenameFileDialog
                open={renameOpen}
                renameFileLoading={isLoading}
                onClose={() => setRenameOpen(false)}
                fileName={newFileName}
                onFileNameChange={setNewFileName}
                onSave={handleRenameSave}
            />

            <DeleteFileDialog
                open={deleteOpen}
                deleteFileLoading={isLoading}
                onClose={() => setDeleteOpen(false)}
                fileName={file.name}
                onDelete={handleDeleteConfirm}
            />

            <EmailComposerDialog
                open={emailOpen}
                onClose={() => setEmailOpen(false)}
                onSend={handleEmailSend}
            />

            <EditFileDataDialog
                open={editDataOpen}
                onClose={() => setEditDataOpen(false)}
                file={file}
                folderId={file.folderId}
                onSaved={() => {
                    dispatch(loadFileById({ id: fileId }));
                    setEditDataOpen(false);
                }}
            />
        </Container>
    );
}