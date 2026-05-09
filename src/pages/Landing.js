import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Typography, Container, Grid, Card,
  CardContent, AppBar, Toolbar, Chip, Stack, useTheme,
  useMediaQuery, Divider,
} from '@mui/material';

const features = [
  {
    icon: '⊞',
    title: 'Schema Templates',
    desc: 'Define reusable form fields with YAML once, fill it forever across any project.',
  },
  {
    icon: '◧',
    title: 'Structured Docs',
    desc: 'Project → Folder → File hierarchy. Export any document cleanly to PDF.',
  },
  {
    icon: '✦',
    title: 'Rich Text Editing',
    desc: 'Bold, italic, and lists — inline rich text editing powered by Tiptap.',
  },
  {
    icon: '◎',
    title: 'Live Preview',
    desc: 'See your rendered HTML document update in real time as you type.',
  },
  {
    icon: '⬡',
    title: 'Team Ready',
    desc: 'JWT-secured accounts with fully independent per-user projects.',
  },
  {
    icon: '⊟',
    title: 'PDF Export',
    desc: 'Pixel-perfect PDF generation via headless Chrome — what you see is what you get.',
  },
];

function useCountUp(target, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

const stats = [
  { value: 500, suffix: '+', label: 'Documents created' },
  { value: 12, suffix: '×', label: 'Faster than Word' },
  { value: 99, suffix: '%', label: 'Export accuracy' },
];

function StatItem({ value, suffix, label, animate }) {
  const count = useCountUp(value, 1400, animate);
  return (
    <Box sx={{ textAlign: 'center', px: 3 }}>
      <Typography
        sx={{
          fontSize: { xs: '2.2rem', md: '2.75rem' },
          fontWeight: 700,
          color: '#1a1f36',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.04em',
        }}
      >
        {count}{suffix}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontWeight: 500, fontSize: '13px' }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f7f4', overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2.5, md: 6 }, minHeight: '56px !important' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{
              width: 28, height: 28,
              background: 'linear-gradient(135deg, #1a1f36 0%, #2d3561 100%)',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Box sx={{
                width: 12, height: 12,
                background: '#f59e0b',
                borderRadius: '3px',
                transform: 'rotate(45deg)',
              }} />
            </Box>
            <Typography fontWeight={700} fontSize="15px" color="#1a1f36" letterSpacing="-0.01em">
              Formify
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/login')}
              sx={{ color: 'text.secondary', fontWeight: 500, '&:hover': { color: '#1a1f36', bgcolor: 'transparent' } }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/register')}
              sx={{ borderRadius: 7, px: 2.5 }}
            >
              Get started
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          textAlign: 'center',
          pt: { xs: 9, md: 15 },
          pb: { xs: 7, md: 12 },
          px: { xs: 3, md: 8 },
          overflow: 'hidden',
        }}
      >
        {/* Subtle dot grid */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(circle, #c8c5bd 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 100%)',
          opacity: 0.5,
        }} />

        {/* Warm glow */}
        <Box sx={{
          position: 'absolute',
          width: { xs: '280px', md: '600px' },
          height: { xs: '200px', md: '360px' },
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)',
          top: '5%', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            label="Document management platform"
            size="small"
            sx={{
              mb: 3.5,
              bgcolor: 'rgba(26,31,54,0.06)',
              color: '#1a1f36',
              border: '1px solid rgba(26,31,54,0.12)',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              height: 26,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.6rem', sm: '3.6rem', md: 'clamp(3.2rem, 6vw, 5.2rem)' },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: '#1a1f36',
              mb: 2.5,
            }}
          >
            Documents built on{' '}
            <Box component="span" sx={{
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '2px',
                left: 0, right: 0,
                height: '3px',
                background: '#f59e0b',
                borderRadius: '2px',
              }
            }}>
              structure.
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.7, maxWidth: 460, mx: 'auto', mb: 5 }}
          >
            Define templates once. Fill forms. Get polished documents — every time.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 4.5, borderRadius: 8,
                width: isMobile ? '100%' : 'auto', maxWidth: 260,
                boxShadow: '0 4px 20px rgba(26,31,54,0.25)',
              }}
            >
              Go to app →
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 4, borderRadius: 8, bgcolor: 'white',
                width: isMobile ? '100%' : 'auto', maxWidth: 260,
              }}
            >
              Create account
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <Box
        ref={statsRef}
        sx={{
          bgcolor: 'white',
          borderTop: '1px solid #e8e6e1',
          borderBottom: '1px solid #e8e6e1',
          py: { xs: 4.5, md: 5.5 },
        }}
      >
        <Container maxWidth="md">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 4, sm: 0 }}
            divider={
              <Divider
                orientation={isMd ? 'horizontal' : 'vertical'}
                flexItem
                sx={{ borderColor: '#e8e6e1' }}
              />
            }
            justifyContent="space-evenly"
            alignItems="center"
          >
            {stats.map((s) => (
              <StatItem key={s.label} {...s} animate={statsVisible} />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography
              sx={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'text.disabled', mb: 2,
              }}
            >
              Everything you need
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' }, color: '#1a1f36', maxWidth: 480, mx: 'auto', lineHeight: 1.2 }}
            >
              Powerful tools, clean interface
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: 'white',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 32px rgba(26,31,54,0.09)',
                      borderColor: 'rgba(26,31,54,0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '10px',
                      bgcolor: i % 3 === 0 ? 'rgba(245,158,11,0.1)' : i % 3 === 1 ? 'rgba(26,31,54,0.06)' : 'rgba(5,150,105,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mb: 2.5, fontSize: '18px',
                      color: i % 3 === 0 ? '#d97706' : i % 3 === 1 ? '#1a1f36' : '#059669',
                    }}>
                      {f.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="#1a1f36" sx={{ mb: 1, fontSize: '14.5px' }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7} fontSize="13.5px">
                      {f.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1a1f36 0%, #2d3561 100%)',
              borderRadius: 4,
              px: { xs: 4, md: 8 },
              py: { xs: 5.5, md: 7 },
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(circle at 15% 50%, rgba(245,158,11,0.15) 0%, transparent 45%), radial-gradient(circle at 85% 30%, rgba(255,255,255,0.04) 0%, transparent 40%)`,
              },
            }}
          >
            {/* Decorative amber dot */}
            <Box sx={{
              position: 'absolute', top: 28, right: 32,
              width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b',
            }} />
            <Box sx={{
              position: 'absolute', bottom: 24, left: 40,
              width: 5, height: 5, borderRadius: '50%', bgcolor: 'rgba(245,158,11,0.5)',
            }} />

            <Typography
              variant="h4"
              sx={{ color: 'white', mb: 1.5, fontSize: { xs: '1.7rem', md: '2.1rem' }, position: 'relative', zIndex: 1 }}
            >
              Ready to get started?
            </Typography>
            <Typography
              sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, fontSize: '15px', position: 'relative', zIndex: 1 }}
            >
              Join teams already using Formify to ship documents faster.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                position: 'relative', zIndex: 1,
                bgcolor: '#f59e0b', color: '#1a1f36', fontWeight: 700,
                px: 5, borderRadius: 8,
                '&:hover': { bgcolor: '#fbbf24' },
                boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
              }}
            >
              Create free account
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{ borderTop: '1px solid #e8e6e1', py: 3.5, px: { xs: 3, md: 6 }, bgcolor: 'white' }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{
              width: 22, height: 22,
              background: 'linear-gradient(135deg, #1a1f36 0%, #2d3561 100%)',
              borderRadius: '5px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Box sx={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '2px', transform: 'rotate(45deg)' }} />
            </Box>
            <Typography fontSize="13px" fontWeight={700} color="#1a1f36">
              Formify
            </Typography>
          </Stack>
          <Typography fontSize="12px" color="text.disabled">
            Document management for teams · © {new Date().getFullYear()}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
