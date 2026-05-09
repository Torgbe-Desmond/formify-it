import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function RenameFileDialog({ open, onClose, fileName, onFileNameChange, onSave, renameFileLoading }) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Rename file</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <TextField
          autoFocus fullWidth disabled={renameFileLoading}
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button disabled={renameFileLoading} onClick={onClose} sx={{ borderRadius: 7 }}>Cancel</Button>
        <Button disabled={renameFileLoading} variant="contained" onClick={onSave} sx={{ borderRadius: 7 }}>
          {renameFileLoading ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
