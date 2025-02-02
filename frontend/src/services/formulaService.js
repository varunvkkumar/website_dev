// frontend/src/services/formulaService.js
import api from './api';

export const getFormulas = () => {
  return api.get('/api/formulas', { skipAuth: true });
};

export const addFormula = (formula) => {
  return api.post('/api/formulas', formula, { skipAuth: true });
};

export const updateFormula = (id, formula) => {
  return api.put(`/api/formulas/${id}`, formula, { skipAuth: true });
};

export const deleteFormula = (id) => {
  return api.delete(`/api/formulas/${id}`, { skipAuth: true });
};
