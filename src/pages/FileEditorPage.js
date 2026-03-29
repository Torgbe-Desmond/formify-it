import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, useMediaQuery, useTheme, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Liquid } from 'liquidjs';
// import html2pdf from "html2pdf.js";

import {
  loadFileById,
  updateFile,
  deleteFile,
  selectCurrentFile,
  selectCurrentContent,
  clearCurrentFile,
} from '../store/slices/filesSlice';

import { selectSchemaByFolder } from '../store/slices/schemaSlice';

import EditorHeader      from '../components/fileEditor/EditorHeader';
import MarkdownViewer    from '../components/fileEditor/MarkdownViewer';
import MarkdownEditor    from '../components/fileEditor/MarkdownEditor';
import EditorActions     from '../components/fileEditor/EditorActions';
import RenameFileDialog  from '../components/fileEditor/RenameFileDialog';
import DeleteFileDialog  from '../components/fileEditor/DeleteFileDialog';
import EditFileDataDialog from '../components/EditFileDataDialog';

function stripCssBlock(content) {
  if (!content) return content;
  return content
    .replace(/<!-- CSS -->[\s\S]*?<!-- \/CSS -->\n?/g, '')
    .replace(/<!-- \/CSS -->\n?/g, '');
}

export default function FileEditorPage() {
  const { fileId }  = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const theme       = useTheme();
  const isMobile    = useMediaQuery(theme.breakpoints.down('sm'));

  const file           = useSelector(selectCurrentFile);
  const storedContent  = useSelector(selectCurrentContent);
  const schema         = useSelector(selectSchemaByFolder(file?.folderId));

  const [content,         setContent]         = useState('');
  const [renderedContent, setRenderedContent] = useState('');
  const [isEditing,       setIsEditing]       = useState(false);
  const [anchorEl,        setAnchorEl]        = useState(null);
  const [renameOpen,      setRenameOpen]      = useState(false);
  const [newFileName,     setNewFileName]     = useState('');
  const [deleteOpen,      setDeleteOpen]      = useState(false);
  const [editDataOpen,    setEditDataOpen]    = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!fileId) return;
    dispatch(loadFileById({ id: fileId }));
    return () => dispatch(clearCurrentFile());
  }, [fileId, dispatch]);

  useEffect(() => {
    if (storedContent) setContent(stripCssBlock(storedContent));
    if (file)          setNewFileName(file.name || '');
  }, [storedContent, file]);

  useEffect(() => {
    if (!content || !file) { setRenderedContent(''); return; }

    const engine  = new Liquid();
    const css     = schema?.templateCss || '';
    const context = {
      name:      file.name || '',
      createdAt: file.createdAt || '',
      updatedAt: file.updatedAt || '',
      ...(file.metadata
        ? Object.fromEntries(
            Object.entries(file.metadata).map(([k, v]) => {
              try { return [k, JSON.parse(v)]; } catch { return [k, v]; }
            })
          )
        : {}),
    };

    engine.parseAndRender(content, context)
      .then((html) => {
        setRenderedContent(css.trim() ? `<style>${css}</style>\n${html}` : html);
      })
      .catch(() => {
        setRenderedContent(css.trim() ? `<style>${css}</style>\n${content}` : content);
      });
  }, [content, file, schema]);

  const handleSave = async () => {
    if (!fileId || !file) return;
    await dispatch(updateFile({
      id:           fileId,
      name:         file.name,
      renderedHtml: content,
      metadata:     file.metadata || {},
    }));
    setIsEditing(false);
  };

  const handleRenameSave = async () => {
    const name = newFileName.trim();
    if (!name || !fileId || !file) return;
    await dispatch(updateFile({
      id:           fileId,
      name,
      renderedHtml: content,
      metadata:     file.metadata || {},
    }));
    setRenameOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!fileId) return;
    await dispatch(deleteFile({ id: fileId }));
    navigate(-1);
  };


  // const handleDownloadPDF = () => {

  //   if (!renderedContent || !file) {
  //     alert("Nothing to download");
  //     return;
  //   }

  //   // Create a temporary container with the exact rendered HTML (including <style>)
  //   const tempDiv = document.createElement("div");
  //   tempDiv.innerHTML = renderedContent;
  //   tempDiv.style.padding = "40px";           // nice margins for PDF
  //   tempDiv.style.backgroundColor = "#fff";
  //   tempDiv.style.maxWidth = "800px";
  //   tempDiv.style.margin = "0 auto";

  //   // Optional: hide any UI elements you don't want in the PDF
  //   // tempDiv.querySelectorAll('button, .no-print').forEach(el => el.remove());

  //   const opt = {
  //     margin: [10, 10, 10, 10],   // top, right, bottom, left (mm)
  //     filename: `${file.name || "document"}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 2,                   // higher quality
  //       useCORS: true,
  //       letterRendering: true,
  //     },
  //     jsPDF: {
  //       unit: "mm",
  //       format: "a4",
  //       orientation: "portrait",
  //     },
  //   };

  //   html2pdf()
  //     .set(opt)
  //     .from(tempDiv)
  //     .save()
  //     .finally(() => {
  //       // cleanup
  //       tempDiv.remove();
  //     });
  // };

  const isEmpty = !renderedContent || renderedContent.trim() === '';

  if (!file) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading file...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflowX: 'hidden', pb: isMobile ? '80px' : 4 }}>
      <EditorHeader
        fileName={file.name}
        anchorEl={anchorEl}
        open={open}
        onMenuClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
        onMenuClose={() => setAnchorEl(null)}
        onRenameClick={() => { setAnchorEl(null); setRenameOpen(true); }}
        onDeleteClick={() => { setAnchorEl(null); setDeleteOpen(true); }}
        onEditMetadataClick={() => { setAnchorEl(null); setEditDataOpen(true); }}
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
        <MarkdownViewer content={renderedContent} isEmpty={isEmpty} />
      )}

      <RenameFileDialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        fileName={newFileName}
        onFileNameChange={setNewFileName}
        onSave={handleRenameSave}
      />

      <DeleteFileDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fileName={file.name}
        onDelete={handleDeleteConfirm}
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
