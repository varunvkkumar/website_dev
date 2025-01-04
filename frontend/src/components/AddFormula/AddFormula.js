import React, { useState, useEffect } from 'react';
import axios from '../../services/api'; // Ensure this points to your Axios instance
import { useNavigate } from 'react-router-dom';
import './AddFormula.css';
import { v4 as uuidv4 } from 'uuid';
import { evaluate } from 'mathjs';

const AddFormula = () => {
  const navigate = useNavigate();
  const [formulaData, setFormulaData] = useState({
    id: '',
    label: '',
    formula: ''
  });

  const [features, setFeatures] = useState([]);
  const [error, setError] = useState('');

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

    // Validate that the formula references existing feature IDs
    const variables = formulaData.formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    const uniqueVariables = [...new Set(variables)];
    const featureIds = features.map(feature => feature.id);
    const invalidVariables = uniqueVariables.filter(v => !featureIds.includes(v));

    if (invalidVariables.length > 0) {
      setError(`Invalid variables in formula: ${invalidVariables.join(', ')}`);
      return;
    }

    // Validate formula syntax
    try {
      const dummyVars = {};
      uniqueVariables.forEach(v => { dummyVars[v] = 1; });
      evaluate(formulaData.formula, dummyVars);
    } catch (err) {
      setError('Invalid formula syntax.');
      return;
    }

    try {
      await axios.post('/api/formulas/', formulaData);
      alert('Formula added successfully!');
      setFormulaData({
        id: '',
        label: '',
        formula: ''
      });
      setError('');
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">Add Formula</button>
      </form>
      <button onClick={() => navigate('/health-calculator')} className="back-button">Back</button>
    </div>
  );
};

export default AddFormula;