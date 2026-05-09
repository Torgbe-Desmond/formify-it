import { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';

export default function ProjectCard({ project, onClick, onRename, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleMenuClose = () => setAnchorEl(null);
  const handleRename = () => { handleMenuClose(); onRename(); };
  const handleDelete = () => { handleMenuClose(); onDelete(); };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 2,
        cursor: 'pointer',
        bgcolor: 'white',
        borderBottom: '1px solid #e8e6e1',
        transition: 'all 0.12s',
        '&:hover': { bgcolor: '#fafaf8', '& .project-icon': { color: '#1a1f36' } },
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
        <Box sx={{
          width: 38, height: 38, borderRadius: '10px',
          bgcolor: 'rgba(26,31,54,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.12s',
        }}>
          <FolderRoundedIcon className="project-icon" sx={{ fontSize: 20, color: '#94a3b8', transition: 'color 0.12s' }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '14px', color: '#1a1f36' }}>
            {project.name}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '12px' }}>
            {project.folderCount ?? 0} {project.folderCount === 1 ? 'folder' : 'folders'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {project.folderCount > 0 && (
          <Chip
            icon={<FolderOpenRoundedIcon sx={{ fontSize: '12px !important' }} />}
            label={project.folderCount}
            size="small"
            sx={{
              height: 22, fontSize: '11px', bgcolor: 'rgba(26,31,54,0.05)',
              border: 'none', display: { xs: 'none', sm: 'flex' },
              '& .MuiChip-label': { px: 1 },
            }}
          />
        )}
        <IconButton
          size="small" onClick={handleMenuClick}
          sx={{ color: 'text.disabled', '&:hover': { color: '#1a1f36', bgcolor: 'rgba(26,31,54,0.05)' } }}
        >
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleRename}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><DeleteOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
