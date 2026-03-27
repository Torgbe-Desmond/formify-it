import { useState } from 'react';
import {
  Card, Box, Typography, Chip, IconButton,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import FolderRoundedIcon                from '@mui/icons-material/FolderRounded';
import FolderOpenRoundedIcon            from '@mui/icons-material/FolderOpenRounded';
import MoreVertIcon                     from '@mui/icons-material/MoreVert';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon         from '@mui/icons-material/DeleteOutlineRounded';

export default function ProjectCard({ project, onClick, onRename, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen                = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation(); // don't navigate into the project
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleRename = () => { handleMenuClose(); onRename(); };
  const handleDelete = () => { handleMenuClose(); onDelete(); };

  return (
    <Card
      elevation={0}
      variant="outlined"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 2.5 },
        py: 1.5,
        borderRadius: 0,
        cursor: 'pointer',
        transition: 'all 0.12s',
        '&:hover': { bgcolor: 'action.hover' },
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        boxShadow: 'none',
      }}
    >
      {/* Icon + name + folder count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
        <FolderRoundedIcon sx={{ fontSize: 34, color: 'primary.main', flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" fontWeight={500} noWrap>
            {project.name}
          </Typography>
          {project.folderCount !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {project.folderCount} {project.folderCount === 1 ? 'folder' : 'folders'}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Folder count chip + menu button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {project.folderCount > 0 && (
          <Chip
            icon={<FolderOpenRoundedIcon sx={{ fontSize: '14px !important' }} />}
            label={project.folderCount}
            size="small"
            variant="outlined"
            sx={{ height: 22, fontSize: '0.7rem', display: { xs: 'none', sm: 'flex' } }}
          />
        )}

        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ color: 'text.secondary' }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Context menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleRename}>
          <ListItemIcon>
            <DriveFileRenameOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}