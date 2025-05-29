import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const BondCard = ({ bond, onPurchase }) => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      await onPurchase(bond._id);
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{bond.name}</h3>
            <p className="text-sm text-gray-500">{bond.description}</p>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            {bond.interestRate}% APY
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Face Value</span>
            <span className="font-medium">{bond.faceValue} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Maturity Period</span>
            <span className="font-medium">{bond.maturityPeriod} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Available</span>
            <span className="font-medium">{bond.quantity}</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handlePurchase}
            disabled={loading || bond.quantity === 0}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${bond.quantity === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'} 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : bond.quantity === 0 ? 'Sold Out' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Bonds = () => {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('interestRate');

  useEffect(() => {
    fetchBonds();
  }, []);

  const fetchBonds = async () => {
    try {
      const response = await api.get('/marketplace/bonds');
      setBonds(response.data);
    } catch (error) {
      toast.error('Error fetching bonds');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (bondId) => {
    try {
      await api.post(`/marketplace/bonds/${bondId}/purchase`);
      toast.success('Bond purchased successfully');
      fetchBonds(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error purchasing bond');
    }
  };

  const filteredBonds = bonds.filter(bond => {
    if (filter === 'available') return bond.quantity > 0;
    if (filter === 'sold') return bond.quantity === 0;
    return true;
  }).filter(bond => {
    if (!searchTerm) return true;
    return bond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bond.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedBonds = [...filteredBonds].sort((a, b) => {
    switch (sortBy) {
      case 'interestRate':
        return b.interestRate - a.interestRate;
      case 'maturityPeriod':
        return a.maturityPeriod - b.maturityPeriod;
      case 'faceValue-low':
        return a.faceValue - b.faceValue;
      case 'faceValue-high':
        return b.faceValue - a.faceValue;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bond Marketplace</h1>
        <Link
          to="/marketplace/create-bond"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Bond
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Bonds</option>
            <option value="available">Available</option>
            <option value="sold">Sold Out</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="interestRate">Highest Interest Rate</option>
            <option value="maturityPeriod">Shortest Maturity</option>
            <option value="faceValue-low">Face Value: Low to High</option>
            <option value="faceValue-high">Face Value: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bonds..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {sortedBonds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedBonds.map((bond) => (
            <BondCard
              key={bond._id}
              bond={bond}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No bonds found</p>
        </div>
      )}
    </div>
  );
};

export default Bonds;