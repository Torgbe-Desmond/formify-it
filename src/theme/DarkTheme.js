import { createTheme } from '@mui/material/styles';

const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#42a5f5',        // Lighter blue — pops on dark backgrounds
            light: '#80d6ff',
            dark: '#0077c2',
            contrastText: '#000000',
        },
        secondary: {
            main: '#ce93d8',        // Lighter purple for dark mode
        },
        background: {
            default: '#0f1117',     // Very dark base — not pure black, easier on eyes
            paper: '#1a1d27',       // Slightly lighter for cards and modals
        },
        text: {
            primary: '#e8eaf0',     // Soft white — not harsh pure white
            secondary: '#9ea3b0',   // Muted gray for subtitles
            paragraph:"#000"
        },
        divider: '#2a2d3a',
        action: {
            hover: 'rgba(66, 165, 245, 0.08)',
            selected: 'rgba(66, 165, 245, 0.12)',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '6px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(66, 165, 245, 0.25)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid #2a2d3a',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.3)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // MUI adds a white overlay on dark paper by default — remove it
                    backgroundColor: '#1a1d27',
                    border: '1px solid #2a2d3a',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1a1d27',
                    color: '#e8eaf0',
                    boxShadow: '0px 1px 0px #2a2d3a',
                    borderBottom: '1px solid #2a2d3a',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2a2d3a',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#42a5f5',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#2a2d3a',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: '#2a2d3a',
                },
                head: {
                    backgroundColor: '#13161f',
                    color: '#9ea3b0',
                    fontWeight: 600,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1a1d27',
                    border: '1px solid #2a2d3a',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(66, 165, 245, 0.12)',
                        '&:hover': {
                            backgroundColor: 'rgba(66, 165, 245, 0.18)',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderColor: '#2a2d3a',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#2a2d3a #0f1117',
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-track': { background: '#0f1117' },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#2a2d3a',
                        borderRadius: 4,
                        '&:hover': { background: '#3a3d4a' },
                    },
                },
            },
        },
    },
});

export default DarkTheme;