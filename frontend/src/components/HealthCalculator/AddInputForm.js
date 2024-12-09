// frontend/src/components/HealthCalculator/AddInputForm.js

import React, { useState, useEffect } from 'react';

const AddInputForm = ({
  addInput,
  updateInput,
  onClose,
  existingInputs,
  editingInput,
}) => {
  const [inputData, setInputData] = useState({
    id: '',
    label: '',
    type: 'number',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingInput) {
      setInputData(editingInput);
    }
  }, [editingInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for unique ID
    if (
      !editingInput &&
      existingInputs.some((input) => input.id === inputData.id)
    ) {
      setError('Input ID must be unique.');
      return;
    }
    if (editingInput) {
      updateInput(inputData);
    } else {
      addInput(inputData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editingInput ? 'Edit Input' : 'Add New Input'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              className="form-control"
              value={inputData.id}
              onChange={(e) =>
                setInputData({ ...inputData, id: e.target.value })
              }
              required
              disabled={!!editingInput}
            />
          </div>
          <div className="form-group">
            <label>Label:</label>
            <input
              type="text"
              className="form-control"
              value={inputData.label}
              onChange={(e) =>
                setInputData({ ...inputData, label: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select
              className="form-control"
              value={inputData.type}
              onChange={(e) =>
                setInputData({ ...inputData, type: e.target.value })
              }
            >
              <option value="number">Number</option>
              <option value="text">Text</option>
              {/* Add more types if needed */}
            </select>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-success">
            {editingInput ? 'Update Input' : 'Add Input'}
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInputForm;