import axios from 'axios';

// API base URL - Use relative path when frontend and backend are on same domain
const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add site access token to requests
api.interceptors.request.use(
  (config) => {
    // Add site access token if available
    const siteAccessToken = localStorage.getItem('siteAccessToken');
    if (siteAccessToken) {
      config.headers['x-site-access-token'] = siteAccessToken;
    }
    
    // Add auth token if available
    const authToken = localStorage.getItem('oriroToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message, error.response?.status);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('oriroToken');
      
      // Only redirect to login if not already on login/register pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 