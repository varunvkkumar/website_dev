// frontend/src/components/HealthCalculator/AddFormulaForm.js

import React, { useState, useEffect } from 'react';
import { create, all } from 'mathjs';
const math = create(all);

const AddFormulaForm = ({
  addFormula,
  updateFormula,
  onClose,
  existingFormulas,
  availableInputs,
  editingFormula,
}) => {
  const [formulaData, setFormulaData] = useState({
    id: '',
    label: '',
    formula: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingFormula) {
      setFormulaData(editingFormula);
    }
  }, [editingFormula]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for unique ID if adding a new formula
    if (
      !editingFormula &&
      existingFormulas.some((formula) => formula.id === formulaData.id)
    ) {
      setError('Formula ID must be unique.');
      return;
    }

    // Validate the formula using math.js
    try {
      const scope = {};
      availableInputs.forEach((input) => {
        scope[input.id] = 1; // Assign dummy values for testing
      });
      math.evaluate(formulaData.formula, scope);

      if (editingFormula) {
        updateFormula(formulaData);
      } else {
        addFormula(formulaData);
      }

      onClose();
    } catch (err) {
      setError('Invalid formula. Please check syntax and input IDs.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editingFormula ? 'Edit Formula' : 'Add New Formula'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              className="form-control"
              value={formulaData.id}
              onChange={(e) => setFormulaData({ ...formulaData, id: e.target.value })}
              required
              disabled={!!editingFormula}
            />
          </div>
          <div className="form-group">
            <label>Label:</label>
            <input
              type="text"
              className="form-control"
              value={formulaData.label}
              onChange={(e) => setFormulaData({ ...formulaData, label: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Formula:</label>
            <input
              type="text"
              className="form-control"
              value={formulaData.formula}
              onChange={(e) => setFormulaData({ ...formulaData, formula: e.target.value })}
              required
            />
            <small className="form-text text-muted">
              Use input IDs in your formula. Available inputs:{' '}
              {availableInputs.map((input) => input.id).join(', ')}
            </small>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-success">
            {editingFormula ? 'Update Formula' : 'Add Formula'}
          </button>
          <button type="button" className="btn btn-secondary ml-2" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFormulaForm;