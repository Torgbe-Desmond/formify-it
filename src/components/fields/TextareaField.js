import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Box, ToggleButton, ToggleButtonGroup, InputLabel, FormHelperText } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
} from '@mui/icons-material';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <ToggleButtonGroup
      size="small"
      sx={{
        mb: 0,
        flexWrap: 'wrap',
        gap: 0.5,
        border: 'none',
        display: 'flex',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        borderRadius: '4px 4px 0 0',
        p: 0.5,
        backgroundColor: 'action.hover',
      }}
    >
      <ToggleButton
        value="bold"
        selected={editor.isActive('bold')}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
      >
        <FormatBold fontSize="small" />
      </ToggleButton>

      <ToggleButton
        value="italic"
        selected={editor.isActive('italic')}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <FormatItalic fontSize="small" />
      </ToggleButton>

      <ToggleButton
        value="underline"
        selected={editor.isActive('underline')}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
      >
        <FormatUnderlined fontSize="small" />
      </ToggleButton>

      <ToggleButton
        value="bulletList"
        selected={editor.isActive('bulletList')}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <FormatListBulleted fontSize="small" />
      </ToggleButton>

      <ToggleButton
        value="orderedList"
        selected={editor.isActive('orderedList')}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <FormatListNumbered fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default function TextareaField({ fieldKey, config, value = '', onChange, error, disabled }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <Box sx={{ mb: 1 }}>
      <InputLabel sx={{ mb: 1 }}>{config.label || fieldKey}</InputLabel>

      <Box
        sx={{
          border: '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: 1,
          overflow: 'hidden',
          '&:focus-within': {
            borderColor: 'primary.main',
            borderWidth: '2px',
          },
        }}
      >
        <MenuBar editor={editor} />

        <Box
          sx={{
            p: 2,
            '& .ProseMirror': {
              outline: 'none',
              minHeight: '120px',
            },
            '& ul, & ol': { paddingLeft: '1.5rem' },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}