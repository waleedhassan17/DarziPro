// Auth Network — handles all auth-related HTTP requests
// This is the ONLY place where API calls for auth are declared
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login
export const loginAPI = async (credentials) => {
  const response = await api.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
  });
  return response.data; // raw response, no transformation
};

// Register
export const registerAPI = async (userData) => {
  const response = await api.post('/auth/register', {
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    shop_name: userData.shopName,
  });
  return response.data;
};

// Forgot Password
export const forgotPasswordAPI = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Verify OTP
export const verifyOtpAPI = async ({ email, otp }) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

// Reset Password
export const resetPasswordAPI = async ({ email, otp, newPassword }) => {
  const response = await api.post('/auth/reset-password', {
    email,
    otp,
    new_password: newPassword,
  });
  return response.data;
};

// Get Profile (authenticated)
export const getProfileAPI = async (token) => {
  const response = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Logout
export const logoutAPI = async (token) => {
  const response = await api.post(
    '/auth/logout',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default api;
