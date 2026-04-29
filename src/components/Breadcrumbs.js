import { Box, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function buildPath(crumb, allCrumbs, index) {
    const project = allCrumbs.find(c => c.type === "project");
    const folder = allCrumbs.find(c => c.type === "folder");

    switch (crumb.type) {
        case "project":
            return `/project/${crumb.id}`;

        case "folder":
            return `/project/${project?.id}/folder/${crumb.id}`;

        case "file":
            return `/project/${project?.id}/folder/${folder?.id}/file/${crumb.id}`;

        default:
            return "/";
    }
}

export default function Breadcrumbs({ crumbs = [], loadingBreadcrumbs }) {

    const navigate = useNavigate();

    // Fix: Added return statement and adjusted skeleton to match text height
    if (loadingBreadcrumbs) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, py:1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={150} sx={{ fontSize: 'body2.fontSize' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
            {crumbs.length > 0 && (
                <Typography
                    variant="body2"
                    onClick={() => navigate("/")}
                    sx={{
                        cursor: 'pointer',
                        color: crumbs.length === 0 ? 'text.primary' : 'text.secondary',
                        fontWeight: crumbs.length === 0 ? 600 : 400,
                        '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                        },
                    }}
                >
                    Projects /
                </Typography>
            )}

            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;

                return (
                    <Box
                        key={`${crumb.type}-${crumb.id}`}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <Typography
                            variant="body2"
                            onClick={() =>
                                !isLast &&
                                navigate(buildPath(crumb, crumbs, index))
                            }
                            sx={{
                                cursor: isLast ? "default" : "pointer",
                                fontWeight: isLast ? 600 : 400,
                                color: isLast
                                    ? "text.primary"
                                    : "text.secondary",
                                whiteSpace: "nowrap",
                                "&:hover": !isLast
                                    ? {
                                        color: "primary.main",
                                        textDecoration: "underline",
                                    }
                                    : {},
                            }}
                        >
                            {crumb.name}
                        </Typography>

                        {!isLast && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mx: 0.5,
                                    color: "text.disabled",
                                }}
                            >
                                /
                            </Typography>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}