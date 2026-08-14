import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const username = user?.username || user?.fullName || user?.name;
  const isDashboard = location.pathname === '/dashboard';
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <header style={styles.header}>
      <div style={styles.navContainer}>
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/login"} style={styles.brandLink}>
          <span style={styles.logoIcon}>✈️</span>
          <span style={styles.brandTitle}>TripVault</span>
        </Link>

        {/* Desktop Controls */}
        <div style={styles.desktopMenu}>
          {user ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  ...styles.navLink,
                  ...(isDashboard ? styles.activeNavLink : {}),
                }}
              >
                🗺️ Dashboard
              </Link>

              {username && (
                <Link
                  to={`/profile/${username}`}
                  style={{
                    ...styles.navLink,
                    ...(isProfile ? styles.activeNavLink : {}),
                  }}
                >
                  👤 My Profile
                </Link>
              )}

              <span style={styles.userGreeting}>
                Hello, <strong style={{ color: '#06b6d4' }}>{user.fullName || user.name || 'Traveler'}</strong>
              </span>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>
                Log In
              </Link>
              <Link to="/register" style={styles.registerNavBtn}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Toggle Button for Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.hamburgerBtn}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {user ? (
            <>
              <div style={styles.mobileGreeting}>
                Logged in as <strong style={{ color: '#06b6d4' }}>{user.fullName || user.name || 'Traveler'}</strong>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  ...styles.mobileNavLink,
                  ...(isDashboard ? styles.activeMobileNavLink : {}),
                }}
              >
                🗺️ Dashboard
              </Link>
              {username && (
                <Link
                  to={`/profile/${username}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    ...styles.mobileNavLink,
                    ...(isProfile ? styles.activeMobileNavLink : {}),
                  }}
                >
                  👤 My Public Profile
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={styles.mobileLogoutBtn}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={styles.mobileNavLink}
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={styles.mobileNavLink}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.25)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '14px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    fontSize: '28px',
  },
  brandTitle: {
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #c084fc, #38bdf8, #818cf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  navLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  activeNavLink: {
    color: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
  },
  userGreeting: {
    color: '#94a3b8',
    fontSize: '14px',
    paddingLeft: '12px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logoutBtn: {
    background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.3))',
    color: '#fda4af',
    border: '1px solid #f43f5e',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  registerNavBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
  },
  hamburgerBtn: {
    display: 'none',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
    color: '#38bdf8',
    fontSize: '20px',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  mobileMenu: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileGreeting: {
    color: '#94a3b8',
    fontSize: '14px',
    marginBottom: '4px',
  },
  mobileNavLink: {
    color: '#f8fafc',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  activeMobileNavLink: {
    color: '#38bdf8',
    borderLeft: '4px solid #38bdf8',
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
  },
  mobileLogoutBtn: {
    background: 'linear-gradient(135deg, #e11d48, #be123c)',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '6px',
  },
};
