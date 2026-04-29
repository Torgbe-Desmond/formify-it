import { useState, useCallback, useEffect } from "react";
import { Box, Typography, Collapse, CircularProgress } from "@mui/material";
import {
    KeyboardArrowRight as ArrowIcon,
    AccountTreeOutlined as ProjectIcon,
} from "@mui/icons-material";

import { useGetFoldersByProjectQuery } from "../../store/api/apiSlice";
import FolderNode from "./FolderNode";

/**
 * Renders a project row with a collapsible list of its folders.
 *
 * Props:
 *  - project    : { id, name }
 *  - activeIds  : { projectId, folderId, fileId } — parsed from the URL
 *  - onNavigate : (path: string) => void
 */
export default function ProjectNode({ project, activeIds, activeSidebarItem, onNavigate }) {
    // Fix #2: removed dead `isActive` variable
    // Fix #3: removed useParams() — activeIds from props is the source of truth
    const isActiveItem = activeSidebarItem.activeType === "project" && activeSidebarItem.projectId === project.id;
    const isThisProjectActive = activeIds.projectId === project.id;

    const [open, setOpen] = useState(isThisProjectActive);
    const [openFolderId, setOpenFolderId] = useState(
        isThisProjectActive ? activeIds.folderId : null
    );

    // Fix #7: sync open/openFolderId when the active URL changes (e.g. back button, direct link)
    useEffect(() => {
        if (isThisProjectActive) {
            setOpen(true);
            setOpenFolderId((prev) => prev ?? activeIds.folderId);
        }
    }, [isThisProjectActive, activeIds.folderId]);

    const { data: folders = [], isFetching } = useGetFoldersByProjectQuery(
        project.id,
        { skip: !open }
    );

    // Fix #6: toggle open state when the arrow is clicked
    const handleToggle = (e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
    };

    // Fix #6: clicking the project row navigates AND opens the folder list if closed
    const handleNavigate = () => {
        onNavigate(`/project/${project.id}`);
        if (!open) setOpen(true);
    };

    const handleFolderToggle = useCallback((folderId) => {
        setOpenFolderId(folderId);
    }, []);

    return (
        <Box sx={{ mb: 0.25 }}>
            {/* ── Project row ── */}
            <Box
                onClick={handleNavigate}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    pl: "8px",
                    pr: 1,
                    py: "4px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    mx: 0.5,
                    bgcolor: isActiveItem ? "primary.main" : "transparent",
                    color: isActiveItem ? "primary.contrastText" : "text.primary",
                    "&:hover": { bgcolor: isActiveItem ? "primary.dark" : "action.hover" },
                }}
            >
                <Box component="span" onClick={handleToggle} sx={{ display: "flex", alignItems: "center" }}>
                    <ArrowIcon
                        sx={{
                            fontSize: 15,
                            transition: "transform 0.2s",
                            transform: open ? "rotate(90deg)" : "rotate(0deg)",
                        }}
                    />
                </Box>

                <ProjectIcon
                    sx={{ fontSize: 15, color: isActiveItem ? "primary.contrastText" : "primary.main" }}
                />

                <Typography
                    variant="caption"
                    noWrap
                    sx={{ fontSize: "13px", fontWeight: 600, flex: 1 }}
                >
                    {project.name}
                </Typography>

                {isFetching && <CircularProgress size={10} />}
            </Box>

            {/* ── Folder list ── */}
            <Collapse in={open} unmountOnExit>
                {folders.length === 0 && !isFetching && (
                    <Typography
                        variant="caption"
                        sx={{ pl: "28px", color: "text.disabled", py: "2px", fontSize: "11px" }}
                    >
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
