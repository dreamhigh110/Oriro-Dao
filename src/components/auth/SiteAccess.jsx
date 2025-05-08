import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoSvg from '../../assets/icons/logo.svg';

const SiteAccess = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      return setError('Please enter the site password');
    }
    
    try {
      setLoading(true);
      setError('');
      
      // In a real implementation, this would call the backend API
      const response = await axios.post('/auth/site-access', { password });
      
      // Store site access token
      localStorage.setItem('oriroSiteAccess', response.data.token);
      
      // Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error('Site access error:', err);
      setError(err.response?.data?.message || 'Invalid site password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-darker p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <img src={logoSvg} alt="Oriro Logo" className="h-20 w-20" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            oriro
          </h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Private decentralized DAO platform
          </p>
          <h3 className="mt-6 text-center text-xl font-medium text-gray-900 dark:text-white">
            Enter Site Password
          </h3>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="site-password" className="sr-only">Site Password</label>
              <input
                id="site-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600
                          placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-dark-light
                          focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Enter site password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md
                         text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-primary disabled:opacity-75"
            >
              {loading ? 'Verifying...' : 'Access Site'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            <p>Need the password? Please contact the administrator.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteAccess; 