import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout, isAdmin } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get first letter of name for avatar placeholder
  const getInitial = () => {
    if (currentUser?.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
          {getInitial()}
        </div>
        <span className="hidden md:block">{currentUser?.name}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-darker rounded-lg shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
            {isAdmin() && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">Admin</span>
            )}
          </div>

          {/* Admin Dashboard link (only visible for admin users) */}
          {isAdmin() && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-dark"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Link>
          )}

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-dark"
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Profile
          </Link>
          
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-dark"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Settings
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-dark"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 