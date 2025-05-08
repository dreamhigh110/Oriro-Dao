import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    console.log('Initializing theme state...');
    
    try {
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem('theme');
      console.log('Saved theme from localStorage:', savedTheme);
      
      if (savedTheme === 'dark') {
        console.log('Using dark theme from localStorage');
        return true;
      }
      
      // If no saved theme, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Using dark theme from system preference');
        return true;
      }
      
      console.log('Using default light theme');
      return false;
    } catch (error) {
      console.error('Error initializing theme:', error);
      return false;
    }
  });

  // Apply theme changes to document and store in localStorage
  useEffect(() => {
    try {
      console.log('Applying theme:', darkMode ? 'dark' : 'light');
      
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    try {
      console.log('Setting up system theme change listener');
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        // Only change if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
          console.log('System theme changed, updating to:', e.matches ? 'dark' : 'light');
          setDarkMode(e.matches);
        }
      };

      // Add event listener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }

      // Clean up
      return () => {
        console.log('Cleaning up theme change listener');
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // Fallback for older browsers
          mediaQuery.removeListener(handleChange);
        }
      };
    } catch (error) {
      console.error('Error setting up system theme listener:', error);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    console.log('Toggling theme from', darkMode ? 'dark' : 'light', 'to', !darkMode ? 'dark' : 'light');
    setDarkMode(prevMode => !prevMode);
  };

  const contextValue = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 