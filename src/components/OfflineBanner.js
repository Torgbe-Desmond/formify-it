import { useState, useEffect } from 'react';
import { Box, Typography, Slide } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import db from '../db/_db';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const check = async () => { const count = await db.syncQueue.count(); setPending(count); };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isOnline && pending === 0) return null;

  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Box>
        {!isOnline && (
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
            bgcolor: '#fef3c7', borderBottom: '1px solid #fde68a',
            py: 1, px: 3,
          }}>
            <WifiOffIcon sx={{ fontSize: 15, color: '#92400e' }} />
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#92400e' }}>
              You're offline
            </Typography>
          </Box>
        )}
        {isOnline && pending > 0 && (
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
            bgcolor: 'rgba(26,31,54,0.04)', borderBottom: '1px solid #e8e6e1',
            py: 1, px: 3,
          }}>
            <SyncRoundedIcon sx={{ fontSize: 15, color: '#64748b', animation: 'spin 1.5s linear infinite', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
              Syncing {pending} pending {pending === 1 ? 'change' : 'changes'}…
            </Typography>
          </Box>
        )}
      </Box>
    </Slide>
  );
}
