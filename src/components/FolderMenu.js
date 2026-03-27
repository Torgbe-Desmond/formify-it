import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

export default function FolderMenu({ anchorEl, open, onClose, onEdit, onDelete }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 4,
        sx: { borderRadius: 2, minWidth: 160, mt: 0.5 }
      }}
    >
      <MenuItem onClick={onEdit}>
        <ListItemIcon><EditRoundedIcon fontSize="small" /></ListItemIcon>
        <ListItemText>Rename Folder</ListItemText>
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <DeleteOutlineRoundedIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete Folder</ListItemText>
      </MenuItem>
    </Menu>
  );
}