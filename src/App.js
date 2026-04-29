import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";

import { selectIsAuth } from "./store/slices/authSlice";

import Dashboard from "./pages/Dashboard";
import FolderBoard from "./pages/FolderBoard";
import FileBoard from "./pages/FileBoard";
import FileEditorPage from "./pages/FileEditorPage";
import SchemaTemplateEditorPage from "./pages/SchemaTemplateEditorPage";
import OfflineBanner from "./components/OfflineBanner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LightTheme from "./theme/LightTheme";
import Landing from "./pages/Landing";
import AppSidebar from "./components/sidebar/AppSidebar";

// const SIDEBAR_ROUTES = [
//   "/",
//   "/project/",
//   "/folder/",
//   "/file/"
// ];

function ProtectedRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);

  if (!isAuth) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  const isAuth = useSelector(selectIsAuth);
  const { pathname } = useLocation();
  const theme = useTheme();

  // Hide sidebar on mobile (xs) and tablet (sm, md — up to 1024px)
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const showSidebar =
    isAuth &&
    isDesktop &&
    (pathname === "/" || pathname.startsWith("/project/"));

  if (!showSidebar) {
    return children;
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* LEFT SIDEBAR — desktop only */}
      <AppSidebar />

      {/* RIGHT MAIN CONTENT */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default function App() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", "#ffffff");
    }
  }, []);

  return (
    <ThemeProvider theme={LightTheme}>
      <CssBaseline />

      <OfflineBanner />

      <Router>
        <AppLayout>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Landing />} />

            {/* ROOT DASHBOARD */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* PROJECT */}
            <Route
              path="/project/:projectId"
              element={
                <ProtectedRoute>
                  <FolderBoard />
                </ProtectedRoute>
              }
            />

            {/* FOLDER */}
            <Route
              path="/project/:projectId/folder/:folderId"
              element={
                <ProtectedRoute>
                  <FileBoard />
                </ProtectedRoute>
              }
            />

            {/* FILE */}
            <Route
              path="/project/:projectId/folder/:folderId/file/:fileId"
              element={
                <ProtectedRoute>
                  <FileEditorPage />
                </ProtectedRoute>
              }
            />

            {/* SCHEMA */}
            <Route
              path="/schema/:folderId"
              element={
                <ProtectedRoute>
                  <SchemaTemplateEditorPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h1>404</h1>
                </div>
              }
            />
          </Routes>
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}