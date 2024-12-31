import React, { useState, useEffect, useContext } from 'react';
import axios from '../../services/api'; // Use the Axios instance
import { AuthContext } from '../../contexts/AuthContext';
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

function HealthCalculator() {
  const { authTokens } = useContext(AuthContext);
  const [inputs, setInputs] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!authTokens) {
        setLoading(false);
        return;
      }
      try {
        const [inputsResponse, formulasResponse] = await Promise.all([
          axios.get('/api/features', {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }),
          axios.get('/api/formulas', {
            headers: { Authorization: `Bearer ${authTokens.access}` },
          }),
        ]);
        setInputs(inputsResponse.data);
        setFormulas(formulasResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authTokens]);

  const calculateResults = async () => {
    try {
      const response = await axios.post('http://localhost:5002/calculate_features', {
        features: inputs,
        formulas: formulas
      });
      setResults(response.data);
      setError(''); // Clear any previous error
    } catch (err) {
      console.error('Error calculating results:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Set the error message from the response
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3}>
        <Grid container spacing={2}>

          {/* Left column: Actions */}
          <Grid item xs={12} sm={2} md={2}>
            <Box p={2}>
              <Button
                component={Link}
                to="/add-feature"
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              >
                Add Feature
              </Button>
              <Button
                component={Link}
                to="/add-formula"
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              >
                Add Formula
              </Button>
              <Button
                component={Link}
                to="/update-feature"
                fullWidth
                variant="contained"
                color="secondary"
                size="small"
              >
                Update Feature
              </Button>
            </Box>
          </Grid>

          {/* Middle column: Display Inputs and Formulas */}
          <Grid item xs={12} sm={5} md={5}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Added Inputs and Formulas
              </Typography>

              {/* Inputs List */}
              <Typography variant="subtitle1">Inputs:</Typography>
              {inputs.length ? (
                <List dense>
                  {inputs.map((input) => (
                    <ListItem key={input.id}>
                      <ListItemText
                        primary={`${input.label} (${input.id})`}
                        secondary={
                          Array.isArray(input.values)
                            ? input.values.map(v => {
                                const nm = v.valueName ? ` | ${v.valueName}` : '';
                                return `${v.value}${nm}`;
                              }).join(', ')
                            : 'No values'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No inputs added yet.</Typography>
              )}

              {/* Formulas List */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Formulas:
              </Typography>
              {formulas.length ? (
                <List dense>
                  {formulas.map((f) => (
                    <ListItem key={f.id}>
                      <ListItemText primary={f.label} secondary={f.formula} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No formulas added yet.</Typography>
              )}

              {/* Calculate button */}
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  size="medium"
                  onClick={calculateResults}
                >
                  Calculate
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right column: Results table */}
          <Grid item xs={12} sm={5} md={5}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {Object.keys(results).length ? (
                Object.entries(results).map(([formulaLabel, featuresMap]) => (
                  <Box key={formulaLabel} mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                      Formula: {formulaLabel}
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Feature</TableCell>
                            <TableCell>Value ID</TableCell>
                            <TableCell>Value Name</TableCell>
                            <TableCell>Result</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(featuresMap).map(([featLabel, transformedEntries]) => {
                            return transformedEntries.map(entry => (
                              <TableRow key={`${featLabel}-${entry.valueId}`}>
                                <TableCell>{featLabel}</TableCell>
                                <TableCell>{entry.valueId}</TableCell>
                                <TableCell>{entry.valueName || 'N/A'}</TableCell>
                                <TableCell>{entry.result}</TableCell>
                              </TableRow>
                            ));
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))
              ) : (
                <Typography>Results will appear here after calculation.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default HealthCalculator;
