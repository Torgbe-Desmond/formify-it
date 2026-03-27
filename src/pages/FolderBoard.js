import { useState, useEffect, useMemo } from 'react';
import { Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  selectFoldersByProject,
} from '../store/slices/foldersSlice';

import {
  selectProjectById,
  loadProjects,
} from '../store/slices/projectsSlice';

import FolderBoardHeader  from '../components/folderboard/FolderBoardHeader';
import FolderList         from '../components/folderboard/FolderList';
import NewFolderDialog    from '../components/folderboard/NewFolderDialog';
import RenameFolderDialog from '../components/fileboard/RenameFolderDialog';
import DeleteFolderDialog from '../components/fileboard/DeleteFolderDialog';

export default function FolderBoard() {
  const { projectId } = useParams();
  const navigate      = useNavigate();
  const dispatch      = useDispatch();

  const project = useSelector(selectProjectById(projectId));
  const folders = useSelector(selectFoldersByProject(projectId));

  const [newFolderOpen,     setNewFolderOpen]     = useState(false);
  const [searchQuery,       setSearchQuery]       = useState('');
  const [targetFolder,      setTargetFolder]      = useState(null);
  const [renameOpen,        setRenameOpen]        = useState(false);
  const [renameName,        setRenameName]        = useState('');
  const [deleteOpen,        setDeleteOpen]        = useState(false);

  useEffect(() => {
    dispatch(loadFolders({ projectId }));
    if (!project) dispatch(loadProjects());
  }, [projectId, dispatch, project]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const handleCreateFolder = async (name) => {
    await dispatch(createFolder({ name, projectId }));
    setNewFolderOpen(false);
  };

  const handleRenameOpen = (folder) => {
    setTargetFolder(folder);
    setRenameName(folder.name);
    setRenameOpen(true);
  };

  const handleRenameSave = async () => {
    if (!targetFolder || !renameName.trim()) return;
    await dispatch(renameFolder({ id: targetFolder.id, name: renameName.trim() }));
    setRenameOpen(false);
    setTargetFolder(null);
  };

  const handleDeleteOpen = (folder) => {
    setTargetFolder(folder);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!targetFolder) return;
    await dispatch(deleteFolder({ id: targetFolder.id }));
    setDeleteOpen(false);
    setTargetFolder(null);
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
      <FolderBoardHeader
        projectName={project?.name}
        onAddFolderClick={() => setNewFolderOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FolderList
        folders={filteredFolders}
        onFolderClick={(id) => navigate(`/folder/${id}`)}
        onRenameClick={handleRenameOpen}
        onDeleteClick={handleDeleteOpen}
      />

      <NewFolderDialog
        open={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
        onCreate={handleCreateFolder}
      />

      <RenameFolderDialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        folderName={renameName}
        onFolderNameChange={setRenameName}
        onSave={handleRenameSave}
      />

      <DeleteFolderDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        folderName={targetFolder?.name}
        onDelete={handleDeleteConfirm}
      />
    </Container>
  );
}