import React, { useState } from 'react';

const CookiePolicy = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
    functional: true
  });

  const handleCookieToggle = (type) => {
    if (type === 'necessary') return; // Can't disable necessary cookies
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveCookieSettings = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookieSettings));
    alert('Cookie preferences saved successfully!');
  };

  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Cookie Preferences</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Manage your cookie preferences for the Oriro DAO platform.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-dark-darker rounded-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Necessary Cookies</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Essential for the website to function properly.
                  </p>
                </div>
                <div className="ml-4">
                  <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                    Always On
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-dark-darker rounded-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analytics Cookies</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Help us understand visitor interactions anonymously.
                  </p>
                </div>
                <div className="ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookieSettings.analytics}
                      onChange={() => handleCookieToggle('analytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={saveCookieSettings}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. What Are Cookies?</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Cookies are small text files placed on your device when you visit our website. 
                This policy explains how Oriro DAO uses cookies and similar technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-dark-darker p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Necessary Cookies</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Authentication, security, and session management cookies that are essential for the platform to function.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-dark-darker p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Analytics Cookies</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Help us understand how visitors use our website to improve user experience and platform performance.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Managing Cookies</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You can control cookies through your browser settings or using our cookie preference panel above. 
                Note that disabling certain cookies may affect website functionality.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 