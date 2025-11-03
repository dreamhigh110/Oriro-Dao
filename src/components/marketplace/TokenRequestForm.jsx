import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { FiInfo, FiSettings, FiDollarSign } from 'react-icons/fi';

const TokenRequestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    totalSupply: '',
    decimals: 18,
    tokenType: 'ERC20',
    features: {
      mintable: false,
      burnable: false,
      pausable: false,
      capped: false
    },
    initialPrice: '',
    useCase: '',
    targetNetwork: 'Ethereum'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('features.')) {
      const feature = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [feature]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await api.post('/marketplace/token-request', {
        ...formData,
        totalSupply: parseFloat(formData.totalSupply),
        decimals: parseInt(formData.decimals),
        initialPrice: parseFloat(formData.initialPrice)
      });
      
      toast.success('Token request submitted successfully');
      navigate('/marketplace/my-requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting request');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-dark-light rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Custom Token Request</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Submit a request to create your custom ERC-20 token. Our team will review and deploy it for you.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 dark:bg-dark-darker p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <FiInfo className="text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Token Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
                placeholder="e.g., My Custom Token"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Token Symbol <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                required
                maxLength={10}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white uppercase"
                placeholder="e.g., MCT"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                2-10 characters, automatically converted to uppercase
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
              placeholder="Describe your token's purpose, utility, and key features"
            />
          </div>
        </div>

        {/* Token Specifications */}
        <div className="bg-gray-50 dark:bg-dark-darker p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <FiSettings className="text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Token Specifications</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Supply <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalSupply"
                value={formData.totalSupply}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
                placeholder="1000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Decimals <span className="text-red-500">*</span>
              </label>
              <select
                name="decimals"
                value={formData.decimals}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
              >
                {[...Array(19)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                18 is standard for most tokens
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Token Type <span className="text-red-500">*</span>
              </label>
              <select
                name="tokenType"
                value={formData.tokenType}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
              >
                <option value="ERC20">Standard ERC20</option>
                <option value="Utility">Utility Token</option>
                <option value="Governance">Governance Token</option>
                <option value="Security">Security Token</option>
                <option value="Stablecoin">Stablecoin</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Token Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="features.mintable"
                  checked={formData.features.mintable}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mintable</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="features.burnable"
                  checked={formData.features.burnable}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Burnable</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="features.pausable"
                  checked={formData.features.pausable}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Pausable</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="features.capped"
                  checked={formData.features.capped}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Capped</span>
              </label>
            </div>
          </div>
        </div>

        {/* Economic Details */}
        <div className="bg-gray-50 dark:bg-dark-darker p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Economic Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Initial Price (ETH) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="initialPrice"
                value={formData.initialPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.000001"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
                placeholder="0.001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Network <span className="text-red-500">*</span>
              </label>
              <select
                name="targetNetwork"
                value={formData.targetNetwork}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="BSC">BSC (Binance Smart Chain)</option>
                <option value="Arbitrum">Arbitrum</option>
                <option value="Optimism">Optimism</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Use Case & Utility <span className="text-red-500">*</span>
            </label>
            <textarea
              name="useCase"
              value={formData.useCase}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-darker dark:text-white"
              placeholder="Explain how your token will be used, its utility within your ecosystem, and any tokenomics"
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Important Notes:</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Token creation requires admin approval and may take 3-5 business days</li>
            <li>• Deployment fees will be communicated after approval</li>
            <li>• You will receive the contract address and admin rights upon deployment</li>
            <li>• All token features can be modified only if enabled during creation</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Submitting Request...' : 'Submit Token Request'}
        </button>
      </form>
    </div>
  );
};

export default TokenRequestForm; 