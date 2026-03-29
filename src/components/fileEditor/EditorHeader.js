import {
  Box, Typography, IconButton, Menu,
  MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';

export default function EditorHeader({
  fileName, anchorEl, open,
  onMenuClick, onMenuClose,
  onRenameClick, onDeleteClick, onEditMetadataClick, onPDFDownload
}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIosIcon />
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
        <MenuItem onClick={onRenameClick}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename File</ListItemText>
        </MenuItem>
        <MenuItem onClick={onEditMetadataClick}>
          <ListItemIcon><EditRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Data</ListItemText>
        </MenuItem>
        <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete File</ListItemText>
        </MenuItem>
        <MenuItem onClick={onPDFDownload} >
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
