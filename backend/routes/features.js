const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../authMiddleware');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4

// Path to features.json
const FEATURES_FILE = path.join(__dirname, '../data/features.json');

// Helper function to read features
function readFeatures() {
  if (!fs.existsSync(FEATURES_FILE)) {
    fs.writeFileSync(FEATURES_FILE, JSON.stringify([]), 'utf8');
  }
  const data = fs.readFileSync(FEATURES_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write features
function writeFeatures(features) {
  fs.writeFileSync(FEATURES_FILE, JSON.stringify(features, null, 2), 'utf8');
}

// Get all features
router.get('/', authMiddleware, (req, res) => {
  const features = readFeatures();
  res.json(features);
});

// Add a new feature
router.post('/', authMiddleware, (req, res) => {
  const { id, label, type, options, values } = req.body;
  if (!id || !label || !type) {
    return res.status(400).json({ message: 'ID, label, and type are required.' });
  }
  const features = readFeatures();
  if (features.find(f => f.id === id)) {
    return res.status(400).json({ message: 'Feature with this ID already exists.' });
  }
  const newFeature = {
    id,
    label,
    type,
    options: Array.isArray(options) ? options : [],
    values: Array.isArray(values) ? values : []
  };
  features.push(newFeature);
  writeFeatures(features);
  res.status(201).json(newFeature);
});

// Update a feature
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { label, type, options, values } = req.body;
  const features = readFeatures();
  const featureIndex = features.findIndex(f => f.id === id);
  if (featureIndex === -1) {
    return res.status(404).json({ message: 'Feature not found.' });
  }
  features[featureIndex] = {
    ...features[featureIndex],
    label: label || features[featureIndex].label,
    type: type || features[featureIndex].type,
    options: Array.isArray(options) ? options : features[featureIndex].options,
    values: Array.isArray(values) ? values : features[featureIndex].values
  };
  writeFeatures(features);
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
  writeFeatures(features);
  res.json({ message: 'Feature deleted successfully.', feature: deletedFeature[0] });
});

// **New Route:** Add Values to an Existing Feature
router.post('/:id/values', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { values } = req.body; // Expecting an array of { valueName, value }

  if (!values || !Array.isArray(values)) {
    return res.status(400).json({ message: 'Values must be an array of { valueName, value } objects.' });
  }

  const features = readFeatures();
  const feature = features.find(f => f.id === id);
  if (!feature) {
    return res.status(404).json({ message: 'Feature not found.' });
  }

  // Validate and parse new values
  const newValues = values.map(item => {
    const { valueName, value } = item;
    if (typeof value !== 'number') {
      throw new Error('Value must be a number.');
    }
    return {
      valueId: uuidv4(),
      valueName: valueName || '',
      value
    };
  });

  // Append new values to the existing values array
  feature.values = [...feature.values, ...newValues];
  writeFeatures(features);
  res.status(200).json({ message: 'Values added successfully.', feature });
});

module.exports = router;
