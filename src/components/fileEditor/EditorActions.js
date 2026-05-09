import { Stack, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function EditorActions({ isEditing, onSave, onCancel, hideMobileBar = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile && !hideMobileBar) {
    return (
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        bgcolor: 'white', borderTop: '1px solid #e8e6e1',
        p: 2, display: 'flex', gap: 1.5,
        boxShadow: '0 -4px 20px rgba(26,31,54,0.08)', zIndex: 1200,
      }}>
        <Button fullWidth variant="outlined" startIcon={<CloseRoundedIcon />} onClick={onCancel} sx={{ borderRadius: 7 }}>
          Cancel
        </Button>
        <Button fullWidth variant="contained" startIcon={<SaveRoundedIcon />} onClick={onSave} sx={{ borderRadius: 7 }}>
          Save
        </Button>
      </Box>
    );
  }

  if (isMobile && hideMobileBar) return null;

  return (
    <Stack direction="row" justifyContent="flex-end" spacing={1} >
      <Button variant="outlined" onClick={onCancel} >Cancel</Button>
      <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={onSave} >{isEditing ? 'Save' : 'Create'}</Button>
    </Stack>
  );
}
