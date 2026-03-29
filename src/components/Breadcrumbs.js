import { Box, Typography, IconButton, Skeleton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from 'react-router-dom';

const getPath = (crumb) => {
    switch (crumb.type) {
        case 'project': return `/project/${crumb.id}`;
        case 'folder': return `/folder/${crumb.id}`;
        case 'file': return `/file/${crumb.id}`;
        default: return '/';
    }
};

export default function Breadcrumbs({ crumbs = [], loadingBreadcrumbs }) {
    const navigate = useNavigate();

    // Fix: Added return statement and adjusted skeleton to match text height
    if (loadingBreadcrumbs) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, py: 0.5 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={150} sx={{ fontSize: 'body2.fontSize' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>

            {/* Back button → go to parent */}
            {crumbs.length > 0 && (
                <IconButton
                    size="small"
                    onClick={() => navigate(-1)}
                    sx={{ color: 'text.secondary', p: 0.5 }}
                >
                    <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
            )}

    
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
                    <Box key={crumb.id} sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                        {!isLast ? (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        color: 'primary.main',
                                        textDecoration: 'underline',
                                    },
                                }}
                                onClick={() => navigate(getPath(crumb))}
                            >
                                {crumb.name}
                            </Typography>
                        ) : (
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.primary"
                                noWrap
                                sx={{ minWidth: 0 }}
                            >
                                {crumb.name}
                            </Typography>
                        )}

                        {!isLast && (
                            <Typography variant="body2" color="text.disabled" sx={{ mx: 0.5 }}>
                                /
                            </Typography>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}