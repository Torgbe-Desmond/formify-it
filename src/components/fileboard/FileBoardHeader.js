import {
  Box, Button, TextField, InputAdornment,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import FolderDeleteRoundedIcon from '@mui/icons-material/FolderDeleteRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { useEffect, useState } from 'react';
import { breadcrumbApi } from '../../store/api/apiClient';

export default function FileBoardHeader({
  folderName,
  anchorEl,
  open,
  onMenuClick,
  onMenuClose,
  onRenameClick,
  onAddFileClick,
  onDeleteClick,
  onEditSchemaClick,
  searchQuery,
  onSearchChange,
}) {
  const { folderId } = useParams();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    if (!folderId) return;

    const fetchBreadcrumb = async () => {
      try {
        const res = await breadcrumbApi.get('folder', folderId);
        setCrumbs(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBreadcrumb();
  }, [folderId]);

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2.5, sm: 3 }, pb: 2 }}>
      {/* Breadcrumb */}
      <Breadcrumbs crumbs={crumbs} />

      {/* Title + search + buttons */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 1.5,
      }}>
        {/* <Typography variant="h5" fontWeight={700} sx={{ flexShrink: 0 }}>
          {folderName || 'Folder'}
        </Typography> */}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, maxWidth: { sm: 480 }, ml: { sm: 'auto' } }}>
          <TextField
            fullWidth size="small"
            placeholder="Find a file..."
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
            onClick={onAddFileClick}
            sx={{ whiteSpace: 'nowrap', borderRadius: 2, px: 2 }}
          >
            Add File
          </Button>

          {/* More actions */}
          <IconButton size="small" onClick={onMenuClick} sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl} open={open} onClose={onMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { elevation: 3, sx: { borderRadius: 2, minWidth: 180 } } }}
      >
        <MenuItem onClick={onEditSchemaClick}>
          <ListItemIcon><SchemaRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Schema</ListItemText>
        </MenuItem>
        <MenuItem onClick={onRenameClick}>
          <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename Folder</ListItemText>
        </MenuItem>
        <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}><FolderDeleteRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete Folder</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}