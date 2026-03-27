import { useState, useEffect, useMemo } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadProjects,
  createProject,
  renameProject,
  deleteProject,
  selectProjects,
  selectProjectsLoading,
} from '../store/slices/projectsSlice';

import ProjectHeader    from '../components/dashboard/ProjectHeader';
import ProjectList      from '../components/dashboard/ProjectList';
import NewProjectDialog from '../components/dashboard/NewProjectDialog';
import RenameProjectDialog from '../components/dashboard/RenameProjectDialog';
import DeleteProjectDialog from '../components/dashboard/DeleteProjectDialog';

export default function Dashboard() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const projects  = useSelector(selectProjects);
  const loading   = useSelector(selectProjectsLoading);

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');

  // Rename state
  const [targetProject,  setTargetProject]  = useState(null);
  const [renameOpen,     setRenameOpen]     = useState(false);
  const [renameName,     setRenameName]     = useState('');

  // Delete state
  const [deleteOpen,     setDeleteOpen]     = useState(false);

  useEffect(() => {
    dispatch(loadProjects());
  }, [dispatch]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  // ── Create ────────────────────────────────────────────────────
  const handleCreate = async (name) => {
    await dispatch(createProject({ name }));
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
    await dispatch(renameProject({ id: targetProject.id, name: renameName.trim() }));
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
    await dispatch(deleteProject({ id: targetProject.id }));
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
        loading={loading}
        onProjectClick={(id) => navigate(`/project/${id}`)}
        onRenameClick={handleRenameOpen}
        onDeleteClick={handleDeleteOpen}
      />

      <NewProjectDialog
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreate}
      />

      <RenameProjectDialog
        open={renameOpen}
        onClose={() => { setRenameOpen(false); setTargetProject(null); }}
        projectName={renameName}
        onProjectNameChange={setRenameName}
        onSave={handleRenameSave}
      />

      <DeleteProjectDialog
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setTargetProject(null); }}
        projectName={targetProject?.name}
        onDelete={handleDeleteConfirm}
      />
    </Container>
  );
}