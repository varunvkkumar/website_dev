import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
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
  Alert,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Link } from 'react-router-dom';

function AITransformationHub() {
  const [inputs, setInputs] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState({ id: '', label: '', formula: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // No auth header needed here.
        const [inputsResponse, formulasResponse] = await Promise.all([
          axios.get('/api/features'),
          axios.get('/api/formulas'),
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
  }, []);

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
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const saveTransformedFeatures = async () => {
    try {
      const transformedFeatures = Object.entries(results).map(
        ([formulaLabel, featuresMap]) => ({
          id: formulaLabel,
          label: formulaLabel,
          type: 'number',
          options: [],
          values: Object.values(featuresMap).flat(),
        })
      );

      await axios.post('http://localhost:5002/save_transformed_features', {
        transformed_features: transformedFeatures
      });
      setSuccessMessage('Transformed features saved successfully.');
      setError('');
    } catch (err) {
      console.error('Error saving transformed features:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleClickOpen = (formula) => {
    setSelectedFormula(formula);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFormula((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/formulas/${selectedFormula.id}`, selectedFormula);
      setFormulas((prev) =>
        prev.map((formula) =>
          formula.id === selectedFormula.id ? selectedFormula : formula
        )
      );
      setSuccessMessage('Formula updated successfully.');
      setError('');
      handleClose();
    } catch (err) {
      console.error('Error updating formula:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
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
                sx={{ mb: 2 }}
              >
                Add Data
              </Button>
              <Button
                component={Link}
                to="/add-ai"
                fullWidth
                variant="contained"
                color="secondary"
                size="small"
                sx={{ mb: 2 }}
              >
                Add AI
              </Button>
            </Box>
          </Grid>

          {/* Middle column: Display Inputs and Formulas */}
          <Grid item xs={12} sm={5} md={5}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                All Transformations
              </Typography>

              {/* Formulas List */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Formulas:
              </Typography>
              {formulas.length ? (
                <List dense>
                  {formulas.map((f) => (
                    <ListItem key={f.id} button onClick={() => handleClickOpen(f)}>
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
              {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
              )}
              {Object.keys(results).length ? (
                <>
                  {Object.entries(results).map(([formulaLabel, featuresMap]) => (
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
                            {Object.entries(featuresMap).map(([featLabel, transformedEntries]) =>
                              transformedEntries.map((entry) => (
                                <TableRow key={`${featLabel}-${entry.valueId}`}>
                                  <TableCell>{featLabel}</TableCell>
                                  <TableCell>{entry.valueId}</TableCell>
                                  <TableCell>{entry.valueName || 'N/A'}</TableCell>
                                  <TableCell>{entry.result}</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ))}
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={saveTransformedFeatures}
                    >
                      Save Transformed Features
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography>Results will appear here after calculation.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Update Formula Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Formula</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the formula below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="label"
            label="Label"
            type="text"
            fullWidth
            value={selectedFormula.label}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="formula"
            label="Formula"
            type="text"
            fullWidth
            value={selectedFormula.formula}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AITransformationHub;
