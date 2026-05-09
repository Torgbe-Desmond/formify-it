import { Box, Button, TextField, InputAdornment } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { useGetBreadcrumbQuery } from '../../store/api/apiSlice';

export default function FolderBoardHeader({ projectName, onAddFolderClick, searchQuery, onSearchChange, isOnline }) {
  const { projectId } = useParams();
  const { data: crumbs = [], isLoading: loadingBreadcrumbs } = useGetBreadcrumbQuery(
    { type: 'project', id: projectId },
    { skip: !projectId }
  );

  return (
    <Box sx={{ px: { xs: 3, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 2.5 }}>
      <Breadcrumbs crumbs={crumbs} loadingBreadcrumbs={loadingBreadcrumbs} />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: { sm: 480 }, ml: { sm: 'auto' } }}>
          <TextField
            fullWidth size="small" placeholder="Search folders..."
            value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment> } }}
          />
          <Button disabled={!isOnline} variant="contained" size="small" startIcon={<AddRoundedIcon />} onClick={onAddFolderClick}
            sx={{ whiteSpace: 'nowrap', px: 2.5, borderRadius: 7 }}>
            New folder
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
