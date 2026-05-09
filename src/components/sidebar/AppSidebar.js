import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box, Typography, IconButton, Skeleton, Tooltip,
} from "@mui/material";
import {
    ChevronLeft as CollapseIcon,
    ChevronRight as ExpandIcon,
    GridViewOutlined as DashboardIcon,
} from "@mui/icons-material";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { logout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { SIDEBAR_WIDTH, COLLAPSED_WIDTH, parseActivePath, activeRenderedPath } from "./Sidebarutils";
import ProjectNode from "./ProjectNode";
import { useGetProjectsQuery } from "../../store/api/apiSlice";

export default function AppSidebar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { data: projects = [], isLoading } = useGetProjectsQuery();
    const handleNavigate = useCallback((path) => navigate(path), [navigate]);
    const isDashboard = pathname === "/";
    const activeIds = useMemo(() => parseActivePath(pathname), [pathname]);
    const activeSidebarItem = useMemo(() => activeRenderedPath(pathname), [pathname]);

    return (
        <Box sx={{
            width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            minWidth: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            height: "100vh",
            bgcolor: "#1a1f36",
            transition: "width 0.25s ease",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
        }}>
            <SidebarHeader collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />

            {collapsed && <CollapsedNav isDashboard={isDashboard} onNavigate={handleNavigate} />}

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
                    <Logout label="Logout" isDashboard={isDashboard} />
                </>
            )}

            {collapsed && <CollapsedLogout isDashboard={isDashboard} />}
        </Box>
    );
}

function SidebarHeader({ collapsed, onToggleCollapse }) {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 0 : 2,
            py: 1.25,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            minHeight: 52,
        }}>
            {!collapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{
                        width: 24, height: 24,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Box sx={{ width: 9, height: 9, bgcolor: '#1a1f36', borderRadius: '2px', transform: 'rotate(45deg)' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: 'white', letterSpacing: '-0.01em' }}>
                        Formify
                    </Typography>
                </Box>
            )}
            <Tooltip title={collapsed ? "Expand" : "Collapse"} placement="right">
                <IconButton size="small" onClick={onToggleCollapse}
                    sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}>
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
                <IconButton onClick={() => onNavigate("/")}
                    sx={{
                        color: isDashboard ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                        bgcolor: isDashboard ? 'rgba(245,158,11,0.12)' : 'transparent',
                        '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
                    }}>
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
                display: "flex", alignItems: "center", gap: 1.25,
                px: 1.5, py: "7px", mx: 1, mt: 1,
                cursor: "pointer", borderRadius: "8px",
                bgcolor: isDashboard ? 'rgba(245,158,11,0.15)' : "transparent",
                color: isDashboard ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s',
                "&:hover": { bgcolor: isDashboard ? 'rgba(245,158,11,0.2)' : "rgba(255,255,255,0.06)", color: isDashboard ? '#f59e0b' : 'rgba(255,255,255,0.85)' },
            }}
        >
            <DashboardIcon sx={{ fontSize: 15 }} />
            <Typography sx={{ fontSize: '13px', fontWeight: isDashboard ? 600 : 400 }}>All Projects</Typography>
        </Box>
    );
}

function SectionLabel({ label }) {
    return (
        <Box sx={{ px: 2.5, pt: 2.5, pb: 0.75 }}>
            <Typography sx={{
                fontSize: "10px", fontWeight: 700,
                textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.08em",
            }}>
                {label}
            </Typography>
        </Box>
    );
}

function Logout({ label }) {
    const dispatch = useDispatch();
    return (
        <Box sx={{ p: 1.5, borderTop: "1px solid rgba(255,255,255,0.07)", mt: 'auto' }}>
            <Box
                onClick={() => dispatch(logout())}
                sx={{
                    display: "flex", alignItems: "center", gap: 1.25,
                    px: 1.5, py: "7px", cursor: "pointer", borderRadius: "8px",
                    color: 'rgba(255,255,255,0.35)',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' },
                }}
            >
                <LogoutOutlinedIcon sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>{label}</Typography>
            </Box>
        </Box>
    );
}

function CollapsedLogout() {
    const dispatch = useDispatch();
    return (
        <Box sx={{ position: "fixed", bottom: 0, p: 1, mr: 0.5 }}>
            <Tooltip title="Logout" placement="right">
                <IconButton onClick={() => dispatch(logout())}
                    sx={{ color: 'rgba(255,255,255,0.35)', '&:hover': { color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.06)' } }}>
                    <LogoutOutlinedIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

function ProjectList({ projects, isLoading, activeIds, activeSidebarItem, onNavigate }) {
    if (isLoading) {
        return (
            <Box sx={{ flex: 1, px: 1.5, pb: 2 }}>
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} variant="text" height={28} sx={{ mx: 0.5, my: 0.5, bgcolor: 'rgba(255,255,255,0.08)' }} />
                ))}
            </Box>
        );
    }

    if (projects.length === 0) {
        return (
            <Typography sx={{ px: 2.5, fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                No projects yet
            </Typography>
        );
    }

    return (
        <Box sx={{ flex: 1, overflowY: "auto", px: 1, pb: 2 }}>
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
