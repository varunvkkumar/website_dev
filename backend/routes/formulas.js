// backend/routes/formulas.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../authMiddleware');

// Path to formulas.json
const FORMULAS_FILE = path.join(__dirname, '../data/formulas.json');

// Helper function to read formulas from the file
const readFormulas = () => {
  if (!fs.existsSync(FORMULAS_FILE)) {
    fs.writeFileSync(FORMULAS_FILE, JSON.stringify([]), 'utf8');
  }
  const data = fs.readFileSync(FORMULAS_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write formulas to the file
const writeFormulas = (formulas) => {
  fs.writeFileSync(FORMULAS_FILE, JSON.stringify(formulas, null, 2), 'utf8');
};

// Get all formulas
router.get('/', authMiddleware, (req, res) => {
  const formulas = readFormulas();
  res.json(formulas);
});

// Add a new formula
router.post('/', authMiddleware, (req, res) => {
  const { id, label, formula } = req.body;

  // Validate required fields
  if (!id || !label || !formula) {
    return res.status(400).json({ message: 'ID, label, and formula are required.' });
  }

  const formulas = readFormulas();

  // Check if formula with the same ID already exists
  if (formulas.find(f => f.id === id)) {
    return res.status(400).json({ message: 'Formula with this ID already exists.' });
  }

  // Add new formula
  const newFormula = {
    id,
    label,
    formula
  };

  formulas.push(newFormula);
  writeFormulas(formulas); // Save to file

  res.status(201).json(newFormula);
});

// Update an existing formula
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { label, formula } = req.body;

  const formulas = readFormulas();
  const formulaIndex = formulas.findIndex(f => f.id === id);

  if (formulaIndex === -1) {
    return res.status(404).json({ message: 'Formula not found.' });
  }

  // Update formula
  formulas[formulaIndex] = {
    ...formulas[formulaIndex],
    label: label || formulas[formulaIndex].label,
    formula: formula || formulas[formulaIndex].formula
  };

  writeFormulas(formulas); // Save to file
  res.json(formulas[formulaIndex]);
});

// Delete a formula
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  const formulas = readFormulas();
  const formulaIndex = formulas.findIndex(f => f.id === id);

  if (formulaIndex === -1) {
    return res.status(404).json({ message: 'Formula not found.' });
  }

  const deletedFormula = formulas.splice(formulaIndex, 1);
  writeFormulas(formulas); // Save to file

  res.json({ message: 'Formula deleted successfully.', formula: deletedFormula[0] });
});

module.exports = router;