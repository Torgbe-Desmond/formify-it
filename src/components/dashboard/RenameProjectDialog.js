import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button,
} from '@mui/material';

export default function RenameProjectDialog({
  open, onClose, projectName, onProjectNameChange, onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Rename Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus fullWidth
          label="Project Name"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
          margin="dense"
          sx={{
            '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!projectName?.trim()} onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}