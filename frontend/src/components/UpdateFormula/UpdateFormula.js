import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './UpdateFormula.css';

const UpdateFormula = () => {
  const navigate = useNavigate();
  const [formulas, setFormulas] = useState([]);
  const [selectedFormulaId, setSelectedFormulaId] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [formulaInput, setFormulaInput] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const response = await axios.get('/api/formulas');
        setFormulas(response.data);
      } catch (err) {
        console.error('Error fetching formulas:', err);
        setError('Failed to load formulas.');
      }
    };
    fetchFormulas();
  }, []);

  const handleFormulaChange = (e) => {
    const selectedId = e.target.value;
    setSelectedFormulaId(selectedId);
    const selectedFormula = formulas.find(f => f.id === selectedId);
    if (selectedFormula) {
      setLabelInput(selectedFormula.label);
      setFormulaInput(selectedFormula.formula);
    }
  };

  const handleLabelChange = (e) => {
    setLabelInput(e.target.value);
  };

  const handleFormulaInputChange = (e) => {
    setFormulaInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedFormulaId) {
      setError('Please select a formula to update.');
      return;
    }

    if (!labelInput.trim() || !formulaInput.trim()) {
      setError('Please enter both label and formula.');
      return;
    }

    try {
      await axios.put(`/api/formulas/${selectedFormulaId}`, {
        label: labelInput,
        formula: formulaInput
      });
      setSuccessMessage('Formula updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error updating formula.');
    }
  };

  return (
    <div className="update-formula-container">
      <h2>Update Formula</h2>
      <form onSubmit={handleSubmit} className="update-formula-form">
        <div>
          <label>Select Formula:</label>
          <select value={selectedFormulaId} onChange={handleFormulaChange} required>
            <option value="">-- Select a Formula --</option>
            {formulas.map(formula => (
              <option key={formula.id} value={formula.id}>
                {formula.label} ({formula.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Label:</label>
          <input
            type="text"
            name="label"
            value={labelInput}
            onChange={handleLabelChange}
            required
          />
        </div>
        <div>
          <label>Formula:</label>
          <input
            type="text"
            name="formula"
            value={formulaInput}
            onChange={handleFormulaInputChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button">
          Update Formula
        </button>
      </form>
      <button onClick={() => navigate('/AI-transformation-hub')} className="back-button">Back</button>
    </div>
  );
};

export default UpdateFormula;