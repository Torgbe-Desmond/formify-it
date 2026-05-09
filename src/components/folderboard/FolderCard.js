import { useState } from 'react';
import { Box, Typography, IconButton, Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import FolderDeleteRoundedIcon from '@mui/icons-material/FolderDeleteRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import { useNavigate } from 'react-router-dom';

export default function FolderCard({ folder, onClick, onRename, onDelete }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleMenuClose = () => setAnchorEl(null);
  const handleEditSchema = (e) => { e.stopPropagation(); handleMenuClose(); navigate(`/schema/${folder.id}`); };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 3, py: 1.75,
        cursor: 'pointer', bgcolor: 'white',
        borderBottom: '1px solid #e8e6e1',
        transition: 'all 0.12s',
        '&:hover': { bgcolor: '#fafaf8' },
        '&:last-child': { borderBottom: 'none' },
        '&:hover .folder-actions': { opacity: 1 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: '9px',
          bgcolor: 'rgba(245,158,11,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <FolderRoundedIcon sx={{ fontSize: 18, color: '#d97706' }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '13.5px', color: '#1a1f36' }}>
            {folder.name}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '12px' }}>
            {folder.fileCount ?? 0} {folder.fileCount === 1 ? 'file' : 'files'}
            {folder.hasSchema ? ' · schema' : ''}
          </Typography>
        </Box>
      </Box>

      <Box className="folder-actions" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, opacity: { xs: 1, sm: 0 }, transition: 'opacity 0.15s' }}>
        {folder.hasSchema && (
          <Chip
            icon={<SchemaRoundedIcon sx={{ fontSize: '12px !important' }} />}
            label="Schema"
            size="small"
            sx={{ height: 22, fontSize: '11px', bgcolor: 'rgba(26,31,54,0.06)', border: 'none', display: { xs: 'none', sm: 'flex' } }}
          />
        )}
        <IconButton size="small" onClick={handleMenuClick}
          sx={{ color: 'text.disabled', '&:hover': { color: '#1a1f36', bgcolor: 'rgba(26,31,54,0.05)' } }}>
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={handleEditSchema}>
          <ListItemIcon><SchemaRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Schema</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); onRename(); }}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); onDelete(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><FolderDeleteRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
