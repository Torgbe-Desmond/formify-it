import { Box, Button, TextField, InputAdornment, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import FolderDeleteRoundedIcon from '@mui/icons-material/FolderDeleteRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { useGetBreadcrumbQuery } from '../../store/api/apiSlice';

export default function FileBoardHeader({ folderName, anchorEl, open, isOnline, onMenuClick, onMenuClose, onRenameClick, onAddFileClick, onDeleteClick, onEditSchemaClick, searchQuery, onSearchChange }) {
  const { folderId } = useParams();
  const { data: crumbs = [], isLoading: loadingBreadcrumbs } = useGetBreadcrumbQuery({ type: 'folder', id: folderId }, { skip: !folderId });

  return (
    <Box sx={{ px: { xs: 3, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 2.5 }}>
      <Breadcrumbs crumbs={crumbs} loadingBreadcrumbs={loadingBreadcrumbs} />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: { sm: 480 }, ml: { sm: 'auto' } }}>
          <TextField
            fullWidth size="small" placeholder="Search files..."
            value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment> } }}
          />
          <Button disabled={!isOnline} variant="contained" size="small" startIcon={<AddRoundedIcon />} onClick={onAddFileClick}
            sx={{ whiteSpace: 'nowrap', px: 2.5, borderRadius: 7 }}>
            Add file
          </Button>
          <IconButton size="small" onClick={onMenuClick}
            sx={{ color: 'text.secondary', border: '1px solid #e8e6e1', borderRadius: '8px', '&:hover': { borderColor: '#1a1f36', bgcolor: 'rgba(26,31,54,0.04)' } }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={onMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem disabled={!isOnline} onClick={onEditSchemaClick}>
          <ListItemIcon><SchemaRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Schema</ListItemText>
        </MenuItem>
        <MenuItem disabled={!isOnline} onClick={onRenameClick}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename Folder</ListItemText>
        </MenuItem>
        <MenuItem disabled={!isOnline} onClick={onDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><FolderDeleteRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete Folder</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
