const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const protect = require('../middleware/authMiddleware');

// @route   GET /api/users/:username/profile
// @desc    Get public profile and user's public trips (NO AUTH REQUIRED)
// @access  Public
router.get('/:username/profile', async (req, res) => {
  try {
    const searchParam = req.params.username.toLowerCase();

    // 1. Try exact username match
    let user = await User.findOne({ username: searchParam })
      .select('name username bio createdAt');

    // 2. Fallback: try matching name case-insensitively if username not found
    if (!user) {
      user = await User.findOne({ name: new RegExp('^' + req.params.username + '$', 'i') })
        .select('name username bio createdAt');
    }

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Fetch all trips belonging to this user (safe public fields)
    const trips = await Trip.find({ user: user._id })
      .select('title destination startDate endDate rating coverImage photos description createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ user, trips });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update logged-in user's bio or username
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, username } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) {
      const lowerUsername = username.toLowerCase().trim();
      // Check if username is taken by another user
      const existing = await User.findOne({ username: lowerUsername, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = lowerUsername;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

module.exports = router;