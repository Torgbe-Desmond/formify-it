import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register } from '../store/slices/authSlice';
import {
  Box, Button, TextField, Typography, Stack,
  Alert, useTheme, useMediaQuery, CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const p = theme.palette;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>

      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: isMobile ? 1 : '0 0 460px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 7 },
          py: 8,
          bgcolor: 'background.paper',
          borderRight: isMobile ? 'none' : `1px solid ${p.divider}`,
          zIndex: 1,
        }}
      >
        {/* Brand */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ mb: 5, justifyContent: isMobile ? 'center' : 'flex-start' }}
        >
          <Box sx={{
            width: 30, height: 30, flexShrink: 0,
            bgcolor: p.primary.main,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />
          <Typography fontWeight={800} fontSize="18px" color="text.primary">
            Formify
          </Typography>
        </Stack>

        {/* Heading */}
        <Typography
          variant="h4"
          fontWeight={800}
          color="text.primary"
          sx={{ mb: 0.75, textAlign: isMobile ? 'center' : 'left', letterSpacing: '-0.02em' }}
        >
          Create account.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}
        >
          Start organizing your documents today.
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Typography
            sx={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'text.disabled', mb: 0.75 }}
          >
            Full Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="John Doe"
            required
            sx={{ mb: 2.5 }}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Typography
            sx={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'text.disabled', mb: 0.75 }}
          >
            Email Address
          </Typography>
          <TextField
            fullWidth
            type="email"
            size="small"
            placeholder="name@company.com"
            required
            sx={{ mb: 2.5 }}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Typography
            sx={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'text.disabled', mb: 0.75 }}
          >
            Password
          </Typography>
          <TextField
            fullWidth
            type="password"
            size="small"
            placeholder="••••••••"
            required
            sx={{ mb: 3 }}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, fontSize: '13px' }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disableElevation
            disabled={loading}
            size="large"
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              py: 1.5,
              boxShadow: `0 4px 16px ${alpha(p.primary.main, 0.25)}`,
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
          </Button>
        </Box>

        {/* Footer link */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: p.primary.main, fontWeight: 700, textDecoration: 'none' }}>
            Sign In
          </Link>
        </Typography>
      </Box>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────── */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Grid background */}
          <Box sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `linear-gradient(${p.divider} 1px, transparent 1px), linear-gradient(90deg, ${p.divider} 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
            opacity: 0.7,
          }} />

          {/* Glow */}
          <Box sx={{
            position: 'absolute',
            width: '500px', height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(p.primary.main, 0.07)} 0%, transparent 65%)`,
            pointerEvents: 'none',
          }} />

          {/* Feature highlight card */}
          <Box
            sx={{
              position: 'relative', zIndex: 1,
              bgcolor: 'background.paper',
              border: `1px solid ${p.divider}`,
              borderRadius: 3,
              p: 4.5,
              maxWidth: 280,
              textAlign: 'center',
              boxShadow: `0 12px 40px ${alpha('#000', 0.06)}`,
            }}
          >
            <Typography sx={{ fontSize: '28px', color: p.primary.main, mb: 2, lineHeight: 1 }}>
              ◈
            </Typography>
            <Typography fontWeight={700} color="text.primary" sx={{ mb: 1, fontSize: '16px' }}>
              Schema Templates
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
              Define reusable form fields once and generate polished documents instantly.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}