import { Dialog, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function DeleteFileDialog({ open, onClose, fileName, onDelete, deleteFileLoading }) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningAmberRoundedIcon sx={{ color: '#dc2626', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography fontWeight={700} color="#1a1f36" sx={{ mb: 0.75, fontSize: '15px' }}>Delete file?</Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.6} sx={{ fontSize: '13.5px' }}>
              <strong>"{fileName}"</strong> will be permanently deleted. This cannot be undone.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button disabled={deleteFileLoading} onClick={onClose} sx={{ borderRadius: 7 }}>Cancel</Button>
        <Button disabled={deleteFileLoading} variant="contained" onClick={onDelete}
          sx={{ borderRadius: 7, bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>
          {deleteFileLoading ? "Deleting…" : "Delete file"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
