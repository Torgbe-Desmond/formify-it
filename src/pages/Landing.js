import { useNavigate } from 'react-router-dom';

/* ─── Styles (Original Layout + New Theme Colors) ─────────────────────────── */
const S = {
  root: {
    minHeight: '100vh',
    background: '#f4f6f8', // Theme: background.default
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Theme: Typography
    color: '#1a2027', // Theme: text.primary
    overflowX: 'hidden',
  },

  /* Nav */
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 64px',
    position: 'relative',
    zIndex: 10,
    background: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandMark: {
    width: 28,
    height: 28,
    background: '#1976d2', // Theme: primary.main
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a2027',
    letterSpacing: '0.02em',
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  navBtn: {
    padding: '9px 22px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"Roboto", sans-serif',
    transition: 'all 0.15s',
  },
  navBtnGhost: {
    background: 'transparent',
    border: '1px solid #e0e0e0',
    color: '#5f6368', // Theme: text.secondary
  },
  navBtnPrimary: {
    background: '#1976d2',
    border: '1px solid #1976d2',
    color: '#ffffff',
  },

  /* Hero */
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '100px 64px 80px',
  },
  gridBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)',
    backgroundSize: '56px 56px',
    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
    opacity: 0.5,
  },
  glowOrb: {
    position: 'absolute',
    width: '600px',
    height: '300px',
    background: 'radial-gradient(ellipse, rgba(25, 118, 210, 0.05) 0%, transparent 70%)',
    top: '0px',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },
  eyebrow: {
    position: 'relative',
    zIndex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(25, 118, 210, 0.08)',
    border: '1px solid rgba(25, 118, 210, 0.2)',
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#1976d2',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '32px',
  },
  eyebrowDot: { width: 6, height: 6, borderRadius: '50%', background: '#1976d2' },
  heroTitle: {
    position: 'relative',
    zIndex: 1,
    fontSize: 'clamp(48px, 6vw, 80px)',
    fontWeight: 800,
    lineHeight: 1.1,
    color: '#1a2027',
    marginBottom: '28px',
    maxWidth: '900px',
    letterSpacing: '-0.02em',
  },
  heroTitleAccent: { color: '#1976d2' },
  heroSub: {
    position: 'relative',
    zIndex: 1,
    fontSize: '18px',
    color: '#5f6368',
    lineHeight: 1.7,
    maxWidth: '520px',
    marginBottom: '52px',
  },
  ctaRow: { position: 'relative', zIndex: 1, display: 'flex', gap: '12px' },
  ctaPrimary: {
    padding: '16px 36px',
    background: '#1976d2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
  },
  ctaSecondary: {
    padding: '16px 32px',
    background: '#ffffff',
    color: '#1a2027',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  /* Feature cards */
  featuresSection: { padding: '0 64px 100px', position: 'relative', zIndex: 1 },
  sectionLabel: {
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#94a3b8',
    marginBottom: '40px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    background: '#ffffff',
    padding: '36px 32px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.02)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardIcon: { fontSize: '24px', color: '#1976d2', marginBottom: '20px', display: 'block' },
  cardTitle: { fontSize: '18px', color: '#1a2027', marginBottom: '10px', fontWeight: 700 },
  cardDesc: { fontSize: '14px', color: '#5f6368', lineHeight: 1.6 },

  /* Footer */
  footer: { borderTop: '1px solid #e0e0e0', padding: '28px 64px', display: 'flex', justifyContent: 'space-between', background: '#ffffff' },
  footerBrand: { display: 'flex', alignItems: 'center', gap: '8px' },
  footerMark: { width: 18, height: 18, background: '#1976d2', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', opacity: 0.8 },
  footerText: { fontSize: '12px', color: '#94a3b8' },
};

const features = [
  { icon: '◈', title: 'Schema Templates', desc: 'Define reusable form fields with YAML. Write your HTML layout once, fill it forever.' },
//   { icon: '⬡', title: 'Offline First', desc: 'Every change is saved locally. When connectivity returns, everything syncs automatically.' },
//   { icon: '◇', title: 'Structured Docs', desc: 'Project → Folder → File. Navigate with breadcrumbs. Export any document to PDF.' },
  { icon: '⬘', title: 'Rich Text', desc: 'Bold, italic, lists — inline rich text in any form field via Tiptap.' },
  { icon: '○', title: 'Live Preview', desc: 'See your rendered HTML document update in real time as you fill in the form.' },
  { icon: '△', title: 'Team Ready', desc: 'JWT-secured accounts. Each user owns their projects independently.' },
];

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div style={S.root}>
      <nav style={S.nav}>
        <div style={S.brand}><div style={S.brandMark}/><span style={S.brandName}>Formify</span></div>
        <div style={S.navLinks}>
          <button style={{...S.navBtn, ...S.navBtnGhost}} onClick={() => navigate('/login')}>Sign in</button>
          <button style={{...S.navBtn, ...S.navBtnPrimary}} onClick={() => navigate('/register')}>Get started</button>
        </div>
      </nav>

      <section style={S.hero}>
        <div style={S.gridBg}/><div style={S.glowOrb}/>
        <div style={S.eyebrow}><span style={S.eyebrowDot}/>Document management, simplified</div>
        <h1 style={S.heroTitle}>Your documents,<br/><span style={S.heroTitleAccent}>reliably</span> structured.</h1>
        <p style={S.heroSub}>Define templates once. Fill forms. Get polished documents — all synced across devices, even offline.</p>
        <div style={S.ctaRow}>
          <button style={S.ctaPrimary} onClick={() => navigate('/login')}>Go to app →</button>
          <button style={S.ctaSecondary} onClick={() => navigate('/register')}>Create account</button>
        </div>
      </section>

      <section style={S.featuresSection}>
        <p style={S.sectionLabel}>Everything you need</p>
        <div style={S.cardsGrid}>
          {features.map((f) => (
            <div key={f.title} style={S.card}>
              <span style={S.cardIcon}>{f.icon}</span>
              <div style={S.cardTitle}>{f.title}</div>
              <div style={S.cardDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={S.footer}>
        <div style={S.footerBrand}><div style={S.footerMark}/><span style={{...S.footerText, marginLeft: 4}}>Formify</span></div>
        <span style={S.footerText}>Document management for teams.</span>
      </footer>
    </div>
  );
};

export default Landing;