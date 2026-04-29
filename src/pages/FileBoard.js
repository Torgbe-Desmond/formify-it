import { useState, useEffect, useMemo } from 'react';
import { Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadFiles,
  selectFilesByFolder,
  selectFilesLoading,
  selectFilesSuccess,
} from '../store/slices/filesSlice';

import {
  renameFolder,
  deleteFolder,
  selectFolderById,
  loadFolders,
} from '../store/slices/foldersSlice';

import {
  loadSchema,
} from '../store/slices/schemaSlice';

import AddFile from '../components/AddFile';
import FileBoardHeader from '../components/fileboard/FileBoardHeader';
import FileList from '../components/fileboard/FileList';
import RenameFolderDialog from '../components/fileboard/RenameFolderDialog';
import DeleteFolderDialog from '../components/fileboard/DeleteFolderDialog';

export default function FileBoard() {
  const { folderId, projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const folder = useSelector(selectFolderById(folderId));
  const files = useSelector(selectFilesByFolder(folderId));
  const loading = useSelector(selectFilesLoading);
  const isSuccess = useSelector(selectFilesSuccess)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!folderId) return;
    dispatch(loadFiles({ folderId }));
    dispatch(loadSchema({ folderId }));
    // Load folder data in case of direct navigation
    if (!folder) dispatch(loadFolders({ projectId: null }));
  }, [folderId, dispatch, folder]);

  useEffect(() => {
    if (folder) setNewFolderName(folder.name);
  }, [folder]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const handleMenuClick = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleMenuClose = () => setAnchorEl(null);

  const handleRenameSave = async () => {
    if (!folderId || !newFolderName.trim()) return;
    await dispatch(renameFolder({ id: folderId, name: newFolderName.trim() }));
    setRenameOpen(false);
  };

  const handleDeleteFolder = async () => {
    if (!folderId) return;
    await dispatch(deleteFolder({ id: folderId }));
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
        isSuccess={isSuccess}
        onFileClick={(id) => navigate(`/project/${projectId}/folder/${folderId}/file/${id}`)}
      />

      <AddFile
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        folderId={folderId}
        isLoading={loading}
        isSuccess={isSuccess}
        onFileAdded={() => setIsModalOpen(false)}
      />

      <RenameFolderDialog
        open={renameOpen}
        isSuccess={isSuccess}
        renameFolderLoading={loading}
        onClose={() => setRenameOpen(false)}
        folderName={newFolderName}
        onFolderNameChange={setNewFolderName}
        onSave={handleRenameSave}
      />

      <DeleteFolderDialog
        isSuccess={isSuccess}
        open={deleteConfirmOpen}
        deleteFolderLoading={loading}
        onClose={() => setDeleteConfirmOpen(false)}
        folderName={folder?.name}
        onDelete={handleDeleteFolder}
      />
    </Container>
  );
}
