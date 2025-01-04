import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './UpdateFeature.css';

const UpdateFeature = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState('');
  const [valuesInput, setValuesInput] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/features');
        setFeatures(response.data);
      } catch (err) {
        console.error('Error fetching features:', err);
        setError('Failed to load features.');
      }
    };
    fetchFeatures();
  }, []);

  const handleFeatureChange = (e) => {
    setSelectedFeatureId(e.target.value);
  };

  const handleValuesChange = (e) => {
    setValuesInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedFeatureId) {
      setError('Please select a feature to update.');
      return;
    }

    if (!valuesInput.trim()) {
      setError('Please enter at least one value.');
      return;
    }

    // Parse values in the format "120|Alice,130|Bob"
    const parsedValues = valuesInput.split(',').map(item => {
      const trimmed = item.trim();
      const [valStr, nameStr] = trimmed.split('|');
      const num = parseFloat(valStr) || 0;
      const valName = (nameStr || '').trim();
      return {
        valueName: valName,
        value: num
      };
    });

    try {
      const response = await axios.post(`/api/features/${selectedFeatureId}/values`, {
        values: parsedValues
      });
      setSuccessMessage('Values added successfully!');
      setValuesInput('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error adding values.');
    }
  };

  return (
    <div className="update-feature-container">
      <h2>Update Feature: Add New Values</h2>
      <form onSubmit={handleSubmit} className="update-feature-form">
        <div>
          <label>Select Feature:</label>
          <select value={selectedFeatureId} onChange={handleFeatureChange} required>
            <option value="">-- Select a Feature --</option>
            {features.map(feature => (
              <option key={feature.id} value={feature.id}>
                {feature.label} ({feature.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>New Values (comma separated, value|name):</label>
          <input
            type="text"
            name="values"
            placeholder="e.g., 120|Alice, 130|Bob"
            value={valuesInput}
            onChange={handleValuesChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button">
          Add Values
        </button>
      </form>
      <button onClick={() => navigate('/health-calculator')} className="back-button">Back</button>
    </div>
  );
};

export default UpdateFeature;