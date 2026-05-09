import { Box, Skeleton, Typography } from '@mui/material';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import FileRow from './FileRow';

const FileSkeleton = ({ isLast }) => (
  <Box sx={{
    display: 'grid', gridTemplateColumns: '1fr 80px 120px',
    alignItems: 'center', px: 3, py: 1.5,
    borderBottom: isLast ? 'none' : '1px solid #e8e6e1',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: '8px', flexShrink: 0 }} />
      <Skeleton variant="text" width="50%" sx={{ fontSize: '14px' }} />
    </Box>
    <Skeleton variant="text" width={40} sx={{ ml: 'auto', display: { xs: 'none', sm: 'block' } }} />
    <Skeleton variant="text" width={55} sx={{ ml: 'auto', display: { xs: 'none', sm: 'block' } }} />
  </Box>
);

export default function FileList({ files, loading, isSuccess, onFileClick }) {
  const isEmpty = isSuccess && files?.length === 0;

  return (
    <Box sx={{ mx: { xs: 2, sm: 4 }, mt: 1, pb: 4 }}>
      <Box sx={{
        display: 'grid', gridTemplateColumns: '1fr 80px 120px',
        px: 3, py: 1.25,
        bgcolor: '#f8f7f4', border: '1px solid #e8e6e1', borderRadius: '10px 10px 0 0',
      }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>Size</Typography>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>Updated</Typography>
      </Box>

      <Box sx={{ border: '1px solid #e8e6e1', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', bgcolor: 'white' }}>
        {loading && (<><FileSkeleton /><FileSkeleton /><FileSkeleton isLast={true} /></>)}

        {isEmpty && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(26,31,54,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <InsertDriveFileRoundedIcon sx={{ fontSize: 28, color: '#94a3b8' }} />
            </Box>
            <Typography variant="body2" fontWeight={600} color="#1a1f36" sx={{ mb: 0.5 }}>No files yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '13px' }}>Click "Add file" to create your first file</Typography>
          </Box>
        )}

        {!loading && files.map((file, idx) => (
          <FileRow key={file.id} file={file} isLast={idx === files.length - 1} onClick={() => onFileClick(file.id)} />
        ))}
      </Box>
    </Box>
  );
}
