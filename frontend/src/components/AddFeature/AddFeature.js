// frontend/src/components/AddFeature/AddFeature.js
import React, { useState } from 'react';
import { addFeature } from '../../services/featureService';
import './AddFeature.css';
import axios from '../../services/api'; // Use the Axios instance

const AddFeature = () => {
  const [feature, setFeature] = useState({
    id: '',
    label: '',
    type: 'number',
    options: '',
    value: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeature(prev => ({
      ...prev,
      [name]: name === 'options' ? value : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedFeature = {
      ...feature,
      options: feature.type === 'select' ? feature.options.split(',').map(opt => opt.trim()) : []
    };
    try {
      await axios.post('/api/features/', formattedFeature);
      alert('Feature added successfully!');
      setFeature({
        id: '',
        label: '',
        type: 'number',
        options: '',
        value: 0
      });
    } catch (err) {
      console.error(err);
      alert('Error adding feature.');
    }
  };

  return (
    <div className="add-feature-container">
      <h2>Add New Feature</h2>
      <form onSubmit={handleSubmit} className="add-feature-form">
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={feature.id}
            onChange={handleChange}
            required
            placeholder="e.g., blood_pressure"
          />
        </div>
        <div>
          <label>Label:</label>
          <input
            type="text"
            name="label"
            value={feature.label}
            onChange={handleChange}
            required
            placeholder="e.g., Blood Pressure (mmHg)"
          />
        </div>
        <div>
          <label>Type:</label>
          <select name="type" value={feature.type} onChange={handleChange}>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="text">Text</option>
          </select>
        </div>
        {feature.type === 'select' && (
          <div>
            <label>Options (comma separated):</label>
            <input
              type="text"
              name="options"
              value={feature.options}
              onChange={handleChange}
              required
              placeholder="e.g., Low, Normal, High"
            />
          </div>
        )}
        <div>
          <label>Default Value:</label>
          {feature.type === 'select' ? (
            <input
              type="text"
              name="value"
              value={feature.value}
              onChange={handleChange}
              required
              placeholder="e.g., Normal"
            />
          ) : (
            <input
              type="number"
              name="value"
              value={feature.value}
              onChange={handleChange}
              required
              placeholder="e.g., 120"
            />
          )}
        </div>
        <button type="submit" className="submit-button">Add Feature</button>
      </form>
    </div>
  );
};

export default AddFeature;