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
        px: 3, py: 1.5,
        cursor: 'pointer', bgcolor: 'white',
        borderBottom: isLast ? 'none' : '1px solid #e8e6e1',
        transition: 'background 0.1s',
        '&:hover': { bgcolor: '#fafaf8' },
        '&:hover .file-name': { color: '#1a1f36' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '8px',
          bgcolor: 'rgba(26,31,54,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 15, color: '#94a3b8' }} />
        </Box>
        <Typography className="file-name" variant="body2" fontWeight={500} noWrap
          sx={{ fontSize: '13.5px', color: '#374151', transition: 'color 0.1s' }}>
          {file.name}
        </Typography>
      </Box>

      <Typography variant="caption" color="text.disabled"
        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', pr: 1, fontSize: '12px' }}>
        {formatSize(file.sizeBytes)}
      </Typography>

      <Typography variant="caption" color="text.secondary"
        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', fontSize: '12px' }}>
        {timeAgo(file.updatedAt)}
      </Typography>
    </Box>
  );
}
