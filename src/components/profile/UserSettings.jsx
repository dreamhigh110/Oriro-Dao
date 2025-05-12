import React, { useState } from 'react';
import { FiSettings, FiLock, FiSave, FiLoader, FiBell, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const UserSettings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true
  });
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsSuccess, setNotificationsSuccess] = useState(false);
  
  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoadingPassword(true);
    setPasswordSuccess(false);
    
    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordSuccess(true);
      toast.success('Password changed successfully');
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (error.response?.data?.field) {
        setPasswordErrors({
          ...passwordErrors,
          [error.response.data.field]: error.response.data.message
        });
      }
    } finally {
      setLoadingPassword(false);
    }
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };
  
  // Save notification settings
  const handleSaveNotifications = async () => {
    setLoadingNotifications(true);
    setNotificationsSuccess(false);
    
    try {
      // This would connect to an API endpoint when implemented
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      setNotificationsSuccess(true);
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save notification preferences');
    } finally {
      setLoadingNotifications(false);
    }
  };
  
  // Tab content for password change
  const renderPasswordTab = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      {passwordSuccess && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md flex items-center">
          <FiCheckCircle className="mr-2" />
          <span>Password changed successfully!</span>
        </div>
      )}
      
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Password*
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          className={`w-full px-3 py-2 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-darker text-gray-900 dark:text-white`}
          required
        />
        {passwordErrors.currentPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.currentPassword}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          New Password*
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          className={`w-full px-3 py-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-darker text-gray-900 dark:text-white`}
          required
        />
        {passwordErrors.newPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.newPassword}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Password must be at least 8 characters long.
        </p>
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm New Password*
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          className={`w-full px-3 py-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-darker text-gray-900 dark:text-white`}
          required
        />
        {passwordErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loadingPassword}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 flex items-center"
        >
          {loadingPassword ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Updating...
            </>
          ) : (
            <>
              <FiLock className="mr-2" />
              Change Password
            </>
          )}
        </button>
      </div>
    </form>
  );
  
  // Tab content for notification settings
  const renderNotificationsTab = () => (
    <div className="space-y-4">
      {notificationsSuccess && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md flex items-center">
          <FiCheckCircle className="mr-2" />
          <span>Notification preferences saved!</span>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark rounded-md">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your account activity</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={notificationSettings.emailNotifications}
              onChange={() => handleNotificationToggle('emailNotifications')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark rounded-md">
          <div>
            <h3 className="font-medium">Marketing Emails</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive news, promotions and updates about Oriro</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={notificationSettings.marketingEmails}
              onChange={() => handleNotificationToggle('marketingEmails')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark rounded-md">
          <div>
            <h3 className="font-medium">Security Alerts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about important security updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={notificationSettings.securityAlerts}
              onChange={() => handleNotificationToggle('securityAlerts')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveNotifications}
          disabled={loadingNotifications}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 flex items-center"
        >
          {loadingNotifications ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <FiSave className="mr-2" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-4">
          <FiSettings className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FiLock className="inline mr-2" />
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FiBell className="inline mr-2" />
            Notification Preferences
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'password' && renderPasswordTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
      </div>
    </div>
  );
};

export default UserSettings; 