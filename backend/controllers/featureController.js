// backend/controllers/featureController.js
const fs = require('fs');
const path = require('path');

// Path to features.json
const featuresPath = path.join(__dirname, '..', 'data', 'features.json');

// Get all features
exports.getAllFeatures = (req, res) => {
  fs.readFile(featuresPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading features data.' });
    }
    res.json(JSON.parse(data));
  });
};

// Add a new feature
exports.addFeature = (req, res) => {
  const newFeature = req.body;

  fs.readFile(featuresPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading features data.' });
    }

    const features = JSON.parse(data);
    features.push(newFeature);

    fs.writeFile(featuresPath, JSON.stringify(features, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving new feature.' });
      }
      res.status(201).json({ message: 'Feature added successfully.' });
    });
  });
};

// Update a feature
exports.updateFeature = (req, res) => {
  const { id } = req.params;
  const updatedFeature = req.body;

  fs.readFile(featuresPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading features data.' });
    }

    let features = JSON.parse(data);
    const featureIndex = features.findIndex((f) => f.id === id);

    if (featureIndex === -1) {
      return res.status(404).json({ message: 'Feature not found.' });
    }

    features[featureIndex] = updatedFeature;

    fs.writeFile(featuresPath, JSON.stringify(features, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating feature.' });
      }
      res.json({ message: 'Feature updated successfully.' });
    });
  });
};

// Delete a feature
exports.deleteFeature = (req, res) => {
  const { id } = req.params;

  fs.readFile(featuresPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading features data.' });
    }

    let features = JSON.parse(data);
    features = features.filter((f) => f.id !== id);

    fs.writeFile(featuresPath, JSON.stringify(features, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting feature.' });
      }
      res.json({ message: 'Feature deleted successfully.' });
    });
  });
};