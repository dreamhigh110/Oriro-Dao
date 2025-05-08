import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiMail, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    verified: false,
    error: null
  });
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // If token exists, try to verify the email
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
      
      try {
        setVerificationStatus({ loading: true, verified: false, error: null });
        
        // Debug log
        console.log('Verifying token:', token);
        
        // Add delay to ensure the component is mounted
        const response = await api.get(`/auth/verify-email/${token}`);
        console.log('Verification response:', response);
        
        if (response.data && response.data.success) {
          console.log('Verification successful');
          setVerificationStatus({ loading: false, verified: true, error: null });
          toast.success('Email verification successful!');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login', { state: { emailVerified: true } });
          }, 3000);
        } else {
          // This should rarely happen as most failures will trigger the catch block
          console.error('Verification request succeeded but returned unsuccessful status');
          setVerificationStatus({
            loading: false,
            verified: false,
            error: response.data?.message || 'Verification failed. Please try again.'
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        console.error('Error details:', error.response?.data);
        
        setVerificationStatus({
          loading: false,
          verified: false,
          error: error.response?.data?.message || 'Verification failed. Please try again.'
        });
      }
    };
    
    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  // Handle resend verification email
  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setResendLoading(true);
      const response = await api.post('/auth/resend-verification', { email });
      
      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox and the console for the verification link.');
        setEmail('');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // Token provided - display verification result
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <Link to="/" className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              oriro
            </Link>
          </div>
          
          {verificationStatus.loading ? (
            <div className="text-center my-8">
              <div className="animate-spin mx-auto rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Verifying your email...</h2>
              <p className="text-sm text-gray-500 mt-2">This may take a moment...</p>
            </div>
          ) : verificationStatus.verified ? (
            <div className="text-center my-8">
              <FiCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Email Verified!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your email has been successfully verified. You can now login to your account.
              </p>
              <Link
                to="/login"
                className="w-full block text-center py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors duration-300"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="text-center my-8">
              <FiAlertTriangle className="mx-auto text-red-500 text-5xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verification Failed</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {verificationStatus.error || 'Unable to verify your email. The link may have expired or is invalid.'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Need a new verification link? Enter your email below to request a new one.
              </p>
              <form onSubmit={handleResendVerification} className="mt-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 font-medium"
                >
                  {resendLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No token - display pending verification page (reached after registration)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
        <div className="flex justify-center">
          <Link to="/" className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            oriro
          </Link>
        </div>
        <div className="text-center my-8">
          <FiMail className="mx-auto text-primary text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            For development mode, this link is displayed in your server console.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Didn't receive the email? Check your spam folder or request a new verification link below.
          </p>
          <form onSubmit={handleResendVerification} className="mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
                placeholder="Enter your email address"
                required
              />
            </div>
            <button
              type="submit"
              disabled={resendLoading}
              className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 font-medium"
            >
              {resendLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          </form>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 