import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button,
} from '@mui/material';

export default function RenameFileDialog({
  open, onClose, fileName, onFileNameChange, onSave,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rename File</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus fullWidth
          label="File name"
          variant="outlined"
          margin="dense"
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
          sx={{ '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
