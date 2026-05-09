import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

export default function NewProjectDialog({ open, onClose, onCreate, createProjectLoading, isOnline }) {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onCreate(trimmed);
    setName('');
  };

  const handleClose = () => { setName(''); onClose(); };

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>Create project</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '13px' }}>
          Give your project a clear, descriptive name.
        </Typography>
        <TextField
          disabled={createProjectLoading || !isOnline}
          autoFocus fullWidth
          placeholder="e.g. Q4 Campaign Docs"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button disabled={createProjectLoading} onClick={handleClose} sx={{ borderRadius: 7 }}>Cancel</Button>
        <Button variant="contained" disabled={createProjectLoading || !isOnline} onClick={handleCreate} sx={{ borderRadius: 7 }}>
          {createProjectLoading ? "Creating…" : "Create project"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
