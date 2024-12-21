// frontend/src/components/AddFormula/AddFormula.js
import React, { useState, useEffect } from 'react';
import axios from '../../services/api'; // Use the Axios instance
import './AddFormula.css';

const AddFormula = () => {
  const [formulaData, setFormulaData] = useState({
    id: '',
    label: '',
    formula: ''
  });

  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/features');
        setFeatures(response.data);
      } catch (err) {
        console.error('Error fetching features:', err);
      }
    };
    fetchFeatures();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/formulas/', formulaData);
      alert('Formula added successfully!');
      setFormulaData({
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
            value={formulaData.id}
            onChange={handleChange}
            required
            placeholder="e.g., bmi"
          />
        </div>
        <div>
          <label>Label:</label>
          <input
            type="text"
            name="label"
            value={formulaData.label}
            onChange={handleChange}
            required
            placeholder="e.g., Body Mass Index"
          />
        </div>
        <div>
          <label>Formula:</label>
          <input
            type="text"
            name="formula"
            value={formulaData.formula}
            onChange={handleChange}
            required
            placeholder="e.g., weight / ((height/100)^2)"
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