import { Paper, Typography } from '@mui/material';

export default function MarkdownViewer({ content, isEmpty, paperStyles }) {
  return (
    <Paper sx={paperStyles}>
      {isEmpty ? (
        <Typography color="text.secondary" fontStyle="italic">
          No content yet. Use the menu to edit.
        </Typography>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </Paper>
  );
}
