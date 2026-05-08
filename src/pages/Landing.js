import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Typography, Container, Grid, Card,
  CardContent, AppBar, Toolbar, Chip, Stack, useTheme,
  useMediaQuery, Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

/* ─── Feature data ───────────────────────────────────────────────────────── */
const features = [
  {
    icon: '◈',
    title: 'Schema Templates',
    desc: 'Define reusable form fields with YAML once, fill it forever across any project.',
  },
  {
    icon: '◇',
    title: 'Structured Docs',
    desc: 'Project → Folder → File logic. Export any document cleanly to PDF.',
  },
  {
    icon: '⬘',
    title: 'Rich Text',
    desc: 'Bold, italic, and lists — inline rich text editing powered by Tiptap.',
  },
  {
    icon: '○',
    title: 'Live Preview',
    desc: 'See your rendered HTML document update in real time as you type.',
  },
  {
    icon: '△',
    title: 'Team Ready',
    desc: 'JWT-secured accounts with fully independent per-user projects.',
  },
  {
    icon: '⬡',
    title: 'PDF Export',
    desc: 'Pixel-perfect PDF generation via headless Chrome — what you see is what you get.',
  },
];

/* ─── Animated counter hook ─────────────────────────────────────────────── */
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

/* ─── Stats bar ─────────────────────────────────────────────────────────── */
const stats = [
  { value: 500, suffix: '+', label: 'Documents created' },
  { value: 12, suffix: 'x', label: 'Faster than Word' },
  { value: 99, suffix: '%', label: 'Export accuracy' },
];

function StatItem({ value, suffix, label, animate }) {
  const count = useCountUp(value, 1400, animate);
  const theme = useTheme();
  return (
    <Box sx={{ textAlign: 'center', px: 3 }}>
      <Typography
        sx={{
          fontSize: { xs: '2rem', md: '2.75rem' },
          fontWeight: 800,
          color: theme.palette.primary.main,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}{suffix}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Trigger counter when stats section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const p = theme.palette;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <AppBar position="sticky" color="default" elevation={0}
        sx={{
          bgcolor: alpha(p.background.paper, 0.85),
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${p.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2.5, md: 8 } }}>
          {/* Brand */}
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box sx={{
              width: 28, height: 28,
              bgcolor: p.primary.main,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              flexShrink: 0,
            }} />
            <Typography fontWeight={800} fontSize="17px" color="text.primary" letterSpacing="0.01em">
              Formify
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: p.divider,
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '13px',
                '&:hover': { borderColor: p.primary.main, color: p.primary.main, bgcolor: alpha(p.primary.main, 0.04) },
              }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/register')}
              disableElevation
              sx={{ fontWeight: 700, fontSize: '13px' }}
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
          pt: { xs: 8, md: 14 },
          pb: { xs: 6, md: 10 },
          px: { xs: 3, md: 8 },
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${p.divider} 1px, transparent 1px), linear-gradient(90deg, ${p.divider} 1px, transparent 1px)`,
          backgroundSize: isMobile ? '40px 40px' : '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
          opacity: 0.6,
        }} />

        {/* Glow orb */}
        <Box sx={{
          position: 'absolute',
          width: { xs: '300px', md: '700px' },
          height: { xs: '160px', md: '320px' },
          background: `radial-gradient(ellipse, ${alpha(p.primary.main, 0.1)} 0%, transparent 70%)`,
          top: 0, left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow chip */}
          <Chip
            label="Document management"
            size="small"
            sx={{
              mb: 3,
              bgcolor: alpha(p.primary.main, 0.08),
              color: p.primary.main,
              border: `1px solid ${alpha(p.primary.main, 0.2)}`,
              fontWeight: 700,
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          />

          {/* Headline */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.5rem', md: 'clamp(3rem, 6vw, 5rem)' },
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: 'text.primary',
              mb: 2.5,
            }}
          >
            Your documents,{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>reliably</Box>{' '}
            structured.
          </Typography>

          {/* Sub */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.65, maxWidth: 480, mx: 'auto', mb: 4.5 }}
          >
            Define templates once. Fill forms. Get polished documents — every time.
          </Typography>

          {/* CTA buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              disableElevation
              sx={{
                px: 4.5, py: 1.5,
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: `0 4px 20px ${alpha(p.primary.main, 0.3)}`,
                width: isMobile ? '100%' : 'auto',
                maxWidth: 280,
              }}
            >
              Go to app →
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 4, py: 1.5,
                fontWeight: 600,
                fontSize: '14px',
                borderColor: p.divider,
                color: 'text.primary',
                bgcolor: 'background.paper',
                width: isMobile ? '100%' : 'auto',
                maxWidth: 280,
                '&:hover': { borderColor: p.primary.main, bgcolor: alpha(p.primary.main, 0.04) },
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
          bgcolor: 'background.paper',
          borderTop: `1px solid ${p.divider}`,
          borderBottom: `1px solid ${p.divider}`,
          py: { xs: 4, md: 5 },
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
                sx={{ borderColor: p.divider }}
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
      <Box component="section" sx={{ py: { xs: 7, md: 11 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* Section label */}
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'text.disabled',
              mb: 5,
            }}
          >
            Everything you need
          </Typography>

          <Grid container spacing={2.5}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: `1px solid ${p.divider}`,
                    bgcolor: 'background.paper',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      borderColor: alpha(p.primary.main, 0.4),
                      boxShadow: `0 4px 24px ${alpha(p.primary.main, 0.08)}`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Typography
                      sx={{ fontSize: '22px', color: 'primary.main', mb: 2, display: 'block', lineHeight: 1 }}
                    >
                      {f.icon}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 1, fontSize: '16px' }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.65}>
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
      <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 7, md: 10 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              bgcolor: p.primary.main,
              borderRadius: 3,
              px: { xs: 4, md: 7 },
              py: { xs: 5, md: 6.5 },
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha('#fff', 0.07)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha('#fff', 0.05)} 0%, transparent 40%)`,
              },
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              color="primary.contrastText"
              sx={{ mb: 1.5, fontSize: { xs: '1.6rem', md: '2rem' }, position: 'relative', zIndex: 1 }}
            >
              Ready to get started?
            </Typography>
            <Typography
              color={alpha(p.primary.contrastText, 0.75)}
              sx={{ mb: 3.5, fontSize: '15px', position: 'relative', zIndex: 1 }}
            >
              Join teams already using Formify to ship documents faster.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                position: 'relative', zIndex: 1,
                bgcolor: 'background.paper',
                color: 'primary.main',
                fontWeight: 700,
                px: 4.5, py: 1.5,
                fontSize: '14px',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'background.default',
                  boxShadow: 'none',
                },
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
        sx={{
          borderTop: `1px solid ${p.divider}`,
          py: 3,
          px: { xs: 3, md: 8 },
          bgcolor: 'background.paper',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 18, height: 18,
              bgcolor: p.primary.main,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              opacity: 0.8,
            }} />
            <Typography fontSize="13px" fontWeight={700} color="text.secondary">
              Formify
            </Typography>
          </Stack>
          <Typography fontSize="12px" color="text.disabled" textAlign="center">
            Document management for teams. © {new Date().getFullYear()}
          </Typography>
        </Stack>
      </Box>

    </Box>
  );
}