import { createTheme } from '@mui/material/styles';

const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Standard Material UI Blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0', // Standard Material Purple
    },
    background: {
      default: '#f4f6f8', // Light gray background for contrast
      paper: '#ffffff',   // White for cards and modals
    },
    text: {
      primary: '#1a2027',   // Darker gray for better legibility
      secondary: '#5f6368', // Accessible gray for subtitles
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Standard Material font
    h1: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { 
      fontWeight: 500, 
      textTransform: 'none' // Keeps buttons looking modern (not all caps)
    },
  },
  shape: {
    borderRadius: 8, // Standard Material 3 / Modern feel
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '6px 16px',
          boxShadow: 'none', // Flat design is cleaner for form tools
          '&:hover': {
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e0e0e0',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2', // Solid blue header
          color: '#ffffff',
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', // Modern outlined look
        size: 'small',       // Better for dense form layouts
      },
    },
  },
});

export default LightTheme;