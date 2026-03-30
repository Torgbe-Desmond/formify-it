import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Button,
} from '@mui/material';

export default function DeleteProjectDialog({
  open, onClose, projectName, onDelete, deleteProjectLoading
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{projectName}"? This will also delete
          all folders and files inside it. This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={deleteProjectLoading} onClick={onClose}>Cancel</Button>
        <Button disabled={deleteProjectLoading} variant="contained" color="error" onClick={onDelete}>
          {deleteProjectLoading ? "Deleting" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}