import { Box, Typography } from "@mui/material";
import { InsertDriveFileOutlined as FileIcon } from "@mui/icons-material";

// Fix #1: buildPath removed from here — it now lives in Sidebarutils.js

/**
 * Renders a single file row inside an expanded folder.
 *
 * Props:
 *  - file             : { id, name }
 *  - activeSidebarItem: { activeType, fileId, ... }
 *  - onNavigate       : (path: string) => void
 *  - navigatePath     : string — pre-built path from parent (avoids per-file breadcrumb API call)
 *  - depth            : indentation level (default 0)
 */
export default function FileNode({ activeSidebarItem, file, onNavigate, navigatePath, depth = 0 }) {
    // Fix #2: removed dead `isActive` variable (was computed but never used for styling)
    // Fix #3: removed useParams() — path comes from parent via navigatePath prop
    const isActiveItem = activeSidebarItem.activeType === "file" && activeSidebarItem.fileId === file.id;

    // Fix #4 & #5: no longer calls useGetBreadcrumbQuery on every mount.
    // The parent (FolderNode) already knows projectId + folderId and passes the
    // pre-built path down, so there's no API call and no silent no-op on click.
    const handleClick = () => {
        if (navigatePath) onNavigate(navigatePath);
    };

    return (
        <Box
            onClick={handleClick}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                pl: `${28 + depth * 16}px`,
                pr: 1,
                py: "3px",
                cursor: navigatePath ? "pointer" : "default",
                borderRadius: "6px",
                mx: 0.5,
                bgcolor: isActiveItem ? "primary.main" : "transparent",
                color: isActiveItem ? "primary.contrastText" : "text.primary",
                transition: "background 0.15s",
                "&:hover": {
                    bgcolor: isActiveItem ? "primary.dark" : "action.hover",
                },
            }}
        >
            <FileIcon
                sx={{
                    fontSize: 13,
                    flexShrink: 0,
                    color: isActiveItem ? "primary.contrastText" : "text.secondary",
                }}
            />
            <Typography
                variant="caption"
                noWrap
                sx={{
                    fontSize: "12.5px",
                    fontWeight: isActiveItem ? 600 : 400,
                    flex: 1,
                    minWidth: 0,
                    color: "inherit",
                }}
            >
                {file.name}
            </Typography>
        </Box>
    );
}
