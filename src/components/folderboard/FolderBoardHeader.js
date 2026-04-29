import { Box, Button, TextField, InputAdornment } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { useGetBreadcrumbQuery } from '../../store/api/apiSlice';

export default function FolderBoardHeader({
  projectName,
  onAddFolderClick,
  searchQuery,
  onSearchChange,
}) {
  const { projectId } = useParams();

  // Use RTK Query to fetch breadcrumbs
  const { data: crumbs = [], isLoading: loadingBreadcrumbs } = useGetBreadcrumbQuery(
    { type: 'project', id: projectId },
    { skip: !projectId }
  );

  return (
    <Box sx={{ px: { xs: 2, sm: 1 }, pl: { xs: 2.5, sm: 3.5 }, pt: { xs: 2.5, sm: 2 }, pb: 2 }}>
      {/* Breadcrumb */}
      <Breadcrumbs crumbs={crumbs} loadingBreadcrumbs={loadingBreadcrumbs} />

      {/* Title + search + button */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: 1,
            maxWidth: { sm: 480 },
            ml: { sm: 'auto' },
          }}
        >
          <TextField
            fullWidth
            size="small"
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