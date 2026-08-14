import { useState } from 'react';
import ImageUploader from './ImageUploader';

export default function TripCard({ trip, onEdit, onDelete, onPhotoUploaded }) {
  const [showUploader, setShowUploader] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating) => {
    if (!rating) return 'No rating';
    return '⭐'.repeat(rating);
  };

  return (
    <div className="glass-card" style={styles.card}>
      {/* Cover Image Header */}
      <div style={styles.imageContainer}>
        <img 
          src={trip.coverImage || defaultImage} 
          alt={trip.title || 'Trip Cover'} 
          style={styles.coverImage}
        />
        <div style={styles.imageOverlay} />
      </div>

      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.title}>{trip.title}</h3>
            <p style={styles.destination}>📍 {trip.destination}</p>
          </div>
          <span style={styles.rating}>{renderStars(trip.rating)}</span>
        </div>

        <div style={styles.dateBadge}>
          🗓️ {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
        </div>

        {trip.description && (
          <p style={styles.description}>{trip.description}</p>
        )}

        {/* Photo Gallery Grid */}
        {trip.photos && trip.photos.length > 0 && (
          <div style={styles.galleryContainer}>
            <p style={styles.galleryTitle}>📸 Photo Gallery ({trip.photos.length})</p>
            <div style={styles.photoGrid}>
              {trip.photos.map((photoUrl, index) => (
                <img 
                  key={index} 
                  src={photoUrl} 
                  alt={`Trip photo ${index + 1}`} 
                  style={styles.gridPhoto} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Toggle Image Uploader */}
        <button
          onClick={() => setShowUploader(!showUploader)}
          style={styles.toggleUploadBtn}
        >
          📷 {showUploader ? 'Close Upload' : 'Upload Photo'}
        </button>

        {showUploader && (
          <ImageUploader 
            tripId={trip._id} 
            onUploadSuccess={(updatedTrip) => {
              setShowUploader(false);
              if (onPhotoUploaded) onPhotoUploaded(updatedTrip);
            }} 
          />
        )}

        <div style={styles.actionRow}>
          <button onClick={() => onEdit(trip)} style={styles.editBtn}>
            ✏️ Edit
          </button>
          <button onClick={() => onDelete(trip._id)} style={styles.deleteBtn}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '190px',
    backgroundColor: '#0f172a',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40px',
    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)',
  },
  cardContent: {
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  title: {
    margin: '0',
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
  },
  destination: {
    margin: '4px 0 0 0',
    color: '#38bdf8',
    fontSize: '14px',
    fontWeight: '700',
  },
  rating: {
    fontSize: '14px',
  },
  dateBadge: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    color: '#cbd5e1',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'inline-block',
  },
  description: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '18px',
  },
  galleryContainer: {
    marginBottom: '16px',
  },
  galleryTitle: {
    color: '#a855f7',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '8px',
  },
  gridPhoto: {
    width: '100%',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid rgba(139, 92, 246, 0.3)',
  },
  toggleUploadBtn: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    color: '#c084fc',
    border: '1px dashed #a855f7',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '16px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
  editBtn: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    color: '#38bdf8',
    border: '1px solid #0284c7',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    color: '#fda4af',
    border: '1px solid #f43f5e',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
};