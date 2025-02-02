// src/services/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Update to your domain
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth
instance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;

// Example helper functions for product endpoints
const API_URL = '/api/products';

export const getProducts = async () => {
  try {
    // This request is public; skip attaching the auth header
    const response = await instance.get(API_URL, { skipAuth: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
    // This request is public; skip attaching the auth header
    const response = await instance.post(API_URL, product, { skipAuth: true });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.message);
    throw error;
  }
};
