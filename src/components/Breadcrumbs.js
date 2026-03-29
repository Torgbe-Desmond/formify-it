import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useNavigate } from 'react-router-dom';
// import FolderIcon from '@mui/icons-material/Folder';
// import DescriptionIcon from '@mui/icons-material/Description';
// import WorkspacesIcon from '@mui/icons-material/Workspaces';

// const getIcon = (type) => {
//     switch (type) {
//         case 'project': return <WorkspacesIcon sx={{ fontSize: 16 }} />;
//         case 'folder': return <FolderIcon sx={{ fontSize: 16 }} />;
//         case 'file': return <DescriptionIcon sx={{ fontSize: 16 }} />;
//         default: return null;
//     }
// };

const getPath = (crumb) => {
    switch (crumb.type) {
        case 'project':
            return `/project/${crumb.id}`;
        case 'folder':
            return `/folder/${crumb.id}`;
        case 'file':
            return `/file/${crumb.id}`;
        default:
            return '/';
    }
};

export default function Breadcrumbs({ crumbs }) {
    const navigate = useNavigate();

    if (!crumbs || crumbs.length === 0) return null;

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

            <Typography variant="body2"
                onClick={() => navigate("/")}
                sx={{
                    cursor: 'pointer',
                    pr: 0.2,
                    '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                    },
                }}>
                Projects / {" "}
            </Typography>

            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;

                return (
                    <Box key={crumb.id} sx={{ display: 'flex', alignItems: 'center' }}>

                        {/* Clickable (not last) */}
                        {!isLast ? (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    cursor: 'pointer',
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
                            /* Current item */
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.primary"
                                noWrap
                            >
                                {crumb.name}
                            </Typography>
                        )}

                        {/* Divider */}
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