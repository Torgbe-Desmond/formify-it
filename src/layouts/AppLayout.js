import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import AppSidebar from '../components/AppSidebar';

function AppLayout() {
    // const isAuth = useSelector(selectIsAuth);
    const { pathname } = useLocation();

    const showSidebar = isAuth && SIDEBAR_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r)
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
            <AppSidebar />
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default AppLayout