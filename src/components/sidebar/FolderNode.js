import { Box, Typography, Collapse, CircularProgress } from "@mui/material";
import {
    FolderOutlined as FolderIcon,
    FolderOpen as FolderOpenIcon,
    KeyboardArrowRight as ArrowIcon,
} from "@mui/icons-material";

import { useGetFilesByFolderQuery } from "../../store/api/apiSlice";
import FileNode from "./FileNode";

/**
 * Renders a folder row with a collapsible list of its files.
 *
 * Props:
 *  - folder         : { id, name, projectId }
 *  - activeIds      : { projectId, folderId, fileId } parsed from the URL
 *  - onNavigate     : (path: string) => void
 *  - openFolderId   : string | null — ID of the currently open folder
 *  - onFolderToggle : (folderId: string | null) => void
 *  - depth          : indentation level (default 0)
 */
export default function FolderNode({
    folder,
    activeIds,
    onNavigate,
    openFolderId,
    onFolderToggle,
    activeSidebarItem,
    depth = 0,
}) {
    // Fix #2: removed dead `isActive` variable
    // Fix #3: removed useParams() — activeIds from props is the source of truth
    const isActiveItem = activeSidebarItem.activeType === "folder" && activeSidebarItem.folderId === folder.id;
    const isOpen = openFolderId === folder.id;

    const { data: files = [], isFetching } = useGetFilesByFolderQuery(
        folder.id,
        { skip: !isOpen }
    );

    const handleToggle = (e) => {
        e.stopPropagation();
        onFolderToggle(isOpen ? null : folder.id);
    };

    const handleNavigate = () => {
        onNavigate(`/project/${folder.projectId}/folder/${folder.id}`);
        if (!isOpen) onFolderToggle(folder.id);
    };

    return (
        <Box>
            {/* ── Folder row ── */}
            <Box
                onClick={handleNavigate}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    pl: `${12 + depth * 16}px`,
                    pr: 1,
                    py: "3px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    mx: 0.5,
                    bgcolor: isActiveItem ? "primary.main" : "transparent",
                    color: isActiveItem ? "primary.contrastText" : "text.primary",
                    "&:hover": { bgcolor: isActiveItem ? "primary.dark" : "action.hover" },
                }}
            >
                {/* Expand / collapse arrow */}
                <Box
                    component="span"
                    onClick={handleToggle}
                    sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
                >
                    <ArrowIcon
                        sx={{
                            fontSize: 14,
                            transition: "transform 0.2s",
                            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                            color: isActiveItem ? "primary.contrastText" : "text.secondary",
                        }}
                    />
                </Box>

                {/* Folder icon — open vs closed */}
                {isOpen ? (
                    <FolderOpenIcon
                        sx={{ fontSize: 15, color: isActiveItem ? "primary.contrastText" : "#f0a500" }}
                    />
                ) : (
                    <FolderIcon
                        sx={{ fontSize: 15, color: isActiveItem ? "primary.contrastText" : "#f0a500" }}
                    />
                )}

                <Typography
                    variant="caption"
                    noWrap
                    sx={{ fontSize: "12.5px", fontWeight: isActiveItem ? 600 : 400, flex: 1, color: "inherit" }}
                >
                    {folder.name}
                </Typography>

                {isFetching && (
                    <CircularProgress
                        size={10}
                        sx={{ color: isActiveItem ? "primary.contrastText" : "text.secondary" }}
                    />
                )}
            </Box>

            {/* ── File list ── */}
            <Collapse in={isOpen} unmountOnExit>
                {files.length === 0 && !isFetching && (
                    <Typography
                        variant="caption"
                        sx={{
                            pl: `${32 + depth * 16}px`,
                            color: "text.disabled",
                            py: "2px",
                            fontSize: "11px",
                        }}
                    >
                        No files
                    </Typography>
                )}

                {files.map((file) => (
                    <FileNode
                        key={file.id}
                        file={file}
                        activeSidebarItem={activeSidebarItem}
                        activeIds={activeIds}
                        onNavigate={onNavigate}
                        depth={depth + 1}
                        // Fix #4 & #5: build the path here where we have full context,
                        // so FileNode doesn't need to fetch breadcrumbs per file
                        navigatePath={`/project/${folder.projectId}/folder/${folder.id}/file/${file.id}`}
                    />
                ))}
            </Collapse>
        </Box>
    );
}
