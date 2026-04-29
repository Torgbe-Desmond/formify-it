import { useState } from 'react';
import {
  Box, Typography, IconButton, Chip,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import MoreHorizIcon                    from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import FolderDeleteRoundedIcon          from '@mui/icons-material/FolderDeleteRounded';
import SchemaRoundedIcon                from '@mui/icons-material/SchemaRounded';
import CheckCircleOutlineRoundedIcon    from '@mui/icons-material/CheckCircleOutlineRounded';
import RemoveRoundedIcon                from '@mui/icons-material/RemoveRounded';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { useNavigate } from 'react-router-dom';

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function FolderRow({ folder, isLast, onClick, onRename, onDelete }) {
  const navigate                    = useNavigate();
  const [anchorEl, setAnchorEl]     = useState(null);
  const menuOpen                    = Boolean(anchorEl);

  const handleMenuClick  = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleMenuClose  = () => setAnchorEl(null);
  const handleRename     = () => { handleMenuClose(); onRename(); };
  const handleDelete     = () => { handleMenuClose(); onDelete(); };
  const handleEditSchema = (e) => { e.stopPropagation(); handleMenuClose(); navigate(`/schema/${folder.id}`); };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr 40px',                  // mobile:  name+meta stacked | actions
          sm: '1fr 80px 80px 120px 40px',  // desktop: name | files | schema | updated | actions
        },
        alignItems: 'center',
        px: { xs: 2, sm: 2.5 },
        py: { xs: 1.5, sm: 1.25 },
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'divider',
        transition: 'background 0.1s',
        '&:hover': { bgcolor: 'action.hover' },
        '&:hover .row-actions': { opacity: 1 },
      }}
    >
      {/* Name + icon — on mobile shows meta underneath */}
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, minWidth: 0 }}>
        <FolderOutlinedIcon sx={{ fontSize: 20, color: "#f0a500", flexShrink: 0, mt: { xs: '2px', sm: 0 } }} />

        <Box sx={{ minWidth: 0 }}>
          {/* Folder name */}
          <Typography
            variant="body2" fontWeight={600} noWrap
            sx={{ '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
          >
            {folder.name}
          </Typography>

          {/* Mobile-only: files + schema + time inline below name */}
          <Box sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            gap: 1,
            mt: 0.4,
            flexWrap: 'wrap',
          }}>
            {/* File count badge */}
            {(folder.fileCount ?? 0) > 0 ? (
              <Chip
                label={`${folder.fileCount} file${folder.fileCount === 1 ? '' : 's'}`}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1 }}
              />
            ) : (
              // <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
              //   No files
              // </Typography>

              <></>
            )}

            {/* Schema dot
            {folder.hasSchema
              ? <CheckCircleOutlineRoundedIcon sx={{ fontSize: 13, color: 'success.main' }} />
              : <RemoveRoundedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
            } */}

            {/* Updated time */}
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
              {timeAgo(folder.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* File count — desktop only */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
        {(folder.fileCount ?? 0) > 0 ? (
          <Chip
            label={folder.fileCount}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem', borderRadius: 1 }}
          />
        ) : (
          <Typography variant="caption" color="text.disabled">—</Typography>
        )}
      </Box>

      {/* Has schema — desktop only */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
        {folder.hasSchema
          ? <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16, color: 'success.main' }} />
          : <RemoveRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        }
      </Box>

      {/* Updated time — desktop only */}
      <Typography
        variant="caption" color="text.secondary"
        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 1 }}
      >
        {timeAgo(folder.updatedAt)}
      </Typography>

      {/* Actions — always visible on mobile, hover-only on desktop */}
      <Box
        className="row-actions"
        sx={{
          opacity: { xs: 1, sm: 0 },
          transition: 'opacity 0.15s',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
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
        <MenuItem onClick={handleEditSchema}>
          <ListItemIcon><SchemaRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Schema</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRename}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><FolderDeleteRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}