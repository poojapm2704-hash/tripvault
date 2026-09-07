export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          <strong style={styles.brandAccent}>TripVault</strong> &copy; {new Date().getFullYear()} — Built with ❤️ for Virtual Internship Program
        </p>
        <p style={styles.authorText}>
          Created by <strong style={{ color: '#f8fafc' }}>Pooja P M</strong> |{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            GitHub Repository ↗
          </a>
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(139, 92, 246, 0.25)',
    padding: '28px 20px',
    marginTop: 'auto',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
  },
  text: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '14px',
  },
  brandAccent: {
    background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
  },
  authorText: {
    margin: 0,
    color: '#cbd5e1',
    fontSize: '13px',
  },
  link: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
};
