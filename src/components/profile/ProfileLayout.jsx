import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiUser, FiCreditCard, FiFileText, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ProfileLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  const menuItems = [
    { 
      name: 'KYC Verification', 
      path: '/profile', 
      icon: <FiFileText className="mr-2" />
    },
    { 
      name: 'Wallet Connection', 
      path: '/connect-wallet', 
      icon: <FiCreditCard className="mr-2" />
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <FiSettings className="mr-2" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white dark:bg-dark-darker rounded-lg shadow p-6">
            {/* User info */}
            <div className="flex items-center pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-4">
                <FiUser className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {currentUser.firstName} {currentUser.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentUser.email}
                </p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        `flex items-center px-4 py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-light'
                        }`
                      }
                      end={item.path === '/profile'}
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="w-full md:w-3/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 