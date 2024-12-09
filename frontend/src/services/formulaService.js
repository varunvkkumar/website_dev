// frontend/src/services/formulaService.js
import api from './api';

export const getFormulas = () => {
  return api.get('/api/formulas');
};

export const addFormula = (formula) => {
  return api.post('/api/formulas', formula);
};

export const updateFormula = (id, formula) => {
  return api.put(`/api/formulas/${id}`, formula);
};

export const deleteFormula = (id) => {
  return api.delete(`/api/formulas/${id}`);
};