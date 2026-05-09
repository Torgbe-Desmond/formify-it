import { Box, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

function buildPath(crumb, allCrumbs) {
    const project = allCrumbs.find(c => c.type === "project");
    const folder = allCrumbs.find(c => c.type === "folder");
    switch (crumb.type) {
        case "project": return `/project/${crumb.id}`;
        case "folder": return `/project/${project?.id}/folder/${crumb.id}`;
        case "file": return `/project/${project?.id}/folder/${folder?.id}/file/${crumb.id}`;
        default: return "/";
    }
}

export default function Breadcrumbs({ crumbs = [], loadingBreadcrumbs }) {
    const isOnline = useOnlineStatus();
    const navigate = useNavigate();

    if (loadingBreadcrumbs) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, py: 0.5 }}>
                <Skeleton variant="text" width={160} sx={{ fontSize: '13px' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
            <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: 'text.disabled', '&:hover': { color: '#1a1f36' }, transition: 'color 0.15s' }}
                onClick={() => navigate("/")}
            >
                <HomeOutlinedIcon sx={{ fontSize: 14, mt: 0.3 }} />
                <Typography sx={{ fontSize: '13px', color: 'inherit' }}>Projects</Typography>
            </Box>

            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                    <Box key={`${crumb.type}-${crumb.id}`} sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ mx: 0.5, fontSize: '13px', color: 'text.disabled' }}>/</Typography>
                        <Typography
                            onClick={() => !isLast && navigate(buildPath(crumb, crumbs))}
                            sx={{
                                fontSize: '13px',
                                cursor: isLast ? "default" : "pointer",
                                fontWeight: isLast ? 600 : 400,
                                color: isLast ? "#1a1f36" : "text.secondary",
                                whiteSpace: "nowrap",
                                transition: 'color 0.15s',
                                "&:hover": !isLast ? { color: "#1a1f36" } : {},
                            }}
                        >
                            {crumb.name}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
}
