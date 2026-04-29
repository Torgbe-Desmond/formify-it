import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Button,
} from '@mui/material';

export default function DeleteFolderDialog({
  open, onClose, folderName, onDelete, deleteFolderLoading
}) {
  return (
    <Dialog open={open}  fullWidth maxWidth="xs">
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{folderName}"? This will also delete
          all files inside. This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={deleteFolderLoading} onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" disabled={deleteFolderLoading} onClick={onDelete}>
          {deleteFolderLoading ? "Deleting" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
