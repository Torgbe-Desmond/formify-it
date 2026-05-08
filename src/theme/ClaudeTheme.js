import { createTheme } from '@mui/material/styles';

const ClaudeTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#D97757',       // Claude's warm coral/orange
      light: '#caa092',
      dark: '#C4623E',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B6F5E',       // Warm muted brown
      light: '#A68878',
      dark: '#6B5247',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F0EB',    // Warm off-white (Claude's chat background)
      paper: '#FDFAF7',      // Slightly lighter warm white for cards
    },
    text: {
      primary: '#1A1310',    // Near black with warm tint
      secondary: '#6B5B52',  // Warm muted brown-gray
    },
    divider: '#E8DDD6',      // Warm divider
    error: {
      main: '#C84B31',
    },
  },

  typography: {
    fontFamily: '"Söhne", "ui-sans-serif", "system-ui", "-apple-system", sans-serif',
    h1: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F0EB',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '6px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(217, 119, 87, 0.25)',
          },
        },
        containedPrimary: {
          backgroundColor: '#D97757',
          '&:hover': {
            backgroundColor: '#C4623E',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E8DDD6',
          boxShadow: '0px 2px 6px rgba(90, 50, 30, 0.07)',
          backgroundColor: '#FDFAF7',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2D1F17',   // Claude's dark sidebar brown
          color: '#F5F0EB',
          boxShadow: 'none',
          borderBottom: '1px solid #3D2C22',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2D1F17',   // Dark sidebar
          color: '#E8DDD6',
          borderRight: '1px solid #3D2C22',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(217, 119, 87, 0.12)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(217, 119, 87, 0.18)',
            '&:hover': {
              backgroundColor: 'rgba(217, 119, 87, 0.24)',
            },
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FDFAF7',
            '& fieldset': { borderColor: '#E8DDD6' },
            '&:hover fieldset': { borderColor: '#D97757' },
            '&.Mui-focused fieldset': { borderColor: '#D97757' },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#EDE5DE',
          color: '#4A2F22',
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#D97757',
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default ClaudeTheme;