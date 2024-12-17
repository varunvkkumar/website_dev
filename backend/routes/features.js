const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../authMiddleware');

// Path to features.json
const FEATURES_FILE = path.join(__dirname, '../data/features.json');

// Helper function to read features from the file
const readFeatures = () => {
  if (!fs.existsSync(FEATURES_FILE)) {
    fs.writeFileSync(FEATURES_FILE, JSON.stringify([]), 'utf8');
  }
  const data = fs.readFileSync(FEATURES_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write features to the file
const writeFeatures = (features) => {
  fs.writeFileSync(FEATURES_FILE, JSON.stringify(features, null, 2), 'utf8');
};

// Get all features
router.get('/', authMiddleware, (req, res) => {
  const features = readFeatures();
  res.json(features);
});

// Add a new feature
router.post('/', authMiddleware, (req, res) => {
  const { id, label, type, options, value } = req.body;

  // Validate required fields
  if (!id || !label || !type) {
    return res.status(400).json({ message: 'ID, label, and type are required.' });
  }

  const features = readFeatures();

  // Check if feature with the same ID already exists
  if (features.find(f => f.id === id)) {
    return res.status(400).json({ message: 'Feature with this ID already exists.' });
  }

  // Add new feature
  const newFeature = {
    id,
    label,
    type,
    options: options || [],
    value: value || null
  };

  features.push(newFeature);
  writeFeatures(features); // Save to file

  res.status(201).json(newFeature);
});

// Update an existing feature
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { label, type, options, value } = req.body;

  const features = readFeatures();
  const featureIndex = features.findIndex(f => f.id === id);

  if (featureIndex === -1) {
    return res.status(404).json({ message: 'Feature not found.' });
  }

  // Update feature
  features[featureIndex] = {
    ...features[featureIndex],
    label: label || features[featureIndex].label,
    type: type || features[featureIndex].type,
    options: options !== undefined ? options : features[featureIndex].options,
    value: value !== undefined ? value : features[featureIndex].value
  };

  writeFeatures(features); // Save to file
  res.json(features[featureIndex]);
});

// Delete a feature
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  const features = readFeatures();
  const featureIndex = features.findIndex(f => f.id === id);

  if (featureIndex === -1) {
    return res.status(404).json({ message: 'Feature not found.' });
  }

  const deletedFeature = features.splice(featureIndex, 1);
  writeFeatures(features); // Save to file

  res.json({ message: 'Feature deleted successfully.', feature: deletedFeature[0] });
});

module.exports = router;
