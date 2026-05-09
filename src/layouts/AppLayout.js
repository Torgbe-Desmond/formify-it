import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AppSidebar from '../components/sidebar/AppSidebar';
import OfflineBanner from '../components/OfflineBanner';

function AppLayout() {
    const { pathname } = useLocation();

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f8f7f4' }}>
            <AppSidebar />
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <OfflineBanner />
                <Outlet />
            </Box>
        </Box>
    );
}

export default AppLayout;
