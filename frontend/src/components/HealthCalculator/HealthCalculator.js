import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';

function HealthCalculator() {
  const { authTokens } = useContext(AuthContext);
  const [inputs, setInputs] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (authTokens) {
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
      }
    };

    fetchData();
  }, [authTokens]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const calculateResults = () => {
    const calculatedResults = {};
    formulas.forEach((formula) => {
      try {
        const variables = {};
        inputs.forEach((input) => {
          variables[input.name] = parseFloat(input.value) || 0;
        });

        const result = evaluate(formula.expression, variables);
        calculatedResults[formula.name] = result;
      } catch (err) {
        calculatedResults[formula.name] = 'Error';
      }
    });
    setResults(calculatedResults);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3}>
        <Grid container>
          {/* Left Sidebar */}
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
              >
                Add Formulas
              </Button>
            </Box>
          </Grid>

          {/* Divider */}
          <Divider orientation="vertical" flexItem />

          {/* Middle Section: Display Inputs and Formulas */}
          <Grid item xs={12} sm={5} md={5}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Added Inputs and Formulas
              </Typography>

              {/* Display Inputs */}
              <Typography variant="subtitle1">Inputs:</Typography>
              <List dense>
                {inputs.length > 0 ? (
                  inputs.map((input) => (
                    <ListItem key={input.id}>
                      <ListItemText primary={input.name} />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No inputs added yet.</Typography>
                )}
              </List>

              {/* Display Formulas */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Formulas:
              </Typography>
              <List dense>
                {formulas.length > 0 ? (
                  formulas.map((formula) => (
                    <ListItem key={formula.id}>
                      <ListItemText
                        primary={formula.name}
                        secondary={formula.expression}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No formulas added yet.</Typography>
                )}
              </List>

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

          {/* Divider */}
          <Divider orientation="vertical" flexItem />

          {/* Results Section */}
          <Grid item xs={12} sm={4} md={4}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              {Object.keys(results).length > 0 ? (
                <Box>
                  {Object.entries(results).map(([key, value]) => (
                    <Typography key={key}>
                      <strong>{key}:</strong> {value}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography>
                  Results will appear here after calculation.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default HealthCalculator;
