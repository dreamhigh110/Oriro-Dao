import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { FiShield, FiUserPlus, FiKey, FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi';

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPassword, setGeneratingPassword] = useState(false);
  const [settings, setSettings] = useState({
    siteAccessEnabled: true,
    registrationEnabled: true,
    maintenanceMode: false,
    siteAccessPassword: '',
    maintenanceMessage: 'The site is currently under maintenance. Please check back later.'
  });
  const [newPassword, setNewPassword] = useState('');

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        console.log('Fetching site settings...');
        const response = await api.get('/admin/site-settings');
        console.log('Site settings response:', response.data);
        setSettings(response.data.siteSettings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
        toast.error('Failed to load site settings: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Save settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      console.log('Updating site settings with:', settings);
      const response = await api.put('/admin/site-settings', settings);
      
      if (response.data.success) {
        toast.success('Site settings updated successfully');
        setSettings(response.data.siteSettings);
      }
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error('Failed to update site settings: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Generate new site access password
  const handleGeneratePassword = async () => {
    try {
      setGeneratingPassword(true);
      console.log('Generating new access password...');
      const response = await api.post('/admin/generate-access-password');
      
      if (response.data.success) {
        setNewPassword(response.data.password);
        toast.success('New site access password generated successfully');
        
        // Update settings with new password
        setSettings({
          ...settings,
          siteAccessPassword: response.data.password
        });
      }
    } catch (error) {
      console.error('Error generating password:', error);
      toast.error('Failed to generate new password: ' + (error.response?.data?.message || error.message));
    } finally {
      setGeneratingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Platform Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Access Settings */}
          <div className="bg-gray-50 dark:bg-dark-light p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <FiShield className="text-primary text-xl mr-2" />
              <h3 className="font-medium text-lg text-gray-800 dark:text-white">Site Access Control</h3>
            </div>
            
            <div className="mb-4">
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  name="siteAccessEnabled"
                  checked={settings.siteAccessEnabled}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Enable Site Access Protection</span>
              </label>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                When enabled, users will need to enter a password to access the site
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Current Access Password</label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="siteAccessPassword"
                  value={settings.siteAccessPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark dark:text-white"
                  placeholder="Access password"
                  disabled={!settings.siteAccessEnabled}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This is the password users need to enter to access the site
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleGeneratePassword}
              disabled={generatingPassword || !settings.siteAccessEnabled}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {generatingPassword ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                <>
                  <FiKey className="-ml-1 mr-2 h-4 w-4" />
                  Generate New Password
                </>
              )}
            </button>
            
            {newPassword && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md text-sm border border-green-200 dark:border-green-900/50">
                <p className="font-medium">New password generated: <span className="font-mono">{newPassword}</span></p>
                <p className="mt-1 text-xs">Make sure to copy this password as it won't be shown again!</p>
              </div>
            )}
          </div>
          
          {/* Registration Settings */}
          <div className="bg-gray-50 dark:bg-dark-light p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <FiUserPlus className="text-primary text-xl mr-2" />
              <h3 className="font-medium text-lg text-gray-800 dark:text-white">Registration Settings</h3>
            </div>
            
            <div className="mb-4">
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  name="registrationEnabled"
                  checked={settings.registrationEnabled}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Enable User Registration</span>
              </label>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                When disabled, new users won't be able to register accounts
              </p>
            </div>
          </div>
          
          {/* Maintenance Mode Settings */}
          <div className="bg-gray-50 dark:bg-dark-light p-4 rounded-lg md:col-span-2">
            <div className="flex items-center mb-4">
              <FiAlertCircle className="text-primary text-xl mr-2" />
              <h3 className="font-medium text-lg text-gray-800 dark:text-white">Maintenance Mode</h3>
            </div>
            
            <div className="mb-4">
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Enable Maintenance Mode</span>
              </label>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                When enabled, only administrators can access the site
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Maintenance Message</label>
              <textarea
                name="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark dark:text-white"
                placeholder="Maintenance message to display to users"
                disabled={!settings.maintenanceMode}
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <FiCheck className="-ml-1 mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings; 