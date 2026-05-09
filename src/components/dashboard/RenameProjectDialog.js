import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function RenameProjectDialog({ open, onClose, projectName, onProjectNameChange, onSave, renameProjectLoading, isOnline }) {
  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>Rename project</DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <TextField
          disabled={renameProjectLoading || !isOnline}
          autoFocus fullWidth
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button disabled={renameProjectLoading} onClick={onClose} sx={{ borderRadius: 7 }}>Cancel</Button>
        <Button disabled={renameProjectLoading || !isOnline} variant="contained" onClick={onSave} sx={{ borderRadius: 7 }}>
          {renameProjectLoading ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
