// frontend/src/services/featureService.js
import api from './api';

export const getFeatures = () => {
  return api.get('/api/features', { skipAuth: true });
};

export const addFeature = (feature) => {
  return api.post('/api/features', feature, { skipAuth: true });
};

export const updateFeature = (id, feature) => {
  return api.put(`/api/features/${id}`, feature, { skipAuth: true });
};

export const deleteFeature = (id) => {
  return api.delete(`/api/features/${id}`, { skipAuth: true });
};
