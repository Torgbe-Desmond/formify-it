import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button,
} from '@mui/material';

export default function NewFolderDialog({ open, createFolderLoading, onClose, onCreate }) {
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent>
        <TextField
          disabled={createFolderLoading}
          autoFocus fullWidth
          label="Folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          margin="dense"
          variant="outlined"
          helperText="e.g. Weekly Reports, Invoices, etc."
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={createFolderLoading} onClick={handleClose}>Cancel</Button>
        <Button variant="contained" disabled={createFolderLoading} onClick={handleCreate}>
          {createFolderLoading ? "Creating.." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
