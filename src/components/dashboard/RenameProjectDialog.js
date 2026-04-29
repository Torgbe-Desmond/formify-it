import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button,
} from '@mui/material';

export default function RenameProjectDialog({
  open, onClose, projectName, onProjectNameChange, onSave, renameProjectLoading
}) {
  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>Rename Project</DialogTitle>
      <DialogContent>
        <TextField
          disabled={renameProjectLoading}
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
        <Button disabled={renameProjectLoading} onClick={onClose}>Cancel</Button>
        <Button disabled={renameProjectLoading} variant="contained" onClick={onSave}>
          {renameProjectLoading ? "Saving" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}