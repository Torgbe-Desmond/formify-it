import { useState } from 'react';
import { Box, Typography, IconButton, Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import FolderDeleteRoundedIcon from '@mui/icons-material/FolderDeleteRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { useNavigate } from 'react-router-dom';

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function FolderRow({ folder, isOnline, isLast, onClick, onRename, onDelete }) {
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
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 40px', sm: '1fr 80px 80px 120px 40px' },
        alignItems: 'center',
        px: 3, py: 1.75,
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid #e8e6e1',
        bgcolor: 'white', transition: 'background 0.1s',
        '&:hover': { bgcolor: '#fafaf8' },
        '&:hover .row-actions': { opacity: 1 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
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
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1, mt: 0.25 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '11.5px' }}>
              {folder.fileCount ?? 0} files · {timeAgo(folder.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
        {(folder.fileCount ?? 0) > 0
          ? <Chip label={folder.fileCount} size="small" sx={{ height: 20, fontSize: '11px', bgcolor: 'rgba(26,31,54,0.06)', border: 'none', '& .MuiChip-label': { px: 1 } }} />
          : <Typography variant="caption" color="text.disabled">—</Typography>}
      </Box>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
        {folder.hasSchema
          ? <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16, color: '#059669' }} />
          : <RemoveRoundedIcon sx={{ fontSize: 16, color: '#e2e0db' }} />}
      </Box>

      <Typography variant="caption" color="text.secondary"
        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 1, fontSize: '12px' }}>
        {timeAgo(folder.updatedAt)}
      </Typography>

      <Box className="row-actions" sx={{ opacity: { xs: 1, sm: 0 }, transition: 'opacity 0.15s', display: 'flex', justifyContent: 'flex-end' }}
        onClick={(e) => e.stopPropagation()}>
        <IconButton size="small" onClick={handleMenuClick}
          sx={{ color: 'text.disabled', '&:hover': { color: '#1a1f36', bgcolor: 'rgba(26,31,54,0.05)' } }}>
          <MoreHorizIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem disabled={!isOnline} onClick={handleEditSchema}>
          <ListItemIcon><SchemaRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Schema</ListItemText>
        </MenuItem>
        <MenuItem disabled={!isOnline} onClick={() => { handleMenuClose(); onRename(); }}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem disabled={!isOnline} onClick={() => { handleMenuClose(); onDelete(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><FolderDeleteRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
