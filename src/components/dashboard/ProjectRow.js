import { useState } from 'react';
import {
  Box, Typography, IconButton, Chip,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import FolderRoundedIcon                from '@mui/icons-material/FolderRounded';
import MoreHorizIcon                    from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon         from '@mui/icons-material/DeleteOutlineRounded';

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ProjectRow({ project, isLast, onClick, onRename, onDelete }) {
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
        display: 'grid',
        gridTemplateColumns: '1fr 80px 120px 40px',
        alignItems: 'center',
        px: { xs: 2, sm: 2.5 },
        py: 1.25,
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'divider',
        transition: 'background 0.1s',
        '&:hover': { bgcolor: 'action.hover' },
        '&:hover .row-actions': { opacity: 1 },
      }}
    >
      {/* Name + icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <FolderRoundedIcon sx={{ fontSize: 20, color: '#54aeff', flexShrink: 0 }} />
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{
            color: 'text.primary',
            '&:hover': { color: 'primary.main', textDecoration: 'underline' },
          }}
        >
          {project.name}
        </Typography>
      </Box>

      {/* Folder count */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
        {project.folderCount > 0 ? (
          <Chip
            label={project.folderCount}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem', borderRadius: 1 }}
          />
        ) : (
          <Typography variant="caption" color="text.disabled">—</Typography>
        )}
      </Box>

      {/* Updated time */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 1 }}
      >
        {timeAgo(project.updatedAt)}
      </Typography>

      {/* Actions — fade in on row hover */}
      <Box
        className="row-actions"
        sx={{ opacity: 0, transition: 'opacity 0.15s', display: 'flex', justifyContent: 'flex-end' }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'text.secondary' }}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { elevation: 3, sx: { borderRadius: 2, minWidth: 160 } } }}
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