import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { login } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 850);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  const styles = {
    root: { 
      minHeight: '100vh', 
      display: 'flex', 
      background: '#f4f6f8', 
      fontFamily: '"Roboto", sans-serif' 
    },
    leftPanel: { 
      flex: isMobile ? '1' : '0 0 420px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: isMobile ? '40px 24px' : '64px 56px', 
      background: '#ffffff', 
      borderRight: isMobile ? 'none' : '1px solid #e0e0e0', 
      zIndex: 1 
    },
    rightPanel: { 
      flex: 1, 
      display: isMobile ? 'none' : 'flex', 
      background: '#f8fafc', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative', 
      overflow: 'hidden' 
    },
    brand: { 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: '10px', 
      marginBottom: '40px' 
    },
    brandMark: { 
      width: 32, 
      height: 32, 
      background: '#1976d2', 
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' 
    },
    brandName: { fontSize: '20px', fontWeight: 700, color: '#1a2027' },
    heading: { 
      fontSize: isMobile ? '28px' : '32px', 
      fontWeight: 700, 
      color: '#1a2027', 
      marginBottom: '8px',
      textAlign: isMobile ? 'center' : 'left'
    },
    subheading: { 
      fontSize: '14px', 
      color: '#5f6368', 
      marginBottom: '32px',
      textAlign: isMobile ? 'center' : 'left'
    },
    label: { 
      fontSize: '11px', 
      fontWeight: 700, 
      textTransform: 'uppercase', 
      color: '#94a3b8', 
      marginBottom: '8px', 
      display: 'block' 
    },
    input: { 
      width: '100%', 
      padding: '12px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      marginBottom: '20px', 
      boxSizing: 'border-box', 
      outline: 'none', 
      fontSize: '16px' // Better for mobile zoom
    },
    submitBtn: { 
      width: '100%', 
      padding: '14px', 
      background: '#1976d2', 
      color: '#ffffff', 
      border: 'none', 
      borderRadius: '8px', 
      fontWeight: 700, 
      cursor: 'pointer',
      fontSize: '15px'
    },
    gridOverlay: { 
      position: 'absolute', 
      inset: 0, 
      backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', 
      backgroundSize: '40px 40px', 
      opacity: 0.5 
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.leftPanel}>
        <div style={styles.brand}><div style={styles.brandMark}/><span style={styles.brandName}>FastTransfers</span></div>
        <h1 style={styles.heading}>Welcome back.</h1>
        <p style={styles.subheading}>Sign in to access your documents.</p>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" onChange={e => setForm({...form, email: e.target.value})} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" onChange={e => setForm({...form, password: e.target.value})} required />
          {error && <div style={{color: '#d32f2f', fontSize: '13px', marginBottom: '16px'}}>{error}</div>}
          <button style={styles.submitBtn} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div style={{marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#5f6368'}}>
          Don't have an account? <Link to="/register" style={{color: '#1976d2', fontWeight: 600, textDecoration: 'none'}}>Register</Link>
        </div>
      </div>
      
      <div style={styles.rightPanel}>
        <div style={styles.gridOverlay} />
        <div style={{zIndex: 1, padding: '40px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e0e0e0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '300px'}}>
          <div style={{color: '#1976d2', fontWeight: 700, fontSize: '12px', marginBottom: '16px', letterSpacing: '0.1em'}}>SECURE LOGIN</div>
          <div style={{fontSize: '14px', color: '#5f6368', lineHeight: 1.6}}>Your data is encrypted and synced across all your devices in real-time.</div>
        </div>
      </div>
    </div>
  );
};

export default Login;