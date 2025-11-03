import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MarketplaceNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/marketplace', label: 'NFTs' },
    { path: '/marketplace/collection', label: 'My NFTs' },
    { path: '/marketplace/bonds', label: 'Bonds' },
    { path: '/marketplace/my-bonds', label: 'My Bonds' },
    { path: '/marketplace/tokens', label: 'Tokens' },
    { path: '/marketplace/create-nft', label: 'Create NFT' },
    { path: '/marketplace/create-bond', label: 'Create Bond' },
    { path: '/marketplace/create-token', label: 'Create Token' },
    { path: '/marketplace/my-requests', label: 'My Requests' }
  ];

  return (
    <nav className="bg-white dark:bg-dark-darker shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                  isActive(item.path)
                    ? 'border-indigo-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MarketplaceNav;
