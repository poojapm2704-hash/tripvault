const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// @route   POST /api/trips
// @desc    Create a new trip (Authenticated user only)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, destination, startDate, endDate, description, rating, coverImage, photos } = req.body;

    if (!title || !destination) {
      return res.status(400).json({ message: 'Title and Destination are required.' });
    }

    const trip = new Trip({
      title,
      destination,
      startDate: startDate || null,
      endDate: endDate || null,
      description: description || '',
      rating: rating || 5,
      coverImage: coverImage || '',
      photos: photos || [],
      user: req.user.id,
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error('Error creating trip:', err);
    res.status(500).json({ message: 'Server error while creating trip.' });
  }
});

// @route   GET /api/trips
// @desc    Get all trips for the logged-in user ONLY
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ message: 'Server error while fetching trips.' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get a single trip by ID (Owner only)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Check ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this trip.' });
    }

    res.json(trip);
  } catch (err) {
    console.error('Error fetching trip:', err);
    res.status(500).json({ message: 'Server error while fetching trip.' });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update a trip (Owner only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Verify Ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this trip.' });
    }

    const { title, destination, startDate, endDate, description, rating, coverImage, photos } = req.body;

    if (title) trip.title = title;
    if (destination) trip.destination = destination;
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;
    if (description !== undefined) trip.description = description;
    if (rating !== undefined) trip.rating = rating;
    if (coverImage !== undefined) trip.coverImage = coverImage;
    if (photos !== undefined) trip.photos = photos;

    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error('Error updating trip:', err);
    res.status(500).json({ message: 'Server error while updating trip.' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip (Owner only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Verify Ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this trip.' });
    }

    await trip.deleteOne();
    res.json({ message: 'Trip deleted successfully.' });
  } catch (err) {
    console.error('Error deleting trip:', err);
    res.status(500).json({ message: 'Server error while deleting trip.' });
  }
});

// @route   POST /api/trips/:id/upload
// @desc    Upload an image for a trip to Cloudinary
// @access  Private (Owner only)
router.post('/:id/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Verify Ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this trip.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    const imageUrl = req.file.path; // Cloudinary CDN URL

    // Set as cover image if none exists, and add to photos array
    if (!trip.coverImage) {
      trip.coverImage = imageUrl;
    }
    trip.photos.push(imageUrl);

    await trip.save();
    res.status(200).json({ message: 'Photo uploaded successfully to Cloudinary', trip });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server upload error', error: error.message });
  }
});

module.exports = router;