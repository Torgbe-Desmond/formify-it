import { useState } from 'react';
import { Box, Typography, IconButton, Chip, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

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

export default function ProjectRow({ isOnline, project, isLast, onClick, onRename, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 40px', sm: '1fr 80px 120px 40px' },
        alignItems: 'center',
        px: 3, py: 1.5,
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid #e8e6e1',
        bgcolor: 'white',
        transition: 'background 0.1s',
        '&:hover': { bgcolor: '#fafaf8' },
        '&:hover .row-actions': { opacity: 1 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: '9px',
          bgcolor: 'rgba(26,31,54,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <FolderRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '13.5px', color: '#1a1f36' }}>
            {project.name}
          </Typography>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1, mt: 0.25 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '11.5px' }}>
              {project.folderCount ?? 0} folders · {timeAgo(project.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
        {(project.folderCount ?? 0) > 0
          ? <Chip label={project.folderCount} size="small" sx={{ height: 20, fontSize: '11px', bgcolor: 'rgba(26,31,54,0.06)', border: 'none', '& .MuiChip-label': { px: 1 } }} />
          : <Typography variant="caption" color="text.disabled">—</Typography>
        }
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 1, fontSize: '12.5px' }}>
        {timeAgo(project.updatedAt)}
      </Typography>

      <Box className="row-actions" sx={{ opacity: { xs: 1, sm: 0 }, transition: 'opacity 0.15s', display: 'flex', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
        <IconButton size="small" onClick={handleMenuClick} sx={{ color: 'text.disabled', '&:hover': { color: '#1a1f36', bgcolor: 'rgba(26,31,54,0.05)' } }}>
          <MoreHorizIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem disabled={!isOnline} onClick={() => { handleMenuClose(); onRename(); }}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem disabled={!isOnline} onClick={() => { handleMenuClose(); onDelete(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><DeleteOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

    </Box>
  );
}
