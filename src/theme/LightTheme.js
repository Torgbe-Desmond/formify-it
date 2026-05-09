import { createTheme } from '@mui/material/styles';

const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1f36',
      light: '#2d3561',
      dark: '#0f1220',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#1a1f36',
    },
    background: {
      default: '#f8f7f4',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1f36',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e8e6e1',
    action: {
      hover: '#f1f0ed',
      selected: '#eeedf0',
    },
    error: { main: '#dc2626' },
    success: { main: '#059669' },
  },

  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.015em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },

  shape: { borderRadius: 10 },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        body { background-color: #f8f7f4; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1cfc9; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #b0aca4; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none', fontSize: '13.5px', '&:hover': { boxShadow: 'none' } },
        contained: { background: '#1a1f36', '&:hover': { background: '#2d3561' } },
        outlined: { borderColor: '#e8e6e1', color: '#1a1f36', '&:hover': { borderColor: '#1a1f36', backgroundColor: 'rgba(26,31,54,0.04)' } },
        sizeLarge: { padding: '10px 24px', fontSize: '14.5px' },
        sizeSmall: { padding: '5px 12px', fontSize: '12.5px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, border: '1px solid #e8e6e1', boxShadow: 'none', backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, fontSize: '13.5px', backgroundColor: '#fff',
            '& fieldset': { borderColor: '#e8e6e1' },
            '&:hover fieldset': { borderColor: '#94a3b8' },
            '&.Mui-focused fieldset': { borderColor: '#1a1f36', borderWidth: '1.5px' },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(248,247,244,0.88)', backdropFilter: 'blur(12px)', color: '#1a1f36', boxShadow: 'none', borderBottom: '1px solid #e8e6e1' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 500, fontSize: '11.5px' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14, boxShadow: '0 20px 60px rgba(26,31,54,0.12)', border: '1px solid #e8e6e1' },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontSize: '15px', fontWeight: 700, padding: '20px 24px 12px', letterSpacing: '-0.01em' } },
    },
    MuiMenu: {
      styleOverrides: { paper: { borderRadius: 10, border: '1px solid #e8e6e1', boxShadow: '0 8px 24px rgba(26,31,54,0.1)' } },
    },
    MuiMenuItem: {
      styleOverrides: { root: { fontSize: '13.5px', borderRadius: 6, margin: '2px 6px', padding: '7px 10px' } },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { borderRadius: 6, fontSize: '12px', background: '#1a1f36', fontWeight: 500 } },
    },
    MuiSkeleton: {
      styleOverrides: { root: { backgroundColor: '#ede9e3' } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 8, fontSize: '13.5px' } },
    },
  },
});

export default LightTheme;
