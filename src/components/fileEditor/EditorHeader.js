import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useParams } from 'react-router-dom';
import { useGetBreadcrumbQuery } from "../../store/api/apiSlice";
import Breadcrumbs from "../Breadcrumbs";

export default function EditorHeader({ fileName, anchorEl, open, isOnline, onMenuClick, onMenuClose, onRenameClick, onDeleteClick, onEditMetadataClick, onPDFDownload, onEmailClick }) {
    const { fileId } = useParams();
    const { data: crumbs = [], isLoading: loadingBreadcrumbs } = useGetBreadcrumbQuery(
        { type: 'file', id: fileId },
        { skip: !fileId }
    );

    return (
        <Box sx={{ display: 'flex', width: "100%", justifyContent: "space-between", alignItems: 'center', gap: 1, pt: { xs: 3, sm: 3.5 }, pb: 2 }}>
            <Breadcrumbs crumbs={crumbs} loadingBreadcrumbs={loadingBreadcrumbs} />

            <IconButton onClick={onMenuClick}
                sx={{ color: 'text.secondary', border: '1px solid #e8e6e1', borderRadius: '8px', flexShrink: 0, '&:hover': { borderColor: '#1a1f36', bgcolor: 'rgba(26,31,54,0.04)' } }}>
                <MoreHorizIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={onMenuClose}>
                <MenuItem disabled={!isOnline} onClick={onRenameClick}>
                    <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Rename File</ListItemText>
                </MenuItem>
                <MenuItem disabled={!isOnline} onClick={onEditMetadataClick}>
                    <ListItemIcon><EditRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit Data</ListItemText>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem disabled={!isOnline} onClick={onPDFDownload}>
                    <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Download PDF</ListItemText>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem disabled={!isOnline} onClick={onDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main' }}><DeleteOutlineRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Delete File</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}
