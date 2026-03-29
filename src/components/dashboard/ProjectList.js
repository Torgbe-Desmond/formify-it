import { Box, Typography, Skeleton } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ProjectRow from './ProjectRow';

// Internal component for the loading state
const ProjectSkeleton = ({ isLast }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 48px', sm: '1fr 100px 140px 48px' },
    alignItems: 'center',
    px: { xs: 2, sm: 2.5 },
    py: { xs: 1.5, sm: 1.25 },
    borderBottom: isLast ? 'none' : '1px solid',
    borderColor: 'divider',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Skeleton variant="circular" width={24} height={24} />
      <Box sx={{ width: '60%' }}>
        <Skeleton variant="text" width="80%" sx={{ fontSize: 'body2.fontSize' }} />
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Skeleton variant="text" width="40%" sx={{ fontSize: 'caption.fontSize' }} />
        </Box>
      </Box>
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
      <Skeleton variant="rounded" width={30} height={20} />
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 2 }}>
      <Skeleton variant="text" width={60} sx={{ ml: 'auto' }} />
    </Box>
    <Skeleton variant="circular" width={24} height={24} sx={{ ml: 'auto' }} />
  </Box>
);

export default function ProjectList({ projects, loading, onProjectClick, onRenameClick, onDeleteClick }) {
  
  // Empty State (Only show if not loading and no projects)
  if (!loading && !projects?.length) {
    return (
      <Box sx={{
        mx: { xs: 2, sm: 3 }, mt: 2,
        border: '1px solid', borderColor: 'divider',
        borderRadius: 2, py: 10,
        textAlign: 'center', color: 'text.secondary',
      }}>
        <FolderRoundedIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
        <Typography variant="body1" gutterBottom fontWeight={500}>No projects yet</Typography>
        <Typography variant="body2">Use the menu (⋯) above and select "Add Project" to get started</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: { xs: 1, sm: 3 }, mt: 2, pb: 4 }}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>

        {/* Header row (Visible during loading for context) */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 48px',
            sm: '1fr 100px 140px 48px',
          },
          px: { xs: 2, sm: 2.5 }, py: 1,
          bgcolor: 'action.hover',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase' }}>Name</Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>Folders</Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', textAlign: 'right', display: { xs: 'none', sm: 'block' }, pr: 2 }}>Updated</Typography>
          <Box />
        </Box>

        {/* Loading Rows */}
        {loading && (
          <>
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton isLast={true} />
          </>
        )}

        {/* Real Data Rows */}
        {!loading && projects.map((project, idx) => (
          <ProjectRow
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