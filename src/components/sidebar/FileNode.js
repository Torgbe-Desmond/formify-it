import { Box, Typography } from "@mui/material";
import { InsertDriveFileOutlined as FileIcon } from "@mui/icons-material";

export default function FileNode({ activeSidebarItem, file, onNavigate, navigatePath, depth = 0 }) {
    const isActiveItem = activeSidebarItem.activeType === "file" && activeSidebarItem.fileId === file.id;
    const handleClick = () => { if (navigatePath) onNavigate(navigatePath); };

    return (
        <Box onClick={handleClick} sx={{
            display: "flex", alignItems: "center", gap: 0.75,
            pl: `${28 + depth * 16}px`, pr: 1, py: "4px",
            cursor: navigatePath ? "pointer" : "default",
            borderRadius: "7px", mx: 0.5,
            bgcolor: isActiveItem ? 'rgba(245,158,11,0.18)' : "transparent",
            color: isActiveItem ? '#f59e0b' : 'rgba(255,255,255,0.45)',
            transition: "background 0.15s",
            "&:hover": { bgcolor: isActiveItem ? 'rgba(245,158,11,0.22)' : "rgba(255,255,255,0.06)", color: isActiveItem ? '#f59e0b' : 'rgba(255,255,255,0.75)' },
        }}>
            <FileIcon sx={{ fontSize: 12, flexShrink: 0, color: 'inherit' }} />
            <Typography noWrap sx={{ fontSize: "12.5px", fontWeight: isActiveItem ? 600 : 400, flex: 1, minWidth: 0, color: 'inherit' }}>
                {file.name}
            </Typography>
        </Box>
    );
}
