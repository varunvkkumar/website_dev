// src/services/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:443',
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;

const API_URL = '/api/products';

export const getProducts = async () => {
  try {
    const response = await instance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
    const response = await instance.post(API_URL, product);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.message);
    throw error;
  }
};
