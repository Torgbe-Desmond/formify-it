import { Box, Typography, Skeleton } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ProjectRow from './ProjectRow';

const ProjectSkeleton = ({ isLast }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 48px', sm: '1fr 100px 140px 48px' },
    alignItems: 'center',
    px: 3, py: 1.5,
    borderBottom: isLast ? 'none' : '1px solid #e8e6e1',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '9px', flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" sx={{ fontSize: '14px' }} />
        <Skeleton variant="text" width="35%" sx={{ fontSize: '12px' }} />
      </Box>
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
      <Skeleton variant="rounded" width={28} height={20} sx={{ borderRadius: '6px' }} />
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 2 }}>
      <Skeleton variant="text" width={55} sx={{ ml: 'auto' }} />
    </Box>
    <Skeleton variant="circular" width={24} height={24} sx={{ ml: 'auto' }} />
  </Box>
);

export default function ProjectList({ projects, isOnline, loading, isSuccess, onProjectClick, onRenameClick, onDeleteClick }) {
  const isEmpty = isSuccess && projects?.length === 0;

  return (
    <Box sx={{ mx: { xs: 2, sm: 4 }, mt: 1, pb: 4 }}>
      {/* Table header */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 48px', sm: '1fr 100px 140px 48px' },
        px: 3, py: 1.25,
        bgcolor: '#f8f7f4',
        border: '1px solid #e8e6e1',
        borderBottom: '1px solid #e8e6e1',
        borderRadius: '10px 10px 0 0',
      }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>Folders</Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right', pr: 2, display: { xs: 'none', sm: 'block' } }}>Updated</Typography>
        <Box />
      </Box>

      <Box sx={{ border: '1px solid #e8e6e1', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', bgcolor: 'white' }}>
        {loading && (<><ProjectSkeleton /><ProjectSkeleton /><ProjectSkeleton isLast={true} /></>)}

        {isEmpty && (
          <Box sx={{ py: 12, textAlign: 'center', color: 'text.secondary' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(26,31,54,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <FolderRoundedIcon sx={{ fontSize: 28, color: '#94a3b8' }} />
            </Box>
            <Typography variant="body2" fontWeight={600} color="#1a1f36" sx={{ mb: 0.5 }}>No projects yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '13px' }}>Create your first project to get started</Typography>
          </Box>
        )}

        {!loading && projects.map((project, idx) => (
          <ProjectRow
            isOnline={isOnline}
            key={project.id}
            project={project}
            isLast={idx === projects.length - 1}
            onClick={() => onProjectClick(project.id)}
            onRename={() => onRenameClick(project)}
            onDelete={() => onDeleteClick(project)}
          />
        ))}
      </Box>
    </Box>
  );
}
