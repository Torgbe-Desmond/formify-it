import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 850);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  const styles = {
    root: { minHeight: '100vh', display: 'flex', background: '#f4f6f8', fontFamily: '"Roboto", sans-serif' },
    leftPanel: { 
      flex: isMobile ? '1' : '0 0 460px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: isMobile ? '40px 24px' : '64px 56px', 
      background: '#ffffff', 
      borderRight: isMobile ? 'none' : '1px solid #e0e0e0' 
    },
    rightPanel: { 
      flex: 1, 
      display: isMobile ? 'none' : 'flex', 
      background: '#f8fafc', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative' 
    },
    brand: { 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: '10px', 
      marginBottom: '40px' 
    },
    brandMark: { width: 32, height: 32, background: '#1976d2', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    brandName: { fontSize: '20px', fontWeight: 700, color: '#1a2027' },
    heading: { 
      fontSize: isMobile ? '28px' : '32px', 
      fontWeight: 700, 
      marginBottom: '8px',
      textAlign: isMobile ? 'center' : 'left'
    },
    label: { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', display: 'block' },
    input: { width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '18px', boxSizing: 'border-box', fontSize: '16px' },
    submitBtn: { width: '100%', padding: '14px', background: '#1976d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
    gridOverlay: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 },
  };

  return (
    <div style={styles.root}>
      <div style={styles.leftPanel}>
        <div style={styles.brand}><div style={styles.brandMark}/><span style={styles.brandName}>FastTransfers</span></div>
        <h1 style={styles.heading}>Create account.</h1>
        <p style={{color: '#5f6368', marginBottom: '32px', textAlign: isMobile ? 'center' : 'left'}}>Start organizing your documents today.</p>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input style={styles.input} placeholder="John Doe" onChange={e => setForm({...form, name: e.target.value})} required />
          <label style={styles.label}>Email Address</label>
          <input style={styles.input} type="email" placeholder="name@company.com" onChange={e => setForm({...form, email: e.target.value})} required />
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="••••••••" onChange={e => setForm({...form, password: e.target.value})} required />
          {error && <div style={{color: '#d32f2f', fontSize: '13px', marginBottom: '16px'}}>{error}</div>}
          <button style={styles.submitBtn} disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <div style={{marginTop: '24px', textAlign: 'center', fontSize: '14px'}}>
          Already registered? <Link to="/login" style={{color: '#1976d2', fontWeight: 600, textDecoration: 'none'}}>Sign In</Link>
        </div>
      </div>
      
      <div style={styles.rightPanel}>
        <div style={styles.gridOverlay} />
        <div style={{zIndex: 1, padding: '40px', maxWidth: '300px', textAlign: 'center'}}>
            <div style={{fontSize: '32px', color: '#1976d2', marginBottom: '16px'}}>◈</div>
            <div style={{fontWeight: 700, color: '#1a2027', marginBottom: '8px', fontSize: '18px'}}>Schema Templates</div>
            <div style={{color: '#5f6368', fontSize: '14px', lineHeight: 1.6}}>Define reusable form fields once and generate documents instantly with precision.</div>
        </div>
      </div>
    </div>
  );
};

export default Register;