export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(168, 85, 247, 0.15)',
    borderTop: '4px solid #a855f7',
    borderRight: '4px solid #06b6d4',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
  },
  text: {
    marginTop: '18px',
    color: '#38bdf8',
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
};
