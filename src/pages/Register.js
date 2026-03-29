import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register } from '../store/slices/authSlice';

const styles = {
  root: { minHeight: '100vh', display: 'flex', background: '#f4f6f8', fontFamily: '"Roboto", sans-serif' },
  leftPanel: { flex: '0 0 460px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px', background: '#ffffff', borderRight: '1px solid #e0e0e0' },
  rightPanel: { flex: 1, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' },
  brandMark: { width: 32, height: 32, background: '#1976d2', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  brandName: { fontSize: '20px', fontWeight: 700, color: '#1a2027' },
  heading: { fontSize: '32px', fontWeight: 700, marginBottom: '8px' },
  input: { width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '18px', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '14px', background: '#1976d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
  gridOverlay: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 },
};

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <div style={styles.root}>
      <div style={styles.leftPanel}>
        <div style={styles.brand}><div style={styles.brandMark}/><span style={styles.brandName}>Formify</span></div>
        <h1 style={styles.heading}>Create account.</h1>
        <p style={{color: '#5f6368', marginBottom: '32px'}}>Start organizing your documents today.</p>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} />
          <input style={styles.input} placeholder="Email" type="email" onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
          {error && <div style={{color: '#d32f2f', fontSize: '13px', marginBottom: '16px'}}>{error}</div>}
          <button style={styles.submitBtn} disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <div style={{marginTop: '24px', textAlign: 'center', fontSize: '14px'}}>
          Already registered? <Link to="/login" style={{color: '#1976d2', fontWeight: 600, textDecoration: 'none'}}>Sign In</Link>
        </div>
      </div>
      <div style={styles.rightPanel}>
        <div style={styles.gridOverlay} />
        <div style={{zIndex: 1, padding: '40px', maxWidth: '300px'}}>
            <div style={{fontSize: '24px', color: '#1976d2', marginBottom: '16px'}}>◈</div>
            <div style={{fontWeight: 700, color: '#1a2027', marginBottom: '8px'}}>Schema Templates</div>
            <div style={{color: '#5f6368', fontSize: '14px'}}>Define reusable form fields once and generate documents instantly.</div>
        </div>
      </div>
    </div>
  );
};
export default Register;