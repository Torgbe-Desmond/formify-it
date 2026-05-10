import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    useMediaQuery,
    useTheme,
    LinearProgress,
    Box,
    GlobalStyles,
} from '@mui/material';
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

import {
    loadSchema,
    selectSchemaByFolder,
    selectEntrySchemaName,
} from '../store/slices/schemaSlice';

import EditorHeader from '../components/fileEditor/EditorHeader';
import MarkdownEditor from '../components/fileEditor/MarkdownEditor';
import EditorActions from '../components/fileEditor/EditorActions';
import RenameFileDialog from '../components/fileEditor/RenameFileDialog';
import DeleteFileDialog from '../components/fileEditor/DeleteFileDialog';
import EditFileDataDialog from '../components/EditFileDataDialog';
import PaginationPreview from '../components/fileEditor/PaginationPreview';
import EmailComposerDialog from '../components/email/EmailComposerDialog';
import { v4 as uuidv4 } from 'uuid';

import { breadcrumbApi, pdfExport } from '../store/api/apiClient';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

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
    const isOnline = useOnlineStatus();

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
    const [previewMargins, setPreviewMargins] = useState(isMobile ? 16 : 60);
    const [emailOpen, setEmailOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const open = Boolean(anchorEl);

    // Adjust default margins when screen size changes
    useEffect(() => {
        setPreviewMargins(isMobile ? 16 : 60);
    }, [isMobile]);

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

    // Render Liquid template + inject schema CSS with mobile-friendly font scaling
    useEffect(() => {
        if (!content || !file) {
            setRenderedContent('');
            return;
        }

        const engine = new Liquid();
        const css = schema?.templateCss || '';

        // Inject mobile-responsive base styles into the rendered content
        const mobileResetCss = `
            * { box-sizing: border-box; }
            body, html { margin: 0; padding: 0; }
            img { max-width: 100%; height: auto; }
            table { width: 100%; border-collapse: collapse; }
            p, li, td, th, span, div {
                font-size: clamp(14px, 4vw, 16px);
                line-height: 1.6;
                word-break: break-word;
                overflow-wrap: break-word;
            }
            h1 { font-size: clamp(20px, 5vw, 32px); }
            h2 { font-size: clamp(17px, 4.5vw, 26px); }
            h3 { font-size: clamp(15px, 4vw, 22px); }
            h4, h5, h6 { font-size: clamp(14px, 3.5vw, 18px); }
        `;

        const context = {
            name: file.name || '',
            createdAt: file.createdAt || '',
            updatedAt: file.updatedAt || '',
            ...(file.metadata
                ? Object.fromEntries(
                    Object.entries(file.metadata).map(([k, v]) => {
                        try {
                            return [k, typeof v === 'string' ? JSON.parse(v) : v];
                        } catch {
                            return [k, v];
                        }
                    })
                )
                : {}),
        };

        const combinedCss = [mobileResetCss, css].filter(Boolean).join('\n');

        engine
            .parseAndRender(content, context)
            .then((html) => {
                setRenderedContent(
                    combinedCss.trim()
                        ? `<style>${combinedCss}</style>\n${html}`
                        : html
                );
            })
            .catch(() => {
                setRenderedContent(
                    combinedCss.trim()
                        ? `<style>${combinedCss}</style>\n${content}`
                        : content
                );
            });
    }, [content, file, schema, isMobile]);

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
            setDownloading(true);
            const id = uuidv4();
            const res = await pdfExport.post(
                id,
                {
                    html: renderedContent,
                    filename: file.name,
                    margins: previewMargins,
                },
                { responseType: 'blob' }
            );

            const url = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            setDownloading(false);
        } catch (err) {
            console.error('PDF export failed:', err);
            setDownloading(false);
        }
    };

    const handleEmailSend = async ({ from, to, subject, body, attachments }) => {
        await fetch('/api/send-email', {
            method: 'POST',
            body: JSON.stringify({ from, to, subject, body }),
        });
    };

    if (!file || downloading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ position: 'sticky', top: 0, right: 0, left: 0, color: downloading ? 'orange' : 'inherit' }}>
                    <LinearProgress aria-label={downloading ? 'Downloading…' : 'Loading…'} />
                </Box>
            </Container>
        );
    }

    return (
        <>
            {/*
             * Global styles to ensure rendered HTML content inside iframes or
             * dangerouslySetInnerHTML containers is legible on all screen sizes.
             */}
            <GlobalStyles
                styles={{
                    '.file-preview-content': {
                        fontSize: 'clamp(14px, 4vw, 16px)',
                        lineHeight: 1.7,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    },
                    '.file-preview-content img': {
                        maxWidth: '100%',
                        height: 'auto',
                    },
                    '.file-preview-content table': {
                        width: '100%',
                        overflowX: 'auto',
                        display: 'block',
                    },
                }}
            />

            <Container
                maxWidth="lg"
                sx={{
                    overflowX: 'hidden',
                    pb: isMobile ? '80px' : 4,
                    px: { xs: 1.5, sm: 2, md: 3 },
                }}
            >
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
                    onPDFDownload={() => {
                        setAnchorEl(null);
                        handleDownloadPDF();
                    }}
                    onEmailClick={() => setEmailOpen(true)}
                    isOnline={isOnline}
                />

                {isEditing ? (
                    <Box sx={{ mt: { xs: 1, sm: 2 } }}>
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
                    </Box>
                ) : (
                    /*
                     * Preview wrapper — on mobile we remove the "paper page" metaphor
                     * (fixed width, large margins) and let the content flow edge-to-edge
                     * with a comfortable readable width.
                     */
                    <Box
                        sx={{
                            mt: { xs: 1, sm: 2 },
                            // On mobile: full-width, no page frame
                            ...(isMobile && {
                                '& .pagination-preview-paper': {
                                    boxShadow: 'none',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    // Override any fixed width / padding set inside PaginationPreview
                                    width: '100% !important',
                                    maxWidth: '100% !important',
                                    padding: '16px !important',
                                },
                                // Make inner content font bigger & readable
                                '& .pagination-preview-paper *:not(style):not(script)': {
                                    fontSize: 'clamp(14px, 4vw, 16px) !important',
                                    lineHeight: '1.7 !important',
                                    maxWidth: '100%',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                },
                                '& .pagination-preview-paper img': {
                                    maxWidth: '100% !important',
                                    height: 'auto !important',
                                },
                                '& .pagination-preview-paper table': {
                                    display: 'block',
                                    overflowX: 'auto',
                                    width: '100% !important',
                                },
                            }),
                        }}
                    >
                        <PaginationPreview
                            content={renderedContent}
                            margins={previewMargins}
                            onMarginChange={setPreviewMargins}
                            onEdit={() => setIsEditing(true)}
                            isMobile={isMobile}
                        />
                    </Box>
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
        </>
    );
}