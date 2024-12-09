// backend/controllers/formulaController.js
const fs = require('fs');
const path = require('path');

// Path to formulas.json
const formulasPath = path.join(__dirname, '..', 'data', 'formulas.json');

// Get all formulas
exports.getAllFormulas = (req, res) => {
  fs.readFile(formulasPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading formulas data.' });
    }
    res.json(JSON.parse(data));
  });
};

// Add a new formula
exports.addFormula = (req, res) => {
  const newFormula = req.body;

  fs.readFile(formulasPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading formulas data.' });
    }

    const formulas = JSON.parse(data);
    formulas.push(newFormula);

    fs.writeFile(formulasPath, JSON.stringify(formulas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving new formula.' });
      }
      res.status(201).json({ message: 'Formula added successfully.' });
    });
  });
};

// Update a formula
exports.updateFormula = (req, res) => {
  const { id } = req.params;
  const updatedFormula = req.body;

  fs.readFile(formulasPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading formulas data.' });
    }

    let formulas = JSON.parse(data);
    const formulaIndex = formulas.findIndex((f) => f.id === id);

    if (formulaIndex === -1) {
      return res.status(404).json({ message: 'Formula not found.' });
    }

    formulas[formulaIndex] = updatedFormula;

    fs.writeFile(formulasPath, JSON.stringify(formulas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating formula.' });
      }
      res.json({ message: 'Formula updated successfully.' });
    });
  });
};

// Delete a formula
exports.deleteFormula = (req, res) => {
  const { id } = req.params;

  fs.readFile(formulasPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading formulas data.' });
    }

    let formulas = JSON.parse(data);
    formulas = formulas.filter((f) => f.id !== id);

    fs.writeFile(formulasPath, JSON.stringify(formulas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting formula.' });
      }
      res.json({ message: 'Formula deleted successfully.' });
    });
  });
};