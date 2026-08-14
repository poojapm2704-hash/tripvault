import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Footer from '../components/Footer';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Welcome back! Logged in successfully. ✈️');

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.pageContainer}>
        <div style={styles.card}>
          {/* Brand Header */}
          <div style={styles.brandHeader}>
            <span style={styles.logoIcon}>✈️</span>
            <h1 style={styles.logoTitle}>TripVault</h1>
            <p style={styles.subtitle}>Welcome back! Access your travel memories.</p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div style={styles.errorAlert}>
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePasswordBtn}
                >
                  {showPassword ? '🙈 Hide' : '👁️ Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Logging in...' : 'Sign In to Vault →'}
            </button>
          </form>

          {/* Footer */}
          <div style={styles.footer}>
            <p>
              Don't have an account?{' '}
              <Link to="/register" style={styles.link}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  pageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.25) 0%, rgba(15, 23, 42, 0.95) 70%)',
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '10px',
  },
  logoTitle: {
    margin: '0',
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #c084fc, #38bdf8, #818cf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '8px 0 0 0',
    color: '#94a3b8',
    fontSize: '14px',
  },
  errorAlert: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid #f43f5e',
    color: '#fda4af',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '22px',
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#38bdf8',
    letterSpacing: '0.3px',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    color: '#ffffff',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s',
  },
  togglePasswordBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#38bdf8',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px 8px',
    fontWeight: '600',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
    color: '#ffffff',
    border: 'none',
    padding: '15px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '16px',
    marginTop: '10px',
    boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '20px',
    fontSize: '14px',
    color: '#94a3b8',
  },
  link: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '700',
  },
};