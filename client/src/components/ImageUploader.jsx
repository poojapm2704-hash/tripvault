import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function ImageUploader({ tripId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Please select an image file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await api.post(`/api/trips/${tripId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Photo uploaded to Cloudinary! 📸');
      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess(response.data.trip);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload image to Cloudinary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} style={styles.form}>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setFile(e.target.files[0])} 
        style={styles.fileInput}
      />
      <button 
        type="submit" 
        disabled={loading || !file} 
        style={{
          ...styles.uploadBtn,
          opacity: loading || !file ? 0.6 : 1,
          cursor: loading || !file ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Uploading...' : '⬆️ Upload Photo'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '12px',
    padding: '14px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '10px',
    border: '1px dashed rgba(168, 85, 247, 0.4)',
  },
  fileInput: {
    color: '#94a3b8',
    fontSize: '12px',
  },
  uploadBtn: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#ffffff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
  },
};