import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    IconButton,
    Skeleton,
    Tooltip,
} from "@mui/material";
import {
    ChevronLeft as CollapseIcon,
    ChevronRight as ExpandIcon,
    GridViewOutlined as DashboardIcon,
} from "@mui/icons-material";

import { SIDEBAR_WIDTH, COLLAPSED_WIDTH, parseActivePath, activeRenderedPath } from "./Sidebarutils";
import ProjectNode from "./ProjectNode";
import { useGetProjectsQuery } from "../../store/api/apiSlice";

// ─────────────────────────────────────────────
// AppSidebar
//
// Thin orchestrator — owns only collapsed state
// and the top-level project list. Everything
// else lives in ProjectNode → FolderNode → FileNode.
// ─────────────────────────────────────────────
export default function AppSidebar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const { data: projects = [], isLoading } = useGetProjectsQuery();

    const handleNavigate = useCallback((path) => navigate(path), [navigate]);

    const isDashboard = pathname === "/";
    const activeIds = useMemo(() => parseActivePath(pathname), [pathname]);
    const activeSidebarItem = useMemo(() => activeRenderedPath(pathname), [pathname])

    return (
        <Box
            sx={{
                width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
                minWidth: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
                height: "100vh",
                bgcolor: "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                transition: "width 0.25s ease",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
            }}
        >
            {/* ── Header ── */}
            <SidebarHeader
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed((v) => !v)}
            />

            {/* ── Collapsed view ── */}
            {collapsed && (
                <CollapsedNav
                    isDashboard={isDashboard}
                    onNavigate={handleNavigate}
                />
            )}

            {/* ── Expanded view ── */}
            {!collapsed && (
                <>
                    <DashboardLink isDashboard={isDashboard} onNavigate={handleNavigate} />

                    <SectionLabel label="Projects" />

                    <ProjectList
                        activeSidebarItem={activeSidebarItem}
                        projects={projects}
                        isLoading={isLoading}
                        activeIds={activeIds}
                        onNavigate={handleNavigate}
                    />
                </>
            )}
        </Box>
    );
}

// ─────────────────────────────────────────────
// Sub-components (local to this file — no props drilling needed elsewhere)
// ─────────────────────────────────────────────

function SidebarHeader({ collapsed, onToggleCollapse }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "space-between",
                px: collapsed ? 0 : 1.5,
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
                minHeight: 48,
            }}
        >
            {!collapsed && (
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: "10.5px",
                        color: "text.secondary",
                        letterSpacing: "0.5px",
                    }}
                >
                    Explorer
                </Typography>
            )}

            <Tooltip title={collapsed ? "Expand" : "Collapse"} placement="right">
                <IconButton size="small" onClick={onToggleCollapse} sx={{ color: "text.secondary" }}>
                    {collapsed ? <ExpandIcon fontSize="small" /> : <CollapseIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
        </Box>
    );
}

function CollapsedNav({ isDashboard, onNavigate }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 1, gap: 0.5 }}>
            <Tooltip title="All Projects" placement="right">
                <IconButton
                    onClick={() => onNavigate("/")}
                    color={isDashboard ? "primary" : "default"}
                >
                    <DashboardIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

function DashboardLink({ isDashboard, onNavigate }) {
    return (
        <Box
            onClick={() => onNavigate("/")}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: "6px",
                mx: 0.5,
                mt: 0.5,
                cursor: "pointer",
                borderRadius: "6px",
                bgcolor: isDashboard ? "primary.main" : "transparent",
                color: isDashboard ? "primary.contrastText" : "text.secondary",
                "&:hover": { bgcolor: isDashboard ? "primary.dark" : "action.hover" },
            }}
        >
            <DashboardIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontWeight: isDashboard ? 600 : 400 }}>
                All Projects
            </Typography>
        </Box>
    );
}

function SectionLabel({ label }) {
    return (
        <Box sx={{ px: 1.5, pt: 1.5, pb: 0.5 }}>
            <Typography
                variant="caption"
                sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "text.disabled",
                    letterSpacing: "0.6px",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
}

function ProjectList({ projects, isLoading, activeIds, activeSidebarItem, onNavigate }) {
    if (isLoading) {
        return (
            <Box sx={{ flex: 1, px: 0.5, pb: 2 }}>
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} variant="text" height={28} sx={{ mx: 1, my: 0.5 }} />
                ))}
            </Box>
        );
    }

    if (projects.length === 0) {
        return (
            <Typography variant="caption" sx={{ px: 1.5, color: "text.disabled" }}>
                No projects yet
            </Typography>
        );
    }

    return (
        <Box sx={{ flex: 1, overflowY: "auto", px: 0.5, pb: 2 }}>
            {projects.map((project) => (
                <ProjectNode
                    key={project.id}
                    project={project}
                    activeIds={activeIds}
                    activeSidebarItem={activeSidebarItem}
                    onNavigate={onNavigate}
                />
            ))}
        </Box>
    );
}