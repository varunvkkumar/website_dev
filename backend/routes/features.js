// backend/routes/features.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Mock database
let features = [];

// Add a new feature
router.post('/', verifyToken, (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Feature name is required' });
  }
  const newFeature = { id: features.length + 1, name };
  features.push(newFeature);
  res.status(201).json(newFeature);
});

module.exports = router;