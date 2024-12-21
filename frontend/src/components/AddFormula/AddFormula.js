// frontend/src/components/AddFormula/AddFormula.js
import React, { useState, useEffect } from 'react';
import { addFormula } from '../../services/formulaService';
import { getFeatures } from '../../services/featureService';
import './AddFormula.css';
import axios from '../../services/api'; // Use the Axios instance

const AddFormula = () => {
  const [formula, setFormula] = useState({
    id: '',
    label: '',
    formula: ''
  });

  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await getFeatures();
        setFeatures(response.data);
      } catch (err) {
        console.error('Error fetching features:', err);
      }
    };
    fetchFeatures();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormula(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/formulas/', formula);
      alert('Formula added successfully!');
      setFormula({
        id: '',
        label: '',
        formula: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error adding formula.');
    }
  };

  return (
    <div className="add-formula-container">
      <h2>Add New Formula</h2>
      <form onSubmit={handleSubmit} className="add-formula-form">
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={formula.id}
            onChange={handleChange}
            required
            placeholder="e.g., ideal_weight"
          />
        </div>
        <div>
          <label>Label:</label>
          <input
            type="text"
            name="label"
            value={formula.label}
            onChange={handleChange}
            required
            placeholder="e.g., Ideal Weight (kg)"
          />
        </div>
        <div>
          <label>Formula:</label>
          <input
            type="text"
            name="formula"
            value={formula.formula}
            onChange={handleChange}
            required
            placeholder="e.g., (height - 100) * 0.9"
          />
        </div>
        <p className="formula-hints">
          Use feature IDs in your formula. Available features:
          {features.map(feature => (
            <span key={feature.id}> {feature.id},</span>
          ))}
        </p>
        <button type="submit" className="submit-button">Add Formula</button>
      </form>
    </div>
  );
};

export default AddFormula;