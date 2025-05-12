import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiLock, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import api from '../../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Validate the token when the component mounts
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setIsCheckingToken(false);
        return;
      }
      
      try {
        const response = await api.get(`/auth/verify-reset-token/${token}`);
        setTokenValid(response.data.valid);
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
      } finally {
        setIsCheckingToken(false);
      }
    };
    
    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!passwords.password) {
      return setError('Password is required');
    }
    
    if (passwords.password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }
    
    if (passwords.password !== passwords.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: passwords.password
      });
      
      if (response.data.success) {
        setSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login', { state: { passwordReset: true } });
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <Link to="/" className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              oriro
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid or Expired Link</h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This password reset link is invalid or has expired. Please request a new password reset link.
            </p>
            
            <div className="flex space-x-4">
              <Link to="/forgot-password" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <Link to="/" className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              oriro
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset Successful</h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your password has been successfully reset. You will be redirected to the login page momentarily.
            </p>
            
            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <Link to="/" className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              oriro
            </Link>
          </div>
          <h2 className="mt-6 text-center text-2xl font-display font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
            Please enter your new password below.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={passwords.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light
                           text-gray-900 dark:text-white"
                placeholder="********"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light
                           text-gray-900 dark:text-white"
                placeholder="********"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-primary disabled:opacity-75 font-medium"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 text-sm">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 