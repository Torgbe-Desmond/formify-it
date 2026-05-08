import { Box, Skeleton, Typography } from '@mui/material';
import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import FolderRow from './FolderRow';

// Internal component for the loading state
const FolderSkeleton = ({ isLast }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 48px', sm: '1fr 100px 140px 48px' },
    alignItems: 'center',
    px: { xs: 2, sm: 2.5 },
    py: { xs: 1.5, sm: 1.25 },
    borderBottom: isLast ? 'none' : '1px solid',
    borderColor: 'divider',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Skeleton variant="circular" width={24} height={24} />
      <Box sx={{ width: '60%' }}>
        <Skeleton variant="text" width="80%" sx={{ fontSize: 'body2.fontSize' }} />
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Skeleton variant="text" width="40%" sx={{ fontSize: 'caption.fontSize' }} />
        </Box>
      </Box>
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
      <Skeleton variant="rounded" width={30} height={20} />
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 2 }}>
      <Skeleton variant="text" width={60} sx={{ ml: 'auto' }} />
    </Box>
    <Skeleton variant="circular" width={24} height={24} sx={{ ml: 'auto' }} />
  </Box>
);


export default function FolderList({ folders, loading, isSuccess, onFolderClick, onRenameClick, onDeleteClick }) {
  const isEmpty = isSuccess && (folders?.length === 0);

  return (
    <Box sx={{ mx: { xs: 1, sm: 3 }, mt: 2, pb: 4 }}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>

        {/* Header row */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 40px',
            sm: '1fr 80px 80px 120px 40px',
          },
          px: { xs: 2, sm: 2.5 }, py: 1,
          bgcolor: 'action.hover',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Name
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
            Files
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>
            Schema
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            Updated
          </Typography>
          <Box />
        </Box>


        {loading && (
          <>
            <FolderSkeleton />
            <FolderSkeleton />
            <FolderSkeleton isLast={true} />
          </>
        )}

        {/* Empty state — only shown after a successful fetch with no results */}
        {isEmpty && (
          <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
            <CreateNewFolderRoundedIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
            <Typography variant="body1" gutterBottom fontWeight={500}>No folders yet</Typography>
            <Typography variant="body2">Use the "New Folder" button above to get started</Typography>
          </Box>
        )}

        {/* Data rows */}
        {!loading && folders.map((folder, idx) => (
          <FolderRow
            key={folder.id}
            folder={folder}
            isLast={idx === folders.length - 1}
            onClick={() => onFolderClick(folder.id)}
            onRename={() => onRenameClick(folder)}
            onDelete={() => onDeleteClick(folder)}
          />
        ))}
      </Box>
    </Box>
  );
}