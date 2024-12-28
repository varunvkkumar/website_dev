import React, { useState } from 'react';
import axios from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import './AddFeature.css';

const AddFeature = () => {
  const [feature, setFeature] = useState({
    id: '',
    label: '',
    type: 'number',
    options: '',
    values: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeature(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format: "120|Alice, 130|Bob"
    const parsedValues = feature.values.split(',').map(item => {
      const trimmed = item.trim();
      const [valStr, nameStr] = trimmed.split('|');
      const num = parseFloat(valStr) || 0;
      const valName = (nameStr || '').trim();
      return {
        valueId: uuidv4(),
        valueName: valName,
        value: num
      };
    });

    const formattedFeature = {
      id: feature.id,
      label: feature.label,
      type: feature.type,
      options:
        feature.type === 'select'
          ? feature.options.split(',').map(opt => opt.trim())
          : [],
      values: parsedValues
    };

    try {
      await axios.post('/api/features/', formattedFeature);
      alert('Feature added successfully!');
      setFeature({
        id: '',
        label: '',
        type: 'number',
        options: '',
        values: ''
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
            placeholder="e.g., blood_pressure"
            value={feature.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Label:</label>
          <input
            type="text"
            name="label"
            placeholder="e.g., Blood Pressure (mmHg)"
            value={feature.label}
            onChange={handleChange}
            required
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
              placeholder="e.g., Low, Normal, High"
              value={feature.options}
              onChange={handleChange}
            />
          </div>
        )}
        <div>
          <label>Values (value|name comma separated):</label>
          <input
            type="text"
            name="values"
            placeholder="120|Alice, 130|Bob"
            value={feature.values}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">
          Add Feature
        </button>
      </form>
    </div>
  );
};

export default AddFeature;