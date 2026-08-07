import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Automatically inject Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle 401 Unauthorized errors if needed, but do NOT clear token unless truly invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error response is 401 and handle gracefully if needed,
    // but follow instructions: "Do not clear localStorage unless the token is actually invalid."
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message;
      if (message && (message.includes('token failed') || message.includes('no token') || message.includes('invalid') || message.includes('expired'))) {
        localStorage.removeItem('token');
        // Optionally redirect or let auth context handle it
      }
    }
    return Promise.reject(error);
  }
);

export default api;
