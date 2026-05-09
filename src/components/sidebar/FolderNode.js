import { Box, Typography, Collapse, CircularProgress } from "@mui/material";
import { FolderOutlined as FolderIcon, FolderOpen as FolderOpenIcon, KeyboardArrowRight as ArrowIcon } from "@mui/icons-material";
import { useGetFilesByFolderQuery } from "../../store/api/apiSlice";
import FileNode from "./FileNode";

export default function FolderNode({ folder, activeIds, onNavigate, openFolderId, onFolderToggle, activeSidebarItem, depth = 0 }) {
    const isActiveItem = activeSidebarItem.activeType === "folder" && activeSidebarItem.folderId === folder.id;
    const isOpen = openFolderId === folder.id;
    const { data: files = [], isFetching } = useGetFilesByFolderQuery(folder.id, { skip: !isOpen });

    const handleToggle = (e) => { e.stopPropagation(); onFolderToggle(isOpen ? null : folder.id); };
    const handleNavigate = () => { onNavigate(`/project/${folder.projectId}/folder/${folder.id}`); if (!isOpen) onFolderToggle(folder.id); };

    return (
        <Box>
            <Box onClick={handleNavigate} sx={{
                display: "flex", alignItems: "center", gap: 0.5,
                pl: `${12 + depth * 16}px`, pr: 1, py: "4px",
                cursor: "pointer", borderRadius: "7px", mx: 0.5,
                bgcolor: isActiveItem ? 'rgba(245,158,11,0.18)' : "transparent",
                color: isActiveItem ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s',
                "&:hover": { bgcolor: isActiveItem ? 'rgba(245,158,11,0.22)' : "rgba(255,255,255,0.06)", color: isActiveItem ? '#f59e0b' : 'rgba(255,255,255,0.8)' },
            }}>
                <Box component="span" onClick={handleToggle} sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <ArrowIcon sx={{ fontSize: 13, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", color: 'inherit' }} />
                </Box>
                {isOpen
                    ? <FolderOpenIcon sx={{ fontSize: 14, color: '#f59e0b', flexShrink: 0 }} />
                    : <FolderIcon sx={{ fontSize: 14, color: isActiveItem ? '#f59e0b' : 'rgba(245,158,11,0.5)', flexShrink: 0 }} />
                }
                <Typography noWrap sx={{ fontSize: "12.5px", fontWeight: isActiveItem ? 600 : 400, flex: 1, color: 'inherit' }}>
                    {folder.name}
                </Typography>
                {isFetching && <CircularProgress size={9} sx={{ color: 'rgba(255,255,255,0.3)' }} />}
            </Box>

            <Collapse in={isOpen} unmountOnExit>
                {files.length === 0 && !isFetching && (
                    <Typography sx={{ pl: `${32 + depth * 16}px`, color: "rgba(255,255,255,0.2)", py: "2px", fontSize: "11px", fontStyle: 'italic' }}>
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
                        navigatePath={`/project/${folder.projectId}/folder/${folder.id}/file/${file.id}`}
                    />
                ))}
            </Collapse>
        </Box>
    );
}
