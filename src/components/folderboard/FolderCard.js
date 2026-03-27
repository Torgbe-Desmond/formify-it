import { useState } from 'react';
import {
  Box, Card, Typography, IconButton, Chip,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import FolderRoundedIcon                from '@mui/icons-material/FolderRounded';
import MoreVertIcon                     from '@mui/icons-material/MoreVert';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import FolderDeleteRoundedIcon          from '@mui/icons-material/FolderDeleteRounded';
import SchemaRoundedIcon                from '@mui/icons-material/SchemaRounded';
import InsertDriveFileRoundedIcon       from '@mui/icons-material/InsertDriveFileRounded';
import { useNavigate } from 'react-router-dom';

export default function FolderCard({ folder, onClick, onRename, onDelete }) {
  const navigate              = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen              = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleRename = () => { handleMenuClose(); onRename(); };
  const handleDelete = () => { handleMenuClose(); onDelete(); };

  const handleEditSchema = (e) => {
    e.stopPropagation();
    handleMenuClose();
    navigate(`/schema/${folder.id}`);
  };

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
        py: 1,
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
      {/* Icon + name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
        <FolderRoundedIcon sx={{ fontSize: 34, color: 'primary.main', flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" fontWeight={500} noWrap>
            {folder.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {folder.fileCount ?? 0} {folder.fileCount === 1 ? 'file' : 'files'}
            {folder.hasSchema ? ' · has schema' : ''}
          </Typography>
        </Box>
      </Box>

      {/* Chips + menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {folder.hasSchema && (
          <Chip
            icon={<SchemaRoundedIcon sx={{ fontSize: '14px !important' }} />}
            label="Schema"
            size="small"
            variant="outlined"
            color="primary"
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

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditSchema}>
          <ListItemIcon><SchemaRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Schema</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleRename}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <FolderDeleteRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
