import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiBriefcase, FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import logo from '../../assets/logo.svg';

const Register = () => {
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  
  // Check if registration is enabled
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        setCheckingRegistration(true);
        console.log('Checking registration status...');
        
        // Backend API health endpoint
        const response = await api.get('/health');
        console.log('Health check response:', response.data);
        
        // Check if registration is disabled from response headers
        if (response.headers['x-registration-disabled'] === 'true') {
          setRegistrationEnabled(false);
        } else {
          setRegistrationEnabled(true);
        }
      } catch (error) {
        console.error('Registration status check error:', error.message);
        
        // If we get a specific error about registration being disabled
        if (error.response && error.response.status === 403 && 
            error.response.data.message === 'Registration is currently disabled.') {
          setRegistrationEnabled(false);
        } else {
          // Default to enabling registration if we can't determine
          setRegistrationEnabled(true);
        }
      } finally {
        setCheckingRegistration(false);
      }
    };
    
    checkRegistrationStatus();
  }, []);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // No validation for middle name as it's optional
    
    // No validation for company name as it's optional
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data) {
        setRegisteredEmail(formData.email);
        setEmailSent(true);
        toast.success('Registration successful! Please check your email to verify your account.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response && error.response.data.message) {
        if (error.response.status === 403 && 
            error.response.data.message === 'Registration is currently disabled.') {
          setRegistrationEnabled(false);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (checkingRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-darker py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!registrationEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-darker py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <img src={logo} alt="Oriro" className="h-12" />
          </div>
          <div className="text-center mb-6">
            <FiAlertCircle className="mx-auto text-yellow-500 text-4xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Registration Disabled</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Registration is currently disabled by the administrator. Please try again later or contact support for assistance.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full block text-center py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors duration-300"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-darker py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <img src={logo} alt="Oriro" className="h-12" />
          </div>
          <div className="text-center mb-6">
            <FiMail className="mx-auto text-primary text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verify Your Email</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We've sent a verification link to <strong>{registeredEmail}</strong>. 
              Please check your inbox and click the link to activate your account.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full block text-center py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors duration-300"
            >
              Go to Login
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/verify-email"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Need help with verification?
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-darker py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <img src={logo} alt="Oriro" className="h-12" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-display font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
            Or{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to your account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="firstName">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white`}
                    placeholder="First Name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="lastName">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white`}
                    placeholder="Last Name"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="middleName">
                Middle Name <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUserPlus className="text-gray-400" />
                </div>
                <input
                  id="middleName"
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
                  placeholder="Middle Name"
                />
              </div>
            </div>
            
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="companyName">
                Company Name <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="text-gray-400" />
                </div>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
                  placeholder="Company Name"
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="email">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white`}
                  placeholder="Email Address"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="password">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white`}
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white`}
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md 
                      text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-primary disabled:opacity-75 font-medium"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 