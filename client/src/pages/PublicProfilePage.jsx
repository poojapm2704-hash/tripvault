import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const storedUser = localStorage.getItem('user');
  let currentUser = null;
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      currentUser = currentUser.user || currentUser;
    } catch {
      currentUser = null;
    }
  }

  useEffect(() => {
    setLoading(true);
    api.get(`/api/users/${username}/profile`)
      .then((res) => {
        setProfileData(res.data);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching public profile:', err);
        setError('User profile not found. Please verify the username.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop';

  return (
    <div style={styles.pageWrapper}>
      <Navbar user={currentUser} />

      <main style={styles.mainContent}>
        {loading ? (
          <LoadingSpinner message={`Loading @${username}'s travel vault...`} />
        ) : error || !profileData ? (
          <div style={styles.emptyCard}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>👤</span>
            <h2 style={{ color: '#ffffff', margin: '0 0 10px 0', fontSize: '24px', fontWeight: '800' }}>
              Profile Not Found
            </h2>
            <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: '15px' }}>
              We couldn't find a travel vault for "<strong>{username}</strong>".
            </p>
            <Link to="/dashboard" style={styles.actionBtn}>
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Header Bio Card */}
            <div style={styles.profileHeaderCard}>
              <div style={styles.avatar}>
                {profileData.user?.name ? profileData.user.name.charAt(0).toUpperCase() : '✈️'}
              </div>
              <div style={styles.profileInfo}>
                <h1 style={styles.userName}>{profileData.user.name}</h1>
                <p style={styles.userHandle}>@{profileData.user.username}</p>
                {profileData.user.bio ? (
                  <p style={styles.userBio}>"{profileData.user.bio}"</p>
                ) : (
                  <p style={styles.noBio}>No bio provided yet.</p>
                )}
              </div>
            </div>

            {/* Travel Collection Header */}
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                Public Travel Memories ({profileData.trips ? profileData.trips.length : 0})
              </h2>
            </div>

            {/* Trips List */}
            {profileData.trips && profileData.trips.length > 0 ? (
              <div style={styles.grid}>
                {profileData.trips.map((trip) => (
                  <div key={trip._id} className="glass-card" style={styles.card}>
                    <div style={styles.imageContainer}>
                      <img 
                        src={trip.coverImage || defaultImage} 
                        alt={trip.title} 
                        style={styles.coverImage} 
                      />
                    </div>
                    <div style={styles.cardBody}>
                      <h3 style={styles.tripTitle}>{trip.title}</h3>
                      <p style={styles.destination}>📍 {trip.destination}</p>
                      {trip.rating && (
                        <p style={styles.rating}>⭐ {'⭐'.repeat(trip.rating - 1)} ({trip.rating}/5)</p>
                      )}
                      {trip.description && (
                        <p style={styles.description}>{trip.description}</p>
                      )}

                      {trip.photos && trip.photos.length > 0 && (
                        <div style={styles.photosSection}>
                          <p style={styles.photosLabel}>📸 Shared Photos ({trip.photos.length})</p>
                          <div style={styles.photoGrid}>
                            {trip.photos.map((photo, i) => (
                              <img key={i} src={photo} alt="" style={styles.gridPhoto} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyCard}>
                <span style={{ fontSize: '56px', display: 'block', marginBottom: '14px' }}>🏝️</span>
                <h3 style={{ color: '#ffffff', margin: '0 0 10px 0', fontSize: '22px', fontWeight: '800' }}>
                  No Public Trips Yet
                </h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px' }}>
                  This user hasn't added any travel memories to their public vault.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '36px 20px 60px 20px',
    flex: 1,
    boxSizing: 'border-box',
  },
  profileHeaderCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '20px',
    padding: '36px',
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
    marginBottom: '40px',
    boxShadow: '0 20px 40px -15px rgba(124, 58, 237, 0.25)',
    flexWrap: 'wrap',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    boxShadow: '0 0 25px rgba(124, 58, 237, 0.5)',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    margin: '0 0 4px 0',
    fontSize: '32px',
    fontWeight: '800',
    color: '#ffffff',
  },
  userHandle: {
    margin: '0 0 12px 0',
    color: '#38bdf8',
    fontWeight: '700',
    fontSize: '16px',
  },
  userBio: {
    margin: 0,
    color: '#cbd5e1',
    fontStyle: 'italic',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  noBio: {
    margin: 0,
    color: '#64748b',
    fontSize: '14px',
  },
  sectionHeader: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '28px',
  },
  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    height: '190px',
    backgroundColor: '#0f172a',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  tripTitle: {
    margin: '0 0 4px 0',
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
  },
  destination: {
    margin: '0 0 8px 0',
    color: '#38bdf8',
    fontSize: '14px',
    fontWeight: '700',
  },
  rating: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#f59e0b',
  },
  description: {
    margin: '0 0 16px 0',
    color: '#cbd5e1',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  photosSection: {
    marginTop: 'auto',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  photosLabel: {
    margin: '0 0 10px 0',
    color: '#c084fc',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(55px, 1fr))',
    gap: '8px',
  },
  gridPhoto: {
    width: '100%',
    height: '55px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
  },
  emptyCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '20px',
    padding: '60px 28px',
    textAlign: 'center',
    maxWidth: '520px',
    margin: '40px auto',
  },
  actionBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    display: 'inline-block',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
  },
};