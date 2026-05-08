import { useState, useEffect, useMemo } from 'react';
import { Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useGetProjectsQuery,
  useGetFoldersByProjectQuery,
  useCreateFolderMutation,
  useRenameFolderMutation,
  useDeleteFolderMutation,
} from '../store/api/apiSlice';

import FolderBoardHeader from '../components/folderboard/FolderBoardHeader';
import FolderList from '../components/folderboard/FolderList';
import NewFolderDialog from '../components/folderboard/NewFolderDialog';
import RenameFolderDialog from '../components/fileboard/RenameFolderDialog';
import DeleteFolderDialog from '../components/fileboard/DeleteFolderDialog';

export default function FolderBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // ── Queries & Mutations ─────────────────────────────
  const { data: projects = [] } = useGetProjectsQuery();
  const project = projects.find(p => p.id === projectId);

  const { data: folders = [], isLoading: loading, isSuccess } = useGetFoldersByProjectQuery(projectId);
  const [createFolder, { isLoading: createFolderLoading, }] = useCreateFolderMutation();
  const [renameFolder, { isLoading: renameFolderLoading, }] = useRenameFolderMutation();
  const [deleteFolder, { isLoading: deleteFolderLoading, }] = useDeleteFolderMutation();

  // ── Local state ─────────────────────────────────────
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetFolder, setTargetFolder] = useState(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (targetFolder) setRenameName(targetFolder.name);
  }, [targetFolder]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [folders, searchQuery]);

  // ── Handlers ───────────────────────────────────────
  const handleCreateFolder = async (name) => {
    if (!projectId) return;
    await createFolder({ projectId, data: { name } }).unwrap();
    setNewFolderOpen(false);
  };

  const handleRenameOpen = (folder) => {
    setTargetFolder(folder);
    setRenameOpen(true);
  };

  const handleRenameSave = async () => {
    if (!targetFolder || !renameName.trim()) return;
    await renameFolder({ id: targetFolder.id, data: { name: renameName.trim() } }).unwrap();
    setRenameOpen(false);
    setTargetFolder(null);
  };

  const handleDeleteOpen = (folder) => {
    setTargetFolder(folder);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!targetFolder) return;
    await deleteFolder(targetFolder.id).unwrap();
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
        loading={loading}
        isSuccess={isSuccess}
        onFolderClick={(id) => navigate(`/project/${projectId}/folder/${id}`)}
        onRenameClick={handleRenameOpen}
        onDeleteClick={handleDeleteOpen}
      />

      <NewFolderDialog
        open={newFolderOpen}
        createFolderLoading={createFolderLoading}
        onClose={() => setNewFolderOpen(false)}
        onCreate={handleCreateFolder}
      />

      <RenameFolderDialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        renameFolderLoading={renameFolderLoading}
        folderName={renameName}
        onFolderNameChange={setRenameName}
        onSave={handleRenameSave}
      />

      <DeleteFolderDialog
        open={deleteOpen}
        deleteFolderLoading={deleteFolderLoading}
        onClose={() => setDeleteOpen(false)}
        folderName={targetFolder?.name}
        onDelete={handleDeleteConfirm}
      />
    </Container>
  );
}