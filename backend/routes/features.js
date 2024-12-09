// backend/routes/features.js
const express = require('express');
const router = express.Router();
const featureController = require('../controllers/featureController');
const authMiddleware = require('../authMiddleware');

// Public route to get all features
router.get('/', featureController.getAllFeatures);

// Protected routes
router.post('/', authMiddleware, featureController.addFeature);
router.put('/:id', authMiddleware, featureController.updateFeature);
router.delete('/:id', authMiddleware, featureController.deleteFeature);

module.exports = router;