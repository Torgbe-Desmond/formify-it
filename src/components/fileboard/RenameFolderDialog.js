import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button,
} from '@mui/material';

export default function RenameFolderDialog({
  open, onClose, folderName, onFolderNameChange, onSave, renameFolderLoading
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Rename Folder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus fullWidth
          label="Folder Name"
          value={folderName}
          onChange={(e) => onFolderNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
          sx={{
            mt: 1,
            '& input': { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: '100%' },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={renameFolderLoading} onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={renameFolderLoading} onClick={onSave}>
          {renameFolderLoading ? "Saving..." : "Save"}
          </Button>
      </DialogActions>
    </Dialog>
  );
}
