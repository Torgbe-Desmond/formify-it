import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Button,
} from '@mui/material';

export default function DeleteFileDialog({
  open, onClose, fileName, onDelete, deleteFileLoading
}) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Delete File</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{fileName}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={deleteFileLoading} onClick={onClose}>Cancel</Button>
        <Button disabled={deleteFileLoading} color="error" variant="contained" onClick={onDelete}>{deleteFileLoading ? "Deleting" : "Delete"}</Button>
      </DialogActions>
    </Dialog>
  );
}
