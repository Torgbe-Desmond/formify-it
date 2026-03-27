import {
  Box, Typography, Button, TextField,
  InputAdornment, IconButton,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AddRoundedIcon             from '@mui/icons-material/AddRounded';
import SearchIcon                 from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

export default function FolderBoardHeader({
  projectName,
  onAddFolderClick,
  searchQuery,
  onSearchChange,
}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2.5, sm: 3 }, pb: 2 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
        <IconButton size="small" onClick={() => navigate('/')} sx={{ color: 'text.secondary', p: 0.5 }}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
        </IconButton>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
          onClick={() => navigate('/')}
        >
          Projects
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mx: 0.25 }}>/</Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
          {projectName || '...'}
        </Typography>
      </Box>

      {/* Title + search + button */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 1.5,
      }}>
        <Typography variant="h5" fontWeight={700} sx={{ flexShrink: 0 }}>
          {projectName || 'Project'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: { sm: 480 }, ml: { sm: 'auto' } }}>
          <TextField
            fullWidth size="small"
            placeholder="Find a folder..."
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
            onClick={onAddFolderClick}
            sx={{ whiteSpace: 'nowrap', borderRadius: 2, px: 2 }}
          >
            New Folder
          </Button>
        </Box>
      </Box>
    </Box>
  );
}