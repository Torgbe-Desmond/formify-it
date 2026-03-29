import { Box, Typography } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ProjectRow from './ProjectRow';

export default function ProjectList({ projects, onProjectClick, onRenameClick, onDeleteClick }) {
  if (!projects?.length) {
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

        {/* Header row */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 40px',            // mobile:  name | actions
            sm: '1fr 80px 120px 40px', // desktop: name | folders | updated | actions
          },
          px: { xs: 2, sm: 2.5 }, py: 1,
          bgcolor: 'action.hover',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Name
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
            Folders
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            Updated
          </Typography>
          <Box />
        </Box>

        {/* Data rows */}
        {projects.map((project, idx) => (
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