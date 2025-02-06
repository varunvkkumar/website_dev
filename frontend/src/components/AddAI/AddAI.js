import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import './AddAI.css';

const AddAI = () => {
  const [features, setFeatures] = useState([]);
  const [engineeredFeatures, setEngineeredFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [error, setError] = useState('');
  const [transformedData, setTransformedData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const [featuresResponse, engineeredFeaturesResponse] = await Promise.all([
          axios.get('/api/features'),
          axios.get('/api/engineered_features')
        ]);
        setFeatures(featuresResponse.data);
        setEngineeredFeatures(engineeredFeaturesResponse.data);
      } catch (err) {
        console.error('Error fetching features:', err);
        setError('Failed to fetch features');
      }
    };

    fetchFeatures();
  }, []);

  const handleTransform = async () => {
    try {
      const response = await axios.post('http://localhost:5002/transform_with_openai', { feature: selectedFeature, system_prompt: systemPrompt });
      setTransformedData(response.data); // Store the entire response
    } catch (err) {
      console.error('Error transforming data:', err);
      setError('Failed to transform data');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} className="add-ai-container">
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            AI Data
          </Typography>
          {error && <Typography color="error">{error}</Typography>}

          <FormControl fullWidth sx={{ mt: 2 }} className="add-ai-form">
            <InputLabel>Select Feature</InputLabel>
            <Select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
            >
              {features.map((feature) => (
                <MenuItem key={feature.id} value={feature.id}>
                  {feature.label}
                </MenuItem>
              ))}
              {engineeredFeatures.map((feature) => (
                <MenuItem key={feature.id} value={feature.id}>
                  {feature.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="System Prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            className="submit-button"
            onClick={handleTransform}
          >
            Transform
          </Button>

          {loading && (
            <Typography sx={{ mt: 2 }}>Loading...</Typography>
          )}

          {transformedData && (
            <Box mt={2} className="result-area">
              <Typography variant="h6" gutterBottom>
                Transformed Data
              </Typography>
              {transformedData.transformed_data ? (
                <Typography>{transformedData.transformed_data}</Typography>
              ) : (
                <pre>{JSON.stringify(transformedData, null, 2)}</pre>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddAI;
