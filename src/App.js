import { useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';

import { selectIsAuth } from './store/slices/authSlice';

import Dashboard                from './pages/Dashboard';
import FolderBoard              from './pages/FolderBoard';
import FileBoard                from './pages/FileBoard';
import FileEditorPage           from './pages/FileEditorPage';
import SchemaTemplateEditorPage from './pages/SchemaTemplateEditorPage';
import OfflineBanner            from './components/OfflineBanner';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', prefersDarkMode ? '#121212' : '#ffffff');
  }, [prefersDarkMode]);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode:       prefersDarkMode ? 'dark' : 'light',
        primary:    { main: '#1976d2' },
        secondary:  { main: '#9c27b0' },
        background: {
          default: prefersDarkMode ? '#0d1117' : '#f8f9fa',
          paper:   prefersDarkMode ? '#161b22' : '#ffffff',
        },
      },
      typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
      shape: { borderRadius: 10 },
      components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: prefersDarkMode
                ? '0 4px 20px rgba(0,0,0,0.4)'
                : '0 4px 20px rgba(0,0,0,0.08)',
            },
          },
        },
      },
    }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <OfflineBanner />
      <Router>
        <Routes>
          <Route path="/login"    element={<Login/>} />
          <Route path="/register" element={ <Register/>}/>

          {/* Level 1: projects */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Level 2: folders inside a project */}
          <Route path="/project/:projectId" element={<ProtectedRoute><FolderBoard /></ProtectedRoute>} />

          {/* Level 3: files inside a folder */}
          <Route path="/folder/:folderId" element={<ProtectedRoute><FileBoard /></ProtectedRoute>} />

          {/* Schema editor for a folder */}
          <Route path="/schema/:folderId" element={<ProtectedRoute><SchemaTemplateEditorPage /></ProtectedRoute>} />

          {/* File viewer/editor */}
          <Route path="/file/:fileId" element={<ProtectedRoute><FileEditorPage /></ProtectedRoute>} />

          <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h1>404</h1></div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
