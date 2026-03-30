import { useState, useEffect, useMemo } from 'react';
import { Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useGetFoldersByProjectQuery,
  useRenameFolderMutation,
  useDeleteFolderMutation,
  useGetFilesByFolderQuery,
} from '../store/api/apiSlice';

import AddFile from '../components/AddFile';
import FileBoardHeader from '../components/fileboard/FileBoardHeader';
import FileList from '../components/fileboard/FileList';
import RenameFolderDialog from '../components/fileboard/RenameFolderDialog';
import DeleteFolderDialog from '../components/fileboard/DeleteFolderDialog';

export default function FileBoard() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  // ── Queries & Mutations ─────────────────────────────
  const { data: files = [], isLoading: loading } = useGetFilesByFolderQuery(folderId);
  const { data: folders = [] } = useGetFoldersByProjectQuery(null); // fallback for folder
  const folder = folders.find(f => f.id === folderId);

  const [renameFolder, { isLoading: renameFolderLoading }] = useRenameFolderMutation();
  const [deleteFolder, { isLoading: deleteFolderLoading }] = useDeleteFolderMutation();

  // ── Local state ─────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (folder) setNewFolderName(folder.name);
  }, [folder]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  const handleMenuClick = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleMenuClose = () => setAnchorEl(null);

  const handleRenameSave = async () => {
    if (!folderId || !newFolderName.trim()) return;
    await renameFolder({ id: folderId, data: { name: newFolderName.trim() } }).unwrap();
    setRenameOpen(false);
  };

  const handleDeleteFolderConfirm = async () => {
    if (!folderId) return;
    await deleteFolder(folderId).unwrap();
    setDeleteConfirmOpen(false);
    navigate(-1);
  };

  const handleEditSchema = () => {
    handleMenuClose();
    navigate(`/schema/${folderId}`);
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
      <FileBoardHeader
        folderName={folder?.name}
        anchorEl={anchorEl}
        open={open}
        onMenuClick={handleMenuClick}
        onMenuClose={handleMenuClose}
        onRenameClick={() => { handleMenuClose(); setRenameOpen(true); }}
        onAddFileClick={() => { handleMenuClose(); setIsModalOpen(true); }}
        onDeleteClick={() => { handleMenuClose(); setDeleteConfirmOpen(true); }}
        onEditSchemaClick={handleEditSchema}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FileList
        files={filteredFiles}
        loading={loading}
        onFileClick={(id) => navigate(`/file/${id}`)}
      />

      <AddFile
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        folderId={folderId}
        onFileAdded={() => setIsModalOpen(false)}
      />

      <RenameFolderDialog
        open={renameOpen}
        renameFolderLoading={renameFolderLoading}
        onClose={() => setRenameOpen(false)}
        folderName={newFolderName}
        onFolderNameChange={setNewFolderName}
        onSave={handleRenameSave}
      />

      <DeleteFolderDialog
        deleteFolderLoading={deleteFolderLoading}
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        folderName={folder?.name}
        onDelete={handleDeleteFolderConfirm}
      />
    </Container>
  );
}