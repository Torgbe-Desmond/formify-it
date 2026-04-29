import {
  Box, Typography, Button, TextField, InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchIcon     from '@mui/icons-material/Search';

export default function ProjectHeader({ onAddProject, onSearchChange, searchQuery }) {

  return (
    <Box sx={{
      px: { xs: 2, sm: 3 },
      pt: { xs: 2.5, sm: 1 },
      pb: 2,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' },
      justifyContent: 'space-between',
      gap: 2,
    }}>
      {/* Title */}
      <Typography variant="h5" fontWeight={700} component="h1" sx={{ flexShrink: 0 }}>
        Projects
      </Typography>

      {/* Search + New button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: { sm: 520 } }}>
        <TextField
          fullWidth size="small"
          placeholder="Find a project..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'text.secondary' },
            },
          }}
        />

        <Button
          variant="contained"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={onAddProject}
          sx={{ whiteSpace: 'nowrap', borderRadius: 2, px: 2 }}
        >
          New
        </Button>
      </Box>
    </Box>
  );
}