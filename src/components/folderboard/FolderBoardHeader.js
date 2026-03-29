import {
  Box, Button, TextField,
  InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { breadcrumbApi } from '../../store/api/apiClient';
import Breadcrumbs from '../Breadcrumbs';

export default function FolderBoardHeader({
  projectName,
  onAddFolderClick,
  searchQuery,
  onSearchChange,
}) {
  const { projectId } = useParams();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    if (!projectId) return;

    const fetchBreadcrumb = async () => {
      try {
        const res = await breadcrumbApi.get('project', projectId);
        setCrumbs(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBreadcrumb();
  }, [projectId]);

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2.5, sm: 3 }, pb: 2 }}>
      {/* Breadcrumb */}
  
      <Breadcrumbs crumbs={crumbs}/>

      {/* Title + search + button */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 1.5,
      }}>
        {/* <Typography variant="h5" fontWeight={700} sx={{ flexShrink: 0 }}>
          {projectName || 'Project'}
        </Typography> */}

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