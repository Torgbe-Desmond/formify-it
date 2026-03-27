import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Button,
} from '@mui/material';

export default function DeleteFolderDialog({
  open, onClose, folderName, onDelete,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{folderName}"? This will also delete
          all files inside. This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
