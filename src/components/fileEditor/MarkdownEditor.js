import { Box, Paper } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';

export default function MarkdownEditor({
  content, onContentChange, isMobile, theme,
}) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column-reverse' : 'row',
      gap: 2,
      minHeight: 'auto',
    }}>
      <TextareaAutosize
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        style={{
          width:           isMobile ? '100%' : '50%',
          minHeight:       isMobile ? '50vh' : 'auto',
          fontFamily:      'monospace',
          fontSize:        isMobile ? 16 : 14,
          padding:         12,
          borderRadius:    4,
          border:          `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color:           theme.palette.text.primary,
          resize:          'vertical',
          overflow:        'auto',
          outline:         'none',
        }}
      />

      <Paper sx={{
        width:     isMobile ? '100%' : '50%',
        p:         3,
        border:    `1px solid ${theme.palette.divider}`,
        overflowX: 'auto',
        overflowY: 'auto',
        minHeight: isMobile ? '50vh' : '70vh',
      }}>
        <div
          dangerouslySetInnerHTML={{
            __html: content || '<p><em>Nothing to preview yet.</em></p>',
          }}
        />
      </Paper>
    </Box>
  );
}
