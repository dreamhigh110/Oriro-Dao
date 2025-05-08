import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiLock, FiShield, FiX, FiUnlock, FiInfo } from 'react-icons/fi';
import api from '../../utils/api';
import logo from '../../assets/logo.svg';

const SiteAccessGate = () => {
  const location = useLocation();
  const [accessPassword, setAccessPassword] = useState('');
  const [storedToken, setStoredToken] = useState(localStorage.getItem('siteAccessToken'));
  const [validating, setValidating] = useState(!!storedToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  // Check if there's a stored token and validate it
  useEffect(() => {
    if (storedToken) {
      validateExistingToken(storedToken);
    }
  }, [storedToken]);
  
  const validateExistingToken = async (token) => {
    try {
      setValidating(true);
      
      // Configure headers with the token
      const headers = {
        'x-site-access-token': token
      };
      
      // Try to access a public endpoint
      await api.get('/health', { headers });
      
      // If successful, redirect to the requested page or home
      const redirect = new URLSearchParams(location.search).get('redirect') || '/';
      console.log('Token validation successful, redirecting to:', redirect);
      
      // Force a complete page refresh 
      window.location.href = redirect;
      
    } catch (err) {
      console.error('Token validation error:', err);
      
      // If token is invalid, remove it
      localStorage.removeItem('siteAccessToken');
      setStoredToken(null);
      setValidating(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!accessPassword.trim()) {
      setError('Please enter the access password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Try to access a public endpoint with the password as a query parameter
      console.log('Sending request with password:', accessPassword);
      const response = await api.get(`/health?access=${accessPassword}`);
      
      console.log('Response status:', response.status);
      console.log('Full response object:', response);
      console.log('Response data:', response.data);
      
      // First check if token is in the response body (preferred method)
      let accessToken = response.data?.accessToken;
      console.log('Access token from response body:', accessToken);
      
      // Fall back to headers if not in body
      if (!accessToken) {
        console.log('No token in body, checking headers...');
        console.log('Headers object type:', typeof response.headers);
        console.log('All header keys:', Object.keys(response.headers));
        
        accessToken = response.headers['x-site-access-token'] || 
                      response.headers['X-Site-Access-Token'];
        
        // Try a different approach to access headers
        if (!accessToken && response.headers.get) {
          console.log('Trying headers.get() method...');
          accessToken = response.headers.get('x-site-access-token');
        }
        
        console.log('Access token from header:', accessToken);
      }
      
      if (accessToken) {
        console.log('Successfully received access token:', accessToken);
        // Store the token for future requests
        localStorage.setItem('siteAccessToken', accessToken);
        
        // Make sure to clear loading state before navigating
        setLoading(false);
        
        // Get the redirect URL
        const redirect = new URLSearchParams(location.search).get('redirect') || '/';
        console.log('Preparing to navigate to:', redirect);
        
        // Force a complete page refresh to ensure app state is completely reset
        console.log('Forcing page refresh to:', redirect);
        window.location.href = redirect;
      } else {
        console.log('No access token found in response');
        throw new Error('No access token received');
      }
    } catch (err) {
      console.error('Site access error:', err);
      setAttempts(prevAttempts => prevAttempts + 1);
      
      if (attempts >= 2) {
        setError('Multiple invalid attempts detected. Please try again later or contact the administrator for assistance.');
      } else {
        setError('Invalid access password. Please try again or contact the administrator.');
      }
      
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-darker p-4">
        <div className="w-full max-w-md flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-6"></div>
          <h2 className="text-white text-xl font-medium">Validating access token...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-darker p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-dark-darker rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Oriro" className="h-12" />
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FiShield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Private Access</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              This platform is currently in private beta. Enter your access password to continue.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md flex items-start border border-red-200 dark:border-red-900/50"
              >
                <FiX className="mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
            
            <div className="mb-6">
              <label htmlFor="accessPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="accessPassword"
                  type="password"
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark dark:text-white"
                  placeholder="Enter your access password"
                  autoFocus
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <FiInfo className="mr-1" />
                Password provided by your administrator
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <FiUnlock className="mr-2" />
                  Access Platform
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Don't have access? Please contact the administrator or wait for public launch.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Oriro Platform © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SiteAccessGate; 