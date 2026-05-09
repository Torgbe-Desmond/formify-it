import { Box, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useNavigate } from 'react-router-dom';

export default function SchemaEditorHeader({ fileName, anchorEl, open, onMenuClick, onMenuClose, onEditClick, onRenameClick, onDeleteClick }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, pt: { xs: 3, sm: 3.5 }, pb: 0 }}>
      <IconButton onClick={() => navigate(-1)}
        sx={{ color: 'text.secondary', border: '1px solid #e8e6e1', '&:hover': { borderColor: '#1a1f36', bgcolor: 'rgba(26,31,54,0.04)' } }}>
        <ArrowBackIosRoundedIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <Typography variant="h6" noWrap sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '15px', color: '#1a1f36' }} title={fileName}>
        {fileName}
      </Typography>
      <IconButton onClick={onMenuClick}
        sx={{ color: 'text.secondary', border: '1px solid #e8e6e1', '&:hover': { borderColor: '#1a1f36', bgcolor: 'rgba(26,31,54,0.04)' } }}>
        <MoreHorizIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={onMenuClose}>
        <MenuItem onClick={onEditClick}>
          <ListItemIcon><EditRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Schema</ListItemText>
        </MenuItem>
        <MenuItem onClick={onRenameClick}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename Folder</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><DeleteOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete Folder</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
