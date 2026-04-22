// Customer Network — handles all customer-related HTTP requests
// This is the ONLY place where API calls for customers are declared
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all customers with optional params (search, page, limit)
export const getCustomersAPI = async (token, params = {}) => {
  const response = await api.get('/customers', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

// Get single customer by ID
export const getCustomerByIdAPI = async (token, id) => {
  const response = await api.get(`/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new customer
export const createCustomerAPI = async (token, customerData) => {
  const response = await api.post('/customers', customerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update an existing customer
export const updateCustomerAPI = async (token, id, customerData) => {
  const response = await api.put(`/customers/${id}`, customerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a customer
export const deleteCustomerAPI = async (token, id) => {
  const response = await api.delete(`/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Search customers by query string
export const searchCustomersAPI = async (token, query) => {
  const response = await api.get('/customers/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query },
  });
  return response.data;
};
