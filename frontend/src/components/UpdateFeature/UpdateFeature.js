import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './UpdateFeature.css';

const UpdateFeature = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  // valuesMap: { [featureId]: string }
  const [valuesMap, setValuesMap] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch features on mount
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/features');
        setFeatures(response.data);
        // Initialize valuesMap with an empty string for each feature
        const initialValues = {};
        response.data.forEach(feature => {
          initialValues[feature.id] = '';
        });
        setValuesMap(initialValues);
      } catch (err) {
        console.error('Error fetching features:', err);
        setError('Failed to load features.');
      }
    };
    fetchFeatures();
  }, []);

  // Handle input changes for each feature
  const handleInputChange = (featureId, value) => {
    setValuesMap(prev => ({
      ...prev,
      [featureId]: value,
    }));
  };

  // Parse a values input string in the format "120|Alice, 130|Bob"
  const parseValues = (inputStr) => {
    if (!inputStr.trim()) return [];
    return inputStr.split(',').map(item => {
      const trimmed = item.trim();
      const [valStr, nameStr] = trimmed.split('|');
      const num = parseFloat(valStr) || 0;
      const valName = (nameStr || '').trim();
      return { valueName: valName, value: num };
    });
  };

  // Submit updates for all features with a non-empty values input
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Create an array of promises for each feature update where input exists
    const updatePromises = features.map(feature => {
      const inputStr = valuesMap[feature.id];
      if (inputStr && inputStr.trim()) {
        const parsedValues = parseValues(inputStr);
        return axios.post(`/api/features/${feature.id}/values`, {
          values: parsedValues,
        });
      }
      // If no value provided for this feature, skip (resolve immediately)
      return Promise.resolve();
    });

    try {
      await Promise.all(updatePromises);
      setSuccessMessage('Values added successfully for applicable features!');
      // Clear the inputs after success
      const clearedValues = {};
      features.forEach(feature => {
        clearedValues[feature.id] = '';
      });
      setValuesMap(clearedValues);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error adding values to features.');
    }
  };

  return (
    <div className="update-feature-container">
      <h2>Input Data Form</h2>
      <form onSubmit={handleSubmit} className="update-feature-form">
        {features.length > 0 ? (
          features.map(feature => (
            <div key={feature.id}>
              <label>
                {feature.label} ({feature.id})
              </label>
              <input
                type="text"
                placeholder="e.g., 120|Alice, 130|Bob"
                value={valuesMap[feature.id] || ''}
                onChange={(e) => handleInputChange(feature.id, e.target.value)}
              />
            </div>
          ))
        ) : (
          <p>No features available.</p>
        )}
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <button onClick={() => navigate('/AI-transformation-hub')} className="back-button">
        Back
      </button>
    </div>
  );
};

export default UpdateFeature;
