import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      return setError('Please enter your email address');
    }
    
    // Email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return setError('Please enter a valid email address');
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Call to the forgot password API
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response?.status === 404) {
        // Don't reveal if the email exists or not for security reasons
        setSuccess(true); // Still show success even if email not found
      } else {
        setError(error.response?.data?.message || 'An error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message after submission
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
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If an account exists with <strong>{email}</strong>, we've sent instructions on how to reset your password.
              Please check your inbox and spam folder.
            </p>
            
            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Enter your email address and we'll send you a link to reset your password.
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light
                           text-gray-900 dark:text-white"
                placeholder="john@example.com"
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
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

export default ForgotPassword; 