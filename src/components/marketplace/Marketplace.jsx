import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const NFTCard = ({ nft, onPurchase }) => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      await onPurchase(nft._id);
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-light rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{nft.name}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{nft.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900 dark:text-white">{nft.price} ETH</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Available: {nft.quantity}</p>
        </div>
        <div className="mt-4">
          <button
            onClick={handlePurchase}
            disabled={loading || nft.quantity === 0}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${nft.quantity === 0 
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'} 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : nft.quantity === 0 ? 'Sold Out' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const response = await api.get('/marketplace/nfts');
      setNfts(response.data);
    } catch (error) {
      toast.error('Error fetching NFTs');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (nftId) => {
    try {
      await api.post(`/marketplace/nfts/${nftId}/purchase`);
      toast.success('NFT purchased successfully');
      fetchNFTs(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error purchasing NFT');
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    if (filter === 'available') return nft.quantity > 0;
    if (filter === 'sold') return nft.quantity === 0;
    return true;
  }).filter(nft => {
    if (!searchTerm) return true;
    return nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           nft.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default: // newest
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NFT Marketplace</h1>
        <Link
          to="/marketplace/create-nft"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
        >
          Create NFT
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-light dark:text-white"
          >
            <option value="all">All NFTs</option>
            <option value="available">Available</option>
            <option value="sold">Sold Out</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-light dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search NFTs..."
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-light dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {sortedNFTs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedNFTs.map((nft) => (
            <NFTCard
              key={nft._id}
              nft={nft}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No NFTs found</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;