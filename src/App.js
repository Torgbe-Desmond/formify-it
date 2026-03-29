import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
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
import LightTheme from './theme/LightTheme';
import Landing from './pages/Landing';

function ProtectedRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);
  if (!isAuth) return <Navigate to="/home" replace />;
  return children;
}

export default function App() {

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content','#ffffff');
  }, []);

  return (
    <ThemeProvider theme={LightTheme}>
      <CssBaseline />
      <OfflineBanner />
      <Router>
        <Routes>
          <Route path="/login"    element={<Login/>} />
          <Route path="/register" element={ <Register/>}/>
          <Route path="/home" element={ <Landing/>}/>

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
