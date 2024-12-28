const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../authMiddleware');
const { evaluate } = require('mathjs');

// Path to formulas.json
const FORMULAS_FILE = path.join(__dirname, '../data/formulas.json');

// Path to features.json (for validation)
const FEATURES_FILE = path.join(__dirname, '../data/features.json');

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

// Helper function to read features from the file
const readFeatures = () => {
  if (!fs.existsSync(FEATURES_FILE)) {
    fs.writeFileSync(FEATURES_FILE, JSON.stringify([]), 'utf8');
  }
  const data = fs.readFileSync(FEATURES_FILE, 'utf8');
  return JSON.parse(data);
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

  // Check for duplicate ID
  if (formulas.find(f => f.id === id)) {
    return res.status(400).json({ message: 'Formula with this ID already exists.' });
  }

  // Validate that the formula references existing feature IDs
  const features = readFeatures();
  const featureIds = features.map(feature => feature.id);
  const variables = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  const uniqueVariables = [...new Set(variables)];
  const invalidVariables = uniqueVariables.filter(v => !featureIds.includes(v));

  if (invalidVariables.length > 0) {
    return res.status(400).json({ message: `Invalid variables in formula: ${invalidVariables.join(', ')}` });
  }

  // Validate formula syntax
  try {
    // Dummy evaluation to check syntax
    const dummyVars = {};
    uniqueVariables.forEach(v => { dummyVars[v] = 1; });
    evaluate(formula, dummyVars);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid formula syntax.' });
  }

  const newFormula = {
    id,
    label,
    formula
  };

  formulas.push(newFormula);
  writeFormulas(formulas);
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

  // Validate formula if it's being updated
  if (formula) {
    const features = readFeatures();
    const featureIds = features.map(feature => feature.id);
    const variables = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const uniqueVariables = [...new Set(variables)];
    const invalidVariables = uniqueVariables.filter(v => !featureIds.includes(v));

    if (invalidVariables.length > 0) {
      return res.status(400).json({ message: `Invalid variables in formula: ${invalidVariables.join(', ')}` });
    }

    try {
      const dummyVars = {};
      uniqueVariables.forEach(v => { dummyVars[v] = 1; });
      evaluate(formula, dummyVars);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid formula syntax.' });
    }

    formulas[formulaIndex].formula = formula;
  }

  if (label) {
    formulas[formulaIndex].label = label;
  }

  writeFormulas(formulas);
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
  writeFormulas(formulas);

  res.json({ message: 'Formula deleted successfully.', formula: deletedFormula[0] });
});

module.exports = router;