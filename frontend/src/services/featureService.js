// frontend/src/services/featureService.js
import api from './api';

export const getFeatures = () => {
  return api.get('/api/features');
};

export const addFeature = (feature) => {
  return api.post('/api/features', feature);
};

export const updateFeature = (id, feature) => {
  return api.put(`/api/features/${id}`, feature);
};

export const deleteFeature = (id) => {
  return api.delete(`/api/features/${id}`);
};