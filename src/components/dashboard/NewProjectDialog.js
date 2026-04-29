import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button,
} from '@mui/material';

export default function NewProjectDialog({ open, onClose, onCreate, createProjectLoading }) {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onCreate(trimmed);
    setName('');
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>New Project</DialogTitle>
      <DialogContent>
        <TextField
          disabled={createProjectLoading}
          autoFocus fullWidth
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          margin="dense"
          variant="outlined"
          helperText="e.g. Mobile App Redesign, Personal Blog, etc."
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={createProjectLoading} onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={createProjectLoading} onClick={handleCreate}>
          {createProjectLoading ? "Creating" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
