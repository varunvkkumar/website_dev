// backend/routes/formulas.js
const express = require('express');
const router = express.Router();
const formulaController = require('../controllers/formulaController');
const authMiddleware = require('../authMiddleware');

// Public route to get all formulas
router.get('/', formulaController.getAllFormulas);

// Protected routes
router.post('/', authMiddleware, formulaController.addFormula);
router.put('/:id', authMiddleware, formulaController.updateFormula);
router.delete('/:id', authMiddleware, formulaController.deleteFormula);

module.exports = router;