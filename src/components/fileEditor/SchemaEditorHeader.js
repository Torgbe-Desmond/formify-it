import {
  Box, Typography, IconButton, Menu,
  MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useNavigate } from 'react-router-dom';

export default function SchemaEditorHeader({
  fileName, anchorEl, open,
  onMenuClick, onMenuClose,
  onEditClick, onRenameClick, onDeleteClick,
}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center',  }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="h6" fontWeight={700}
        sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
        title={fileName}
      >
        {fileName}
      </Typography>

      <IconButton onClick={onMenuClick}>
        <MoreHorizIcon />
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
        <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Folder</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
