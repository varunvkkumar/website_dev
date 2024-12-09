import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from '../../services/api'; // Use your configured Axios instance
import 'bootstrap/dist/css/bootstrap.min.css';
import './HealthCalculator.css';
import AddInputForm from './AddInputForm';
import AddFormulaForm from './AddFormulaForm';
import { create, all } from 'mathjs';
const math = create(all);

const HealthCalculator = () => {
  const { authTokens, loading } = useContext(AuthContext);
  const isAuthenticated = !!authTokens;

  console.log('Auth Tokens:', authTokens);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Loading:', loading);

  const [inputs, setInputs] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showAddInputForm, setShowAddInputForm] = useState(false);
  const [showAddFormulaForm, setShowAddFormulaForm] = useState(false);
  const [editingInput, setEditingInput] = useState(null);
  const [editingFormula, setEditingFormula] = useState(null);

  // Fetch inputs and formulas from the backend when authTokens are available
  useEffect(() => {
    if (!loading && authTokens) {
      const fetchInputs = async () => {
        try {
          const response = await axios.get('/api/features');
          setInputs(response.data);
        } catch (err) {
          console.error('Error fetching inputs:', err);
        }
      };

      const fetchFormulas = async () => {
        try {
          const response = await axios.get('/api/formulas');
          setFormulas(response.data);
        } catch (err) {
          console.error('Error fetching formulas:', err);
        }
      };

      fetchInputs();
      fetchFormulas();
    }
  }, [loading, authTokens]);

  // Ensure loading state is handled in the UI
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle input change
  const handleInputChange = (id, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  // Calculate results based on formulas
  const handleCalculate = () => {
    try {
      const scope = {};
      inputs.forEach((input) => {
        scope[input.id] = parseFloat(inputValues[input.id]);
      });

      const newResults = {};
      formulas.forEach((formula) => {
        const value = math.evaluate(formula.formula, scope);
        newResults[formula.id] = value;
      });

      setResults(newResults);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error in calculation. Please check your inputs and formulas.');
    }
  };

  // Add new input
  const addInput = async (input) => {
    try {
      const response = await axios.post('/api/features', input);
      setInputs((prevInputs) => [...prevInputs, response.data]);
    } catch (err) {
      console.error('Error adding input:', err);
    }
  };

  // Update existing input
  const updateInput = async (updatedInput) => {
    try {
      const response = await axios.put(`/api/features/${updatedInput.id}`, updatedInput);
      setInputs((prevInputs) =>
        prevInputs.map((input) => (input.id === updatedInput.id ? response.data : input))
      );
      setEditingInput(null);
    } catch (err) {
      console.error('Error updating input:', err);
    }
  };

  // Delete input
  const deleteInput = async (id) => {
    try {
      await axios.delete(`/api/features/${id}`);
      setInputs((prevInputs) => prevInputs.filter((input) => input.id !== id));
      setInputValues((prevValues) => {
        const newValues = { ...prevValues };
        delete newValues[id];
        return newValues;
      });
    } catch (err) {
      console.error('Error deleting input:', err);
    }
  };

  // Add new formula
  const addFormula = async (formula) => {
    try {
      const response = await axios.post('/api/formulas', formula);
      setFormulas((prevFormulas) => [...prevFormulas, response.data]);
    } catch (err) {
      console.error('Error adding formula:', err);
    }
  };

  // Update existing formula
  const updateFormula = async (updatedFormula) => {
    try {
      const response = await axios.put(`/api/formulas/${updatedFormula.id}`, updatedFormula);
      setFormulas((prevFormulas) =>
        prevFormulas.map((formula) => (formula.id === updatedFormula.id ? response.data : formula))
      );
      setEditingFormula(null);
    } catch (err) {
      console.error('Error updating formula:', err);
    }
  };

  // Delete formula
  const deleteFormula = async (id) => {
    try {
      await axios.delete(`/api/formulas/${id}`);
      setFormulas((prevFormulas) => prevFormulas.filter((formula) => formula.id !== id));
      setResults((prevResults) => {
        const newResults = { ...prevResults };
        delete newResults[id];
        return newResults;
      });
    } catch (err) {
      console.error('Error deleting formula:', err);
    }
  };

  // Edit input
  const editInput = (input) => {
    setEditingInput(input);
  };

  // Edit formula
  const editFormula = (formula) => {
    setEditingFormula(formula);
  };

  // Close input form
  const closeInputForm = () => {
    setShowAddInputForm(false);
    setEditingInput(null);
  };

  // Close formula form
  const closeFormulaForm = () => {
    setShowAddFormulaForm(false);
    setEditingFormula(null);
  };

  return (
    <div className="container mt-5">
      <h2>Health Calculator</h2>

      {/* Input Fields */}
      {inputs.map((input) => (
        <div key={input.id} className="form-group">
          <label>{input.label}:</label>
          <input
            type={input.type}
            className="form-control"
            value={inputValues[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
          />
          {isAuthenticated && (
            <div className="mt-2">
              <button className="btn btn-sm btn-secondary" onClick={() => editInput(input)}>
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger ml-2"
                onClick={() => deleteInput(input.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Calculate Button */}
      <button className="btn btn-primary btn-block mt-3" onClick={handleCalculate}>
        Calculate
      </button>

      {/* Results */}
      {results && (
        <div className="mt-4">
          <h4>Results:</h4>
          {Object.keys(results).map((key) => (
            <p key={key}>
              {formulas.find((f) => f.id === key)?.label || key}: {results[key]}
            </p>
          ))}
        </div>
      )}

      {error && <p className="text-danger mt-2">{error}</p>}

      {/* Formulas */}
      <h3 className="mt-5">Formulas</h3>
      {formulas.map((formula) => (
        <div key={formula.id}>
          <p>
            <strong>{formula.label}:</strong> {formula.formula}
          </p>
          {isAuthenticated && (
            <div className="mb-2">
              <button className="btn btn-sm btn-secondary" onClick={() => editFormula(formula)}>
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger ml-2"
                onClick={() => deleteFormula(formula.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add Input and Formula Buttons */}
      {isAuthenticated && (
        <div className="mt-4">
          <button className="btn btn-secondary" onClick={() => setShowAddInputForm(true)}>
            Add Input
          </button>
          <button className="btn btn-secondary ml-2" onClick={() => setShowAddFormulaForm(true)}>
            Add Formula
          </button>
        </div>
      )}

      {/* Add Input Form */}
      {showAddInputForm && isAuthenticated && (
        <AddInputForm
          addInput={addInput}
          updateInput={updateInput}
          onClose={closeInputForm}
          existingInputs={inputs}
          editingInput={editingInput}
        />
      )}

      {/* Add Formula Form */}
      {showAddFormulaForm && isAuthenticated && (
        <AddFormulaForm
          addFormula={addFormula}
          updateFormula={updateFormula}
          onClose={closeFormulaForm}
          existingFormulas={formulas}
          availableInputs={inputs}
          editingFormula={editingFormula}
        />
      )}
    </div>
  );
};

export default HealthCalculator;
