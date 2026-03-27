import { Stack, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import SaveRoundedIcon  from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function EditorActions({ onSave, onCancel, hideMobileBar = false }) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile && !hideMobileBar) {
    return (
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        bgcolor: 'background.paper',
        borderTop: '1px solid', borderColor: 'divider',
        p: 2, display: 'flex', gap: 1.5,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
        zIndex: 1200,
      }}>
        <Button fullWidth variant="outlined" startIcon={<CloseRoundedIcon />} onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth variant="contained" startIcon={<SaveRoundedIcon />} onClick={onSave}>
          Save
        </Button>
      </Box>
    );
  }

  if (isMobile && hideMobileBar) return null;

  return (
    <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
      <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={onSave}>Save</Button>
    </Stack>
  );
}
