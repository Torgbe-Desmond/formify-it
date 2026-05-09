import { useState, useCallback, useEffect } from "react";
import { Box, Typography, Collapse, CircularProgress } from "@mui/material";
import {
    KeyboardArrowRight as ArrowIcon,
    AccountTreeOutlined as ProjectIcon,
} from "@mui/icons-material";
import { useGetFoldersByProjectQuery } from "../../store/api/apiSlice";
import FolderNode from "./FolderNode";

export default function ProjectNode({ project, activeIds, activeSidebarItem, onNavigate }) {
    const isActiveItem = activeSidebarItem.activeType === "project" && activeSidebarItem.projectId === project.id;
    const isThisProjectActive = activeIds.projectId === project.id;
    const [open, setOpen] = useState(isThisProjectActive);
    const [openFolderId, setOpenFolderId] = useState(isThisProjectActive ? activeIds.folderId : null);

    useEffect(() => {
        if (isThisProjectActive) {
            setOpen(true);
            setOpenFolderId((prev) => prev ?? activeIds.folderId);
        }
    }, [isThisProjectActive, activeIds.folderId]);

    const { data: folders = [], isFetching } = useGetFoldersByProjectQuery(project.id, { skip: !open });

    const handleToggle = (e) => { e.stopPropagation(); setOpen((prev) => !prev); };
    const handleNavigate = () => { onNavigate(`/project/${project.id}`); if (!open) setOpen(true); };
    const handleFolderToggle = useCallback((folderId) => { setOpenFolderId(folderId); }, []);

    return (
        <Box sx={{ mb: 0.25 }}>
            <Box onClick={handleNavigate} sx={{
                display: "flex", alignItems: "center", gap: 0.75,
                pl: "8px", pr: 1, py: "5px",
                cursor: "pointer", borderRadius: "7px", mx: 0.5,
                bgcolor: isActiveItem ? 'rgba(245,158,11,0.18)' : "transparent",
                color: isActiveItem ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.15s',
                "&:hover": { bgcolor: isActiveItem ? 'rgba(245,158,11,0.22)' : "rgba(255,255,255,0.06)", color: isActiveItem ? '#f59e0b' : 'rgba(255,255,255,0.85)' },
            }}>
                <Box component="span" onClick={handleToggle} sx={{ display: "flex", alignItems: "center" }}>
                    <ArrowIcon sx={{
                        fontSize: 14, transition: "transform 0.2s",
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                        color: 'inherit',
                    }} />
                </Box>
                <ProjectIcon sx={{ fontSize: 14, color: isActiveItem ? '#f59e0b' : 'rgba(255,255,255,0.4)' }} />
                <Typography noWrap sx={{ fontSize: "13px", fontWeight: isActiveItem ? 600 : 400, flex: 1, color: 'inherit' }}>
                    {project.name}
                </Typography>
                {isFetching && <CircularProgress size={10} sx={{ color: 'rgba(255,255,255,0.3)' }} />}
            </Box>

            <Collapse in={open} unmountOnExit>
                {folders.length === 0 && !isFetching && (
                    <Typography sx={{ pl: "28px", color: "rgba(255,255,255,0.2)", py: "2px", fontSize: "11px", fontStyle: 'italic' }}>
                        No folders
                    </Typography>
                )}
                {folders.map((folder) => (
                    <FolderNode
                        key={folder.id}
                        folder={folder}
                        activeIds={activeIds}
                        onNavigate={onNavigate}
                        activeSidebarItem={activeSidebarItem}
                        openFolderId={openFolderId}
                        onFolderToggle={handleFolderToggle}
                        depth={0}
                    />
                ))}
            </Collapse>
        </Box>
    );
}
