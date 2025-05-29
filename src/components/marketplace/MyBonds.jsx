import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const BondCard = ({ bond }) => {
  const calculateTimeRemaining = () => {
    const purchaseDate = new Date(bond.purchaseDate);
    const maturityDate = new Date(purchaseDate.getTime() + (bond.maturityPeriod * 24 * 60 * 60 * 1000));
    const now = new Date();
    const daysRemaining = Math.ceil((maturityDate - now) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const calculateInterestEarned = () => {
    const purchaseDate = new Date(bond.purchaseDate);
    const now = new Date();
    const daysHeld = Math.ceil((now - purchaseDate) / (1000 * 60 * 60 * 24));
    const yearFraction = daysHeld / 365;
    return (bond.faceValue * bond.interestRate * yearFraction) / 100;
  };

  return (
    <div className="bg-white dark:bg-dark-light rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bond.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bond.description}</p>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {bond.interestRate}% APY
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Face Value</span>
            <span className="font-medium text-gray-900 dark:text-white">{bond.faceValue} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Quantity Owned</span>
            <span className="font-medium text-gray-900 dark:text-white">{bond.quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Days Until Maturity</span>
            <span className="font-medium text-gray-900 dark:text-white">{calculateTimeRemaining()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Interest Earned</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {calculateInterestEarned().toFixed(4)} ETH
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Purchase Date</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(bond.purchaseDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBonds = () => {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('maturityDate');

  useEffect(() => {
    fetchMyBonds();
  }, []);

  const fetchMyBonds = async () => {
    try {
      const response = await api.get('/marketplace/my-bonds');
      setBonds(response.data);
    } catch (error) {
      toast.error('Error fetching your bonds');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBonds = bonds.filter(bond => {
    if (!searchTerm) return true;
    return bond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bond.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedBonds = [...filteredBonds].sort((a, b) => {
    const getMaturityDate = (bond) => {
      const purchaseDate = new Date(bond.purchaseDate);
      return new Date(purchaseDate.getTime() + (bond.maturityPeriod * 24 * 60 * 60 * 1000));
    };

    switch (sortBy) {
      case 'maturityDate':
        return getMaturityDate(a) - getMaturityDate(b);
      case 'purchaseDate':
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      case 'interestRate':
        return b.interestRate - a.interestRate;
      case 'faceValue':
        return b.faceValue - a.faceValue;
      default:
        return 0;
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bond Portfolio</h1>
        <div className="text-gray-500 dark:text-gray-400">
          Total Bonds: {bonds.length}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-light dark:text-white"
          >
            <option value="maturityDate">Closest to Maturity</option>
            <option value="purchaseDate">Recently Purchased</option>
            <option value="interestRate">Highest Interest Rate</option>
            <option value="faceValue">Highest Face Value</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your bonds..."
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-light dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {sortedBonds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedBonds.map((bond) => (
            <BondCard key={bond._id} bond={bond} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No bonds in your portfolio yet</p>
          <a
            href="/marketplace/bonds"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            Browse Bond Market
          </a>
        </div>
      )}
    </div>
  );
};

export default MyBonds;