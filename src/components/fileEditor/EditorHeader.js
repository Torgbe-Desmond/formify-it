import {
    Box, IconButton, Menu,
    MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useParams } from 'react-router-dom';
import { useGetBreadcrumbQuery } from "../../store/api/apiSlice";
import Breadcrumbs from "../Breadcrumbs";

export default function EditorHeader({
    fileName, anchorEl, open,
    onMenuClick, onMenuClose,
    onRenameClick, onDeleteClick, onEditMetadataClick, onPDFDownload, onEmailClick
}) {
    const { fileId } = useParams()
    const { data: crumbs = [], isLoading: loadingBreadcrumbs } = useGetBreadcrumbQuery(
        { type: 'file', id: fileId },
        { skip: !fileId }
    );

    return (
        <Box sx={{ display: 'flex', width: "100%", justifyContent: "space-between", gap: 1, px: { xs: 2, sm: 1 }, pt: { xs: 2, sm: 1.5 }, pb: 2 }}>

            <Breadcrumbs crumbs={crumbs} loadingBreadcrumbs={loadingBreadcrumbs} />

            <IconButton onClick={onMenuClick}>
                <MoreHorizIcon />
            </IconButton>

            <Menu sx={{ borderRadius: 1 }} anchorEl={anchorEl} open={open} onClose={onMenuClose}>
                <MenuItem onClick={onRenameClick}>
                    <ListItemIcon><DriveFileRenameOutlineRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Rename File</ListItemText>
                </MenuItem>
                <MenuItem onClick={onEditMetadataClick}>
                    <ListItemIcon><EditRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit Data</ListItemText>
                </MenuItem>
                <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main' }}>
                        <DeleteOutlineRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete File</ListItemText>
                </MenuItem>
                <MenuItem onClick={onPDFDownload}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download PDF</ListItemText>
                </MenuItem>

                {/* <MenuItem onClick={onEmailClick}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Email</ListItemText>
                </MenuItem> */}
            </Menu>
        </Box>
    );
}
