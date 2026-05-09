import { Box, Skeleton, Typography } from '@mui/material';
import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import FolderRow from './FolderRow';

const FolderSkeleton = ({ isLast }) => (
  <Box sx={{
    display: 'grid', gridTemplateColumns: { xs: '1fr 48px', sm: '1fr 100px 140px 48px' },
    alignItems: 'center', px: 3, py: 1.75,
    borderBottom: isLast ? 'none' : '1px solid #e8e6e1',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '9px', flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="55%" sx={{ fontSize: '14px' }} />
        <Skeleton variant="text" width="30%" sx={{ fontSize: '12px' }} />
      </Box>
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
      <Skeleton variant="rounded" width={28} height={20} sx={{ borderRadius: '6px' }} />
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 2 }}>
      <Skeleton variant="text" width={55} sx={{ ml: 'auto' }} />
    </Box>
    <Skeleton variant="circular" width={24} height={24} sx={{ ml: 'auto' }} />
  </Box>
);

export default function FolderList({ folders, loading, isSuccess, isOnline, onFolderClick, onRenameClick, onDeleteClick }) {
  const isEmpty = isSuccess && folders?.length === 0;

  return (
    <Box sx={{ mx: { xs: 2, sm: 4 }, mt: 1, pb: 4 }}>
      <Box sx={{
        display: 'grid', gridTemplateColumns: { xs: '1fr 40px', sm: '1fr 80px 80px 120px 40px' },
        px: 3, py: 1.25,
        bgcolor: '#f8f7f4', border: '1px solid #e8e6e1',
        borderRadius: '10px 10px 0 0',
      }}>
        {['Name', 'Files', 'Schema', 'Updated'].map((h, i) => (
          <Typography key={h} sx={{
            fontSize: '11px', fontWeight: 600, color: 'text.disabled',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            ...(i === 0 ? {} : i === 3 ? { textAlign: 'right', display: { xs: 'none', sm: 'block' } } : { textAlign: 'center', display: { xs: 'none', sm: 'block' } }),
          }}>{h}</Typography>
        ))}
        <Box />
      </Box>

      <Box sx={{ border: '1px solid #e8e6e1', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', bgcolor: 'white' }}>
        {loading && (<><FolderSkeleton /><FolderSkeleton /><FolderSkeleton isLast={true} /></>)}

        {isEmpty && (
          <Box sx={{ py: 12, textAlign: 'center', color: 'text.secondary' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <CreateNewFolderRoundedIcon sx={{ fontSize: 28, color: '#d97706' }} />
            </Box>
            <Typography variant="body2" fontWeight={600} color="#1a1f36" sx={{ mb: 0.5 }}>No folders yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '13px' }}>Create a folder to organize your files</Typography>
          </Box>
        )}

        {!loading && folders.map((folder, idx) => (
          <FolderRow
            isOnline={isOnline}
            key={folder.id} folder={folder} isLast={idx === folders.length - 1}
            onClick={() => onFolderClick(folder.id)}
            onRename={() => onRenameClick(folder)}
            onDelete={() => onDeleteClick(folder)}
          />
        ))}
      </Box>
    </Box>
  );
}
