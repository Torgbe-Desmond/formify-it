import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function RenameFolderDialog({ open, onClose, folderName, onFolderNameChange, onSave, renameFolderLoading, isOnline }) {
  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>Rename folder</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <TextField
          autoFocus fullWidth disabled={renameFolderLoading || !isOnline}
          value={folderName}
          onChange={(e) => onFolderNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button disabled={renameFolderLoading} onClick={onClose} sx={{ borderRadius: 7 }}>Cancel</Button>
        <Button variant="contained" disabled={renameFolderLoading || !isOnline} onClick={onSave} sx={{ borderRadius: 7 }}>
          {renameFolderLoading ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
