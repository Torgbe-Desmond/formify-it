import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Button,
} from '@mui/material';

export default function DeleteFileDialog({
  open, onClose, fileName, onDelete,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete File</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{fileName}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
