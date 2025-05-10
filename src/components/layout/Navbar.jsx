import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import logoSvg from '../../assets/icons/logo.svg';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import UserDropdown from './UserDropdown';
import ConnectWalletButton from '../wallet/ConnectWalletButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { currentUser, isAdmin } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Staking', path: '/staking' },
    { name: 'Governance', path: '/governance' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-dark-darker/80 backdrop-blur-md shadow-md py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-10 w-10"
                src={logoSvg}
                alt="Oriro"
              />
              <span className="ml-2 text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                oriro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Panel link (only visible for admin users) */}
              {currentUser && isAdmin() && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-dark-light transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-slate-700" />
              )}
            </button>

            {currentUser ? (
              /* User is logged in */
              <div className="flex items-center space-x-4">
                {/* Connect Wallet Button - use our new component */}
                <ConnectWalletButton />
                {/* User Dropdown */}
                <UserDropdown />
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium hover:text-primary">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-dark-light focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-dark-darker shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-200 dark:hover:bg-dark-light transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Admin Panel link in mobile menu (only visible for admin users) */}
          {currentUser && isAdmin() && (
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-purple-600 dark:text-purple-400 hover:bg-slate-200 dark:hover:bg-dark-light transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-dark-light mt-4">
            <button
              onClick={toggleTheme}
              className="flex items-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-dark-light transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-slate-700" />
              )}
              <span className="ml-2">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            {currentUser ? (
              <div className="flex flex-col space-y-2">
                {/* Connect Wallet Button - use our new component */}
                <div onClick={() => setIsOpen(false)}>
                  <ConnectWalletButton />
                </div>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 rounded-md bg-primary text-white text-center"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-md bg-primary text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 