import { useState } from 'react';

export default function TripModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
    endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
    description: initialData?.description || '',
    rating: initialData?.rating || 5,
  }));

  const [prevData, setPrevData] = useState({ initialData, isOpen });
  if (prevData.initialData !== initialData || prevData.isOpen !== isOpen) {
    setPrevData({ initialData, isOpen });
    setFormData({
      title: initialData?.title || '',
      destination: initialData?.destination || '',
      startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
      endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
      description: initialData?.description || '',
      rating: initialData?.rating || 5,
    });
  }

  const [locationError, setLocationError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocationError('');
    setIsValidating(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.destination
        )}`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        setLocationError('⚠️ Location not found on map! Check spelling or try a broader city name.');
        setIsValidating(false);
        return;
      }

      onSubmit(formData);
    } catch {
      onSubmit(formData);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {initialData ? '✏️ Edit Trip' : '✈️ Add New Trip'}
          </h2>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Trip Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Summer in Bali"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination *</label>
            <input
              type="text"
              required
              placeholder="e.g., Denpasar, Indonesia"
              value={formData.destination}
              onChange={(e) => {
                setLocationError('');
                setFormData((prev) => ({ ...prev, destination: e.target.value }));
              }}
              style={{
                ...styles.input,
                borderColor: locationError ? '#f43f5e' : 'rgba(139, 92, 246, 0.3)',
              }}
            />
            {locationError && (
              <span style={styles.errorText}>{locationError}</span>
            )}
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rating (1 - 5)</label>
            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))
              }
              style={styles.input}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
              <option value={3}>⭐⭐⭐ (3/5)</option>
              <option value={2}>⭐⭐ (2/5)</option>
              <option value={1}>⭐ (1/5)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description / Memories</label>
            <textarea
              rows="3"
              placeholder="Write down notes, itinerary highlights, or favorite memories..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isValidating}
              style={{
                ...styles.submitBtn,
                opacity: isValidating ? 0.7 : 1,
                cursor: isValidating ? 'not-allowed' : 'pointer',
              }}
            >
              {isValidating
                ? 'Verifying...'
                : initialData
                ? 'Save Changes'
                : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modalCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(139, 92, 246, 0.35)',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px -15px rgba(124, 58, 237, 0.35)',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '22px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    fontSize: '18px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  row: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#38bdf8',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  errorText: {
    color: '#fda4af',
    fontSize: '12px',
    marginTop: '2px',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '14px',
    marginTop: '12px',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '14px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
  },
};