import { useState, useMemo } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useRenameProjectMutation,
  useDeleteProjectMutation,
} from '../store/api/apiSlice';

import ProjectHeader from '../components/dashboard/ProjectHeader';
import ProjectList from '../components/dashboard/ProjectList';
import NewProjectDialog from '../components/dashboard/NewProjectDialog';
import RenameProjectDialog from '../components/dashboard/RenameProjectDialog';
import DeleteProjectDialog from '../components/dashboard/DeleteProjectDialog';
import { useOnlineStatus } from '../hooks/useOnlineStatus';


export default function Dashboard() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const { data: projects = [], isLoading: loading, isSuccess } = useGetProjectsQuery();
  const [createProject, { isLoading: createProjectLoading }] = useCreateProjectMutation();
  const [renameProject, { isLoading: renameProjectLoading }] = useRenameProjectMutation();
  const [deleteProject, { isLoading: deleteProjectLoading }] = useDeleteProjectMutation();

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Rename state
  const [targetProject, setTargetProject] = useState(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameName, setRenameName] = useState('');

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  // ── Create ────────────────────────────────────────────────────
  const handleCreate = async (name) => {
    await createProject({ name }).unwrap();
    setNewProjectOpen(false);
  };

  // ── Rename ────────────────────────────────────────────────────
  const handleRenameOpen = (project) => {
    setTargetProject(project);
    setRenameName(project.name);
    setRenameOpen(true);
  };

  const handleRenameSave = async () => {
    if (!targetProject || !renameName.trim()) return;

    await renameProject({
      id: targetProject.id,
      data: { name: renameName.trim() },
    }).unwrap();

    setRenameOpen(false);
    setTargetProject(null);
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDeleteOpen = (project) => {
    setTargetProject(project);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!targetProject) return;

    await deleteProject(targetProject.id).unwrap();

    setDeleteOpen(false);
    setTargetProject(null);
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
      <ProjectHeader
        onAddProject={() => setNewProjectOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ProjectList
        projects={filteredProjects}
        isOnline={isOnline}
        loading={loading}
        isSuccess={isSuccess}
        onProjectClick={(id) => navigate(`/project/${id}`)}
        onRenameClick={handleRenameOpen}
        onDeleteClick={handleDeleteOpen}
      />

      <NewProjectDialog
        createProjectLoading={createProjectLoading}
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreate}
        isOnline={isOnline}
      />

      <RenameProjectDialog
        renameProjectLoading={renameProjectLoading}
        open={renameOpen}
        onClose={() => { setRenameOpen(false); setTargetProject(null); }}
        projectName={renameName}
        onProjectNameChange={setRenameName}
        onSave={handleRenameSave}
        isOnline={isOnline} 
      />

      <DeleteProjectDialog
        deleteProjectLoading={deleteProjectLoading}
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setTargetProject(null); }}
        projectName={targetProject?.name}
        onDelete={handleDeleteConfirm}
        isOnline={isOnline}
      />
    </Container>
  );
}