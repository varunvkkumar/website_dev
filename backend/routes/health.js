const express = require('express');
const router = express.Router();
const HealthProfile = require('../models/HealthProfile');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// Simple middleware to authenticate mock users
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  // Handle mock authentication tokens
  if (token.startsWith('mock-token-') || token.startsWith('mock-google-token-')) {
    // Extract user info from mock token
    const timestamp = token.split('-').pop();
    req.user = {
      uid: `mock-user-${timestamp}`,
      email: token.includes('google') ? 'user@gmail.com' : 'mock@example.com',
      displayName: token.includes('google') ? 'Google User' : 'Mock User'
    };
    next();
    return;
  }
  
  // Handle real JWT tokens (if any)
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/health/profile - Get user's health profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.uid })
      .sort({ createdAt: -1 }); // Get the most recent profile
    
    if (!profile) {
      return res.status(404).json({ error: 'Health profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching health profile:', error);
    res.status(500).json({ error: 'Failed to fetch health profile' });
  }
});

// GET /api/health/profiles - Get all user's health profiles (history)
router.get('/profiles', authenticateUser, async (req, res) => {
  try {
    const profiles = await HealthProfile.find({ userId: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(10); // Limit to last 10 profiles
    
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching health profiles:', error);
    res.status(500).json({ error: 'Failed to fetch health profiles' });
  }
});

// POST /api/health/profile - Save/Create health profile
router.post('/profile', authenticateUser, async (req, res) => {
  try {
    const {
      basicInfo,
      nutrition,
      workout,
      results,
      plans
    } = req.body;

    // Validate required fields
    if (!basicInfo || !nutrition || !workout || !results || !plans) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new health profile
    const healthProfile = new HealthProfile({
      userId: req.user.uid,
      userEmail: req.user.email,
      basicInfo,
      nutrition,
      workout,
      results,
      plans
    });

    const savedProfile = await healthProfile.save();
    
    res.status(201).json({
      message: 'Health profile saved successfully',
      profile: savedProfile
    });
  } catch (error) {
    console.error('Error saving health profile:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ error: 'Failed to save health profile' });
  }
});

// PUT /api/health/profile/:id - Update health profile
router.put('/profile/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      basicInfo,
      nutrition,
      workout,
      results,
      plans
    } = req.body;

    // Find and update the profile
    const updatedProfile = await HealthProfile.findOneAndUpdate(
      { _id: id, userId: req.user.uid }, // Ensure user owns this profile
      {
        basicInfo,
        nutrition,
        workout,
        results,
        plans
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Health profile not found' });
    }

    res.json({
      message: 'Health profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating health profile:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.message 
      });
    }
    
    res.status(500).json({ error: 'Failed to update health profile' });
  }
});

// DELETE /api/health/profile/:id - Delete health profile
router.delete('/profile/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProfile = await HealthProfile.findOneAndDelete({
      _id: id,
      userId: req.user.uid
    });

    if (!deletedProfile) {
      return res.status(404).json({ error: 'Health profile not found' });
    }

    res.json({ message: 'Health profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting health profile:', error);
    res.status(500).json({ error: 'Failed to delete health profile' });
  }
});

// GET /api/health/stats - Get user's health statistics
router.get('/stats', authenticateUser, async (req, res) => {
  try {
    const profiles = await HealthProfile.find({ userId: req.user.uid })
      .sort({ createdAt: -1 });
    
    if (profiles.length === 0) {
      return res.status(404).json({ error: 'No health profiles found' });
    }

    const latest = profiles[0];
    const stats = {
      totalProfiles: profiles.length,
      latestProfile: latest,
      progressData: profiles.slice(0, 5).map(profile => ({
        date: profile.createdAt,
        weight: profile.basicInfo.weight,
        bmi: profile.results.bmi,
        dailyCalories: profile.results.dailyCalories
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching health stats:', error);
    res.status(500).json({ error: 'Failed to fetch health stats' });
  }
});

module.exports = router; 