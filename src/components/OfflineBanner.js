import { useState, useEffect } from 'react';
import { Alert, Box, Slide } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SyncIcon from '@mui/icons-material/Sync';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import db from '../db/_db';

export default function OfflineBanner() {
  const isOnline       = useOnlineStatus();
  const [pending, setPending] = useState(0);

  // Poll pending sync count every 5 seconds
  useEffect(() => {
    const check = async () => {
      const count = await db.syncQueue.count();
      setPending(count);
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything if online and nothing pending
  if (isOnline && pending === 0) return null;

  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Box sx={{ position: 'relative', top: 0, left: 0, right: 0}}>
        {!isOnline && (
          <Alert
            severity="warning"
            icon={<WifiOffIcon fontSize="small" />}
            sx={{ borderRadius: 0, justifyContent: 'center' }}
          >
            You are offline.
          </Alert>
        )}

        {isOnline && pending > 0 && (
          <Alert
            severity="info"
            icon={<SyncIcon fontSize="small" />}
            sx={{ borderRadius: 0, justifyContent: 'center' }}
          >
            Syncing {pending} pending {pending === 1 ? 'change' : 'changes'} to server...
          </Alert>
        )}
      </Box>
    </Slide>
  );
}
