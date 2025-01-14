const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Adjust the path as needed if your data directory is elsewhere
const ENGINEERED_FEATURES_FILE = path.join(__dirname, '../data/engineered_features.json');

function readEngineeredFeatures() {
  if (!fs.existsSync(ENGINEERED_FEATURES_FILE)) {
    fs.writeFileSync(ENGINEERED_FEATURES_FILE, JSON.stringify([]), 'utf8');
  }
  const data = fs.readFileSync(ENGINEERED_FEATURES_FILE, 'utf8');
  return JSON.parse(data);
}

// Optional: add authMiddleware if you want to protect this endpoint
// const authMiddleware = require('../authMiddleware');
// router.get('/', authMiddleware, (req, res) => {

router.get('/', (req, res) => {
  try {
    const engineeredFeatures = readEngineeredFeatures();
    res.json(engineeredFeatures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error reading engineered features.' });
  }
});

module.exports = router;
