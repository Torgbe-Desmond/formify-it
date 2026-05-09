import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/Search';

export default function ProjectHeader({ onAddProject, onSearchChange, searchQuery }) {
  return (
    <Box sx={{
      px: { xs: 3, sm: 4 },
      pt: { xs: 4, sm: 5 },
      pb: 3,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      justifyContent: 'space-between',
      gap: 2,
    }}>
      <Box>
        <Typography variant="h5" sx={{ color: '#1a1f36', fontWeight: 700, mb: 0.25 }}>
          Projects
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
          Manage your document projects
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: { sm: 480 }, ml: { sm: 'auto' } }}>
        <TextField
          fullWidth size="small"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={onAddProject}
          sx={{ whiteSpace: 'nowrap', px: 2.5, borderRadius: 7 }}
        >
          New project
        </Button>
      </Box>
    </Box>
  );
}
