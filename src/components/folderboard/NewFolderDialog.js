import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

export default function NewFolderDialog({ open, createFolderLoading, onClose, onCreate, isOnline   }) {
  const [name, setName] = useState('');
  const handleCreate = async () => { const t = name.trim(); if (!t) return; await onCreate(t); setName(''); };
  const handleClose = () => { setName(''); onClose(); };

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>Create folder</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '13px' }}>
          Folders hold files that share a schema template.
        </Typography>
        <TextField
          disabled={createFolderLoading || !isOnline}  autoFocus fullWidth
          placeholder="e.g. Weekly Reports"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button  disabled={createFolderLoading} onClick={handleClose} sx={{ borderRadius: 7 }}>Cancel</Button>
        <Button variant="contained" disabled={createFolderLoading || !isOnline} onClick={handleCreate} sx={{ borderRadius: 7 }}>
          {createFolderLoading ? "Creating…" : "Create folder"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
