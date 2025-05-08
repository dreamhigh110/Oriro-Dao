import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiSettings, FiUsers, FiUserCheck, FiLock, FiUnlock, FiAlertCircle } from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const SiteAccessManager = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    siteAccessEnabled: true,
    registrationEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: '',
    sitePassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPassword, setGeneratingPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('Fetching site settings...');
        setLoading(true);
        const response = await api.get('/admin/dashboard');
        console.log('Dashboard data:', response.data);
        
        if (response.data.siteSettings) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...response.data.siteSettings,
          }));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch site settings', error);
        toast.error(error.response?.data?.message || 'Failed to load site settings');
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Saving site settings:', settings);
      setSaving(true);
      
      const response = await api.put('/admin/site-settings', settings);
      console.log('Update response:', response.data);
      
      if (response.data.success) {
        toast.success('Site settings updated successfully');
        
        // Clear password field after successful update
        setSettings(prevSettings => ({
          ...prevSettings,
          sitePassword: '',
        }));
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Failed to update site settings', error);
      toast.error(error.response?.data?.message || 'Failed to update site settings');
      setSaving(false);
    }
  };

  const handleGeneratePassword = async () => {
    try {
      console.log('Generating new access password...');
      setGeneratingPassword(true);
      setGeneratedPassword('');
      
      const response = await api.post('/admin/generate-access-password', {});
      console.log('Password generation response:', response.data);
      
      if (response.data.success) {
        setGeneratedPassword(response.data.password);
        toast.success('New access password generated successfully');
        
        // Update the form with the new password
        setSettings(prevSettings => ({
          ...prevSettings,
          sitePassword: response.data.password,
        }));
      }
    } catch (error) {
      console.error('Failed to generate access password', error);
      toast.error(error.response?.data?.message || 'Failed to generate access password');
    } finally {
      setGeneratingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6"
    >
      <div className="flex items-center mb-6">
        <FiSettings className="text-2xl text-primary mr-2" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Site Access Management</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Site Access Controls */}
          <div className="bg-gray-50 dark:bg-dark-darker border dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FiLock className="mr-2 text-primary" />
              Access Controls
            </h3>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="siteAccessEnabled" 
                  checked={settings.siteAccessEnabled} 
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200">
                  Enable Site Access Restrictions
                </span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                When enabled, users need an access token to visit the site
              </p>
            </div>
            
            {settings.siteAccessEnabled && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Access Password
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    name="sitePassword"
                    value={settings.sitePassword}
                    onChange={handleChange}
                    placeholder="Enter new site access password"
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    disabled={generatingPassword}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-300 disabled:opacity-50"
                  >
                    {generatingPassword ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <><FiLock className="mr-1" /> Generate</>
                    )}
                  </button>
                </div>
                {generatedPassword && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      New password generated: <span className="font-mono">{generatedPassword}</span>
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Make sure to copy this password and share it with authorized users.
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave blank to keep current password
                </p>
              </div>
            )}
          </div>

          {/* Registration Controls */}
          <div className="bg-gray-50 dark:bg-dark-darker border dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FiUsers className="mr-2 text-primary" />
              User Registration
            </h3>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="registrationEnabled" 
                  checked={settings.registrationEnabled} 
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200">
                  Enable User Registration
                </span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                When disabled, new users cannot create accounts
              </p>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="maintenanceMode" 
                  checked={settings.maintenanceMode} 
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200">
                  Maintenance Mode
                </span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                When enabled, only admins can access the site
              </p>
            </div>
            
            {settings.maintenanceMode && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maintenance Message
                </label>
                <textarea
                  name="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={handleChange}
                  placeholder="Message to display during maintenance"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark dark:text-white"
                ></textarea>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>Save Settings</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SiteAccessManager; 