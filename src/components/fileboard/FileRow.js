import { Box, Typography } from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileRow({ file, isLast, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 120px',
        alignItems: 'center',
        px: { xs: 2, sm: 2.5 },
        py: 1.25,
        cursor: 'pointer',
        bgcolor: 'background.paper',
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'divider',
        transition: 'background 0.1s',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      {/* Icon + name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
        <Typography
          variant="body2"
          fontWeight={500}
          noWrap
          sx={{ '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
        >
          {file.name}
        </Typography>
      </Box>

      {/* Size */}
      <Typography
        variant="caption" color="text.secondary"
        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 1 }}
      >
        {formatSize(file.sizeBytes)}
      </Typography>

      {/* Updated */}
      <Typography
        variant="caption" color="text.secondary"
        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}
      >
        {timeAgo(file.updatedAt)}
      </Typography>
    </Box>
  );
}