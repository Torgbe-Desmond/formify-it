import { Box, Typography } from '@mui/material';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import FileRow from './FileRow';

export default function FileList({ files, onFileClick }) {
  if (!files?.length) {
    return (
      <Box sx={{
        mx: { xs: 2, sm: 3 }, mt: 2,
        border: '1px solid', borderColor: 'divider',
        borderRadius: 2, py: 10,
        textAlign: 'center', color: 'text.secondary',
      }}>
        <InsertDriveFileRoundedIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
        <Typography variant="body1" gutterBottom fontWeight={500}>No files yet</Typography>
        <Typography variant="body2">Click "Add File" above to create your first file</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: { xs: 2, sm: 3 }, mt: 2, pb: 4 }}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>

        {/* Header row */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 120px',
          px: { xs: 2, sm: 2.5 }, py: 1,
          bgcolor: 'action.hover',
          borderBottom: '1px solid', borderColor: 'divider',
        }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>Size</Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>Updated</Typography>
        </Box>

        {/* Data rows */}
        {files.map((file, idx) => (
          <FileRow
            key={file.id}
            file={file}
            isLast={idx === files.length - 1}
            onClick={() => onFileClick(file.id)}
          />
        ))}
      </Box>
    </Box>
  );
}