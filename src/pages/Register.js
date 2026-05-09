import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register } from '../store/slices/authSlice';
import {
  Box, Button, TextField, Typography, Stack,
  Alert, useTheme, useMediaQuery, CircularProgress,
} from '@mui/material';

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f8f7f4' }}>

      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <Box sx={{
        flex: isMobile ? 1 : '0 0 480px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        px: { xs: 4, sm: 8 }, py: 8,
        bgcolor: 'white',
        borderRight: isMobile ? 'none' : '1px solid #e8e6e1',
        zIndex: 1,
      }}>
        {/* Brand */}
        <Stack direction="row" alignItems="center" spacing={1.5}
          sx={{ mb: 6, justifyContent: isMobile ? 'center' : 'flex-start' }}
        >
          <Box sx={{
            width: 32, height: 32, flexShrink: 0,
            background: 'linear-gradient(135deg, #1a1f36 0%, #2d3561 100%)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Box sx={{ width: 12, height: 12, background: '#f59e0b', borderRadius: '3px', transform: 'rotate(45deg)' }} />
          </Box>
          <Typography fontWeight={700} fontSize="16px" color="#1a1f36" letterSpacing="-0.01em">
            Formify
          </Typography>
        </Stack>

        <Typography variant="h4" sx={{ mb: 0.75, textAlign: isMobile ? 'center' : 'left', color: '#1a1f36' }}>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 5, textAlign: isMobile ? 'center' : 'left', fontSize: '14px' }}>
          Start organizing your documents today. Free forever.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1a1f36', mb: 0.75 }}>
            Full name
          </Typography>
          <TextField
            fullWidth placeholder="John Doe" required
            sx={{ mb: 3 }}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1a1f36', mb: 0.75 }}>
            Email address
          </Typography>
          <TextField
            fullWidth type="email" placeholder="name@company.com" required
            sx={{ mb: 3 }}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#1a1f36', mb: 0.75 }}>
            Password
          </Typography>
          <TextField
            fullWidth type="password" placeholder="••••••••" required
            sx={{ mb: 4 }}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}

          <Button
            type="submit" variant="contained" fullWidth disabled={loading} size="large"
            sx={{ borderRadius: 8, py: 1.4, boxShadow: '0 4px 16px rgba(26,31,54,0.2)' }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Create account'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center', fontSize: '13.5px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1a1f36', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid #f59e0b' }}>
            Sign in
          </Link>
        </Typography>
      </Box>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────── */}
      {!isMobile && (
        <Box sx={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: '#f8f7f4', position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `radial-gradient(circle, #c8c5bd 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 65% 65% at 50% 50%, black 30%, transparent 100%)',
            opacity: 0.6,
          }} />
          <Box sx={{
            position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Box sx={{
            position: 'relative', zIndex: 1,
            bgcolor: 'white', border: '1px solid #e8e6e1', borderRadius: 3,
            p: 4.5, maxWidth: 300,
            boxShadow: '0 16px 48px rgba(26,31,54,0.07)',
          }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: '11px',
              bgcolor: 'rgba(26,31,54,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 2.5, fontSize: '20px',
            }}>
              ⊞
            </Box>
            <Typography fontWeight={700} color="#1a1f36" sx={{ mb: 1, fontSize: '15px' }}>
              Schema templates
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.7} fontSize="13.5px">
              Define reusable form fields once and generate polished documents instantly — across every project.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
