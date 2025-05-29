import React, { useState } from 'react';

const ApiReference = () => {
  const [selectedCategory, setSelectedCategory] = useState('authentication');

  const apiCategories = [
    { id: 'authentication', name: 'Authentication', icon: '🔐' },
    { id: 'users', name: 'Users', icon: '👤' },
    { id: 'marketplace', name: 'Marketplace', icon: '🏪' },
    { id: 'governance', name: 'Governance', icon: '🗳️' },
    { id: 'staking', name: 'Staking', icon: '💰' },
    { id: 'bonds', name: 'Bonds', icon: '📊' },
    { id: 'nfts', name: 'NFTs', icon: '🖼️' },
  ];

  const apiEndpoints = {
    authentication: [
      {
        method: 'POST',
        endpoint: '/api/auth/login',
        description: 'Authenticate user with email and password',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: {
          success: {
            token: 'JWT token string',
            user: { id: 'string', email: 'string', role: 'string' }
          },
          error: { message: 'Invalid credentials' }
        }
      },
      {
        method: 'POST',
        endpoint: '/api/auth/register',
        description: 'Register a new user account',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password (min 8 chars)' },
          { name: 'firstName', type: 'string', required: true, description: 'User first name' },
          { name: 'lastName', type: 'string', required: true, description: 'User last name' }
        ],
        response: {
          success: { message: 'Registration successful', userId: 'string' },
          error: { message: 'Email already exists' }
        }
      },
      {
        method: 'POST',
        endpoint: '/api/auth/refresh',
        description: 'Refresh authentication token',
        parameters: [
          { name: 'refreshToken', type: 'string', required: true, description: 'Valid refresh token' }
        ],
        response: {
          success: { token: 'New JWT token', expiresIn: 'number' },
          error: { message: 'Invalid refresh token' }
        }
      }
    ],
    marketplace: [
      {
        method: 'GET',
        endpoint: '/api/marketplace/nfts',
        description: 'Get list of available NFTs',
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 20)' },
          { name: 'category', type: 'string', required: false, description: 'Filter by category' }
        ],
        response: {
          success: {
            nfts: [{ id: 'string', name: 'string', price: 'number', image: 'string' }],
            totalCount: 'number',
            page: 'number'
          }
        }
      },
      {
        method: 'POST',
        endpoint: '/api/marketplace/nft-requests',
        description: 'Create a new NFT request',
        parameters: [
          { name: 'title', type: 'string', required: true, description: 'NFT title' },
          { name: 'description', type: 'string', required: true, description: 'NFT description' },
          { name: 'category', type: 'string', required: true, description: 'NFT category' },
          { name: 'image', type: 'file', required: true, description: 'NFT image file' }
        ],
        response: {
          success: { requestId: 'string', status: 'pending' },
          error: { message: 'Validation error details' }
        }
      }
    ],
    bonds: [
      {
        method: 'GET',
        endpoint: '/api/marketplace/bonds',
        description: 'Get available bonds',
        parameters: [
          { name: 'status', type: 'string', required: false, description: 'Filter by status (active, completed)' },
          { name: 'minAPY', type: 'number', required: false, description: 'Minimum APY filter' }
        ],
        response: {
          success: {
            bonds: [{ id: 'string', name: 'string', apy: 'number', maturityDate: 'string' }]
          }
        }
      },
      {
        method: 'POST',
        endpoint: '/api/marketplace/bonds/invest',
        description: 'Invest in a bond',
        parameters: [
          { name: 'bondId', type: 'string', required: true, description: 'Bond ID to invest in' },
          { name: 'amount', type: 'number', required: true, description: 'Investment amount' }
        ],
        response: {
          success: { investmentId: 'string', transactionHash: 'string' },
          error: { message: 'Insufficient funds or bond not available' }
        }
      }
    ]
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PUT: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            API Reference
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Complete API documentation for integrating with the Oriro DAO platform.
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Base URL</h2>
          <code className="bg-slate-100 dark:bg-dark-darker px-4 py-2 rounded-lg text-slate-800 dark:text-slate-200 block">
            https://oriro.org/api
          </code>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Categories</h3>
              <nav className="space-y-2">
                {apiCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-darker'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {apiEndpoints[selectedCategory]?.map((endpoint, index) => (
                <div key={index} className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6">
                  {/* Method and Endpoint */}
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="bg-slate-100 dark:bg-dark-darker px-4 py-2 rounded-lg text-slate-800 dark:text-slate-200 flex-1">
                      {endpoint.endpoint}
                    </code>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-300 mb-6">{endpoint.description}</p>

                  {/* Parameters */}
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-slate-200 dark:border-dark rounded-lg">
                          <thead className="bg-slate-50 dark:bg-dark-darker">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Required</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-dark">
                            {endpoint.parameters.map((param, paramIndex) => (
                              <tr key={paramIndex}>
                                <td className="px-4 py-3 text-sm font-mono text-slate-900 dark:text-white">{param.name}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{param.type}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    param.required 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                  }`}>
                                    {param.required ? 'Required' : 'Optional'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Response */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Response</h4>
                    <div className="bg-slate-100 dark:bg-dark-darker rounded-lg p-4">
                      <pre className="text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="bg-white dark:bg-dark-light rounded-xl shadow-md p-6 text-center">
                  <p className="text-slate-600 dark:text-slate-300">No endpoints available for this category yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mt-12">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">Rate Limits</h3>
          <ul className="text-yellow-700 dark:text-yellow-300 space-y-2">
            <li>• <strong>Authenticated requests:</strong> 1000 requests per hour</li>
            <li>• <strong>Unauthenticated requests:</strong> 100 requests per hour</li>
            <li>• <strong>File uploads:</strong> 10 requests per minute</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiReference; 