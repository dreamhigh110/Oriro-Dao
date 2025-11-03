import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiEye, FiEyeOff, FiSave, FiRefreshCw } from 'react-icons/fi';

const HomepageSettings = () => {
  const [settings, setSettings] = useState({
    hero: true,
    features: true,
    marketplacePreview: true,
    blockchainSection: false,
    ctaSection: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sections = [
    {
      key: 'hero',
      name: 'Hero Section',
      description: 'Main banner with platform introduction and call-to-action buttons'
    },
    {
      key: 'features',
      name: 'Features Section',
      description: 'Highlights of platform features and capabilities'
    },
    {
      key: 'marketplacePreview',
      name: 'Marketplace Preview',
      description: 'Preview of NFTs and bonds available on the platform'
    },
    {
      key: 'blockchainSection',
      name: 'Blockchain Section',
      description: 'Multi-chain support and blockchain technology information'
    },
    {
      key: 'ctaSection',
      name: 'Call-to-Action Section',
      description: 'Final call-to-action and platform signup encouragement'
    }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/homepage-settings');
      if (response.data.success) {
        setSettings(response.data.homepageSettings);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching homepage settings:', err);
      setError('Failed to load homepage settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (section) => {
    setSettings(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      setError('');

      const response = await api.put('/admin/homepage-settings', {
        homepageSettings: settings
      });

      if (response.data.success) {
        setMessage('Homepage settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating homepage settings:', err);
      setError('Failed to update homepage settings');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
    setMessage('');
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Homepage Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Control which sections are visible on the homepage. Changes will take effect immediately.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Settings Panel */}
      <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Section Visibility</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-dark hover:bg-slate-200 dark:hover:bg-dark-darker rounded-lg transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.key}
              className="flex items-center justify-between p-4 border border-slate-200 dark:border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-dark-darker transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    {section.name}
                  </h3>
                  <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    settings[section.key]
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                  }`}>
                    {settings[section.key] ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {section.description}
                </p>
              </div>
              <button
                onClick={() => handleToggle(section.key)}
                className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  settings[section.key] ? 'bg-primary' : 'bg-slate-200 dark:bg-dark'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings[section.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-8 p-4 bg-slate-50 dark:bg-dark-darker rounded-lg">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
            Homepage Preview
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="mb-2">The following sections will be visible on the homepage:</p>
            <ul className="list-disc list-inside space-y-1">
              {sections
                .filter(section => settings[section.key])
                .map(section => (
                  <li key={section.key} className="flex items-center">
                    <FiEye className="mr-2 text-green-500" />
                    {section.name}
                  </li>
                ))}
            </ul>
            {sections.filter(section => !settings[section.key]).length > 0 && (
              <>
                <p className="mt-4 mb-2">Hidden sections:</p>
                <ul className="list-disc list-inside space-y-1">
                  {sections
                    .filter(section => !settings[section.key])
                    .map(section => (
                      <li key={section.key} className="flex items-center text-red-500">
                        <FiEyeOff className="mr-2" />
                        {section.name}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageSettings; 