import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import TripCard from '../components/TripCard';
import TripModal from '../components/TripModal';

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      const parsed = JSON.parse(storedUser);
      const actualUser = parsed.user || parsed;
      return {
        fullName: actualUser.fullName || actualUser.name || actualUser.username || '',
        username: actualUser.username || '',
        email: actualUser.email || '',
        bio: actualUser.bio || '',
      };
    } catch (err) {
      console.error('Failed to parse user details', err);
      return null;
    }
  });

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/api/auth/me');
        const fetchedUser = res.data.user || res.data;
        setUser((prev) => ({
          ...prev,
          username: fetchedUser.username || prev?.username,
          fullName: fetchedUser.fullName || fetchedUser.name || prev?.fullName,
          bio: fetchedUser.bio || '',
        }));
        setBio(fetchedUser.bio || '');
      } catch (err) {
        console.error('Failed to fetch user bio:', err);
      }
    };

    fetchUserData();
  }, []);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/trips');
      setTrips(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      const msg = 'Could not load trips. Please check backend connection.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchTrips();
  }, [user, navigate, fetchTrips]);

  const handleUpdateBio = async (e) => {
    e.preventDefault();
    setSavingBio(true);
    try {
      const res = await api.put('/api/users/profile', { bio });
      toast.success('Bio updated successfully! 👤');
      setUser((prev) => ({ ...prev, bio: res.data.user?.bio || bio }));
      setIsEditingBio(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update bio.');
    } finally {
      setSavingBio(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedTrip) {
        await api.put(`/api/trips/${selectedTrip._id}`, formData);
        toast.success('Trip updated successfully! ✏️');
      } else {
        await api.post('/api/trips', formData);
        toast.success('Trip created successfully! ✈️');
      }
      setIsModalOpen(false);
      setSelectedTrip(null);
      fetchTrips();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error saving trip.';
      toast.error(errMsg);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this trip memory?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/trips/${tripId}`);
      toast.success('Trip deleted successfully.');
      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete trip.');
    }
  };

  const handlePhotoUploaded = (updatedTrip) => {
    toast.success('Photo uploaded to Cloudinary! 📸');
    setTrips((prevTrips) =>
      prevTrips.map((t) => (t._id === updatedTrip._id ? updatedTrip : t))
    );
  };

  const handleOpenCreateModal = () => {
    setSelectedTrip(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  if (!user) return null;

  return (
    <div style={styles.pageWrapper}>
      <Navbar user={user} />

      <main style={styles.mainContent}>
        {/* Profile Controls */}
        <div style={styles.profileControlRow}>
          <Link 
            to={`/profile/${user?.username || user?.fullName || user?.name}`} 
            style={styles.publicProfileBtn}
          >
            👤 View My Public Profile
          </Link>

          <button 
            onClick={() => setIsEditingBio(!isEditingBio)}
            style={styles.editBioToggleBtn}
          >
            ✏️ {isEditingBio ? 'Close Bio Form' : 'Edit Bio'}
          </button>
        </div>

        {/* User Bio Card */}
        <div style={styles.bioSection}>
          <h3 style={styles.bioTitle}>About Me</h3>
          <p style={styles.bioText}>
            {user?.bio || 'You haven\'t added a bio yet. Tell travelers about your adventures!'}
          </p>

          {isEditingBio && (
            <form onSubmit={handleUpdateBio} style={styles.bioForm}>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                rows="3" 
                style={styles.textarea}
                placeholder="Tell the world about your travels..."
              />
              <button type="submit" disabled={savingBio} style={styles.saveBioBtn}>
                {savingBio ? 'Saving...' : 'Save Bio'}
              </button>
            </form>
          )}
        </div>

        {/* Actions Bar */}
        <div style={styles.actionBar}>
          <div>
            <h2 style={styles.sectionTitle}>Your Trip Collection</h2>
            <p style={styles.subtitle}>Manage, view, and organize your travel memories.</p>
          </div>
          <button onClick={handleOpenCreateModal} style={styles.createBtn}>
            ➕ Add New Trip
          </button>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        {/* Loading / Empty / Content states */}
        {loading ? (
          <LoadingSpinner message="Loading your travel memories..." />
        ) : trips.length === 0 ? (
          <div style={styles.emptyCard}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🏝️</span>
            <h3 style={{ color: '#ffffff', margin: '0 0 10px 0', fontSize: '24px', fontWeight: '800' }}>
              You haven't added any trips yet.
            </h3>
            <p style={{ color: '#94a3b8', margin: '0 0 28px 0', fontSize: '15px', lineHeight: '1.6' }}>
              Start your journey today! Record your travels, destinations, ratings, and photos in your vault.
            </p>
            <button onClick={handleOpenCreateModal} style={styles.createBtn}>
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTrip}
                onPhotoUploaded={handlePhotoUploaded}
              />
            ))}
          </div>
        )}
      </main>

      <TripModal
        key={selectedTrip ? selectedTrip._id : 'new-trip'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTrip}
      />

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
  profileControlRow: {
    display: 'flex',
    gap: '14px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  publicProfileBtn: {
    padding: '12px 22px',
    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
    color: '#ffffff',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
    display: 'inline-block',
    transition: 'all 0.2s',
  },
  editBioToggleBtn: {
    padding: '12px 22px',
    background: 'rgba(30, 41, 59, 0.7)',
    color: '#c084fc',
    border: '1px solid #a855f7',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    backdropFilter: 'blur(10px)',
  },
  bioSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '16px',
    padding: '24px 28px',
    marginBottom: '36px',
    boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.4)',
  },
  bioTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: '#38bdf8',
    fontWeight: '700',
  },
  bioText: {
    margin: 0,
    color: '#cbd5e1',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  bioForm: {
    marginTop: '18px',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    color: '#ffffff',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '10px',
    marginBottom: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: '14px',
  },
  saveBioBtn: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#ffffff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff, #cbd5e1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: '4px 0 0 0',
    color: '#94a3b8',
    fontSize: '14px',
  },
  createBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
    color: '#ffffff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 8px 22px -4px rgba(124, 58, 237, 0.45)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '28px',
  },
  emptyCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '20px',
    padding: '60px 28px',
    textAlign: 'center',
    maxWidth: '540px',
    margin: '40px auto',
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid #f43f5e',
    color: '#fda4af',
    padding: '14px 18px',
    borderRadius: '10px',
    marginBottom: '24px',
  },
};