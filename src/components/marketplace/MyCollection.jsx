import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const NFTCard = ({ nft }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{nft.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{nft.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">{nft.price} ETH</p>
          <p className="text-sm text-gray-500">Owned: {nft.quantity}</p>
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Purchased on {new Date(nft.purchaseDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const MyCollection = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMyNFTs();
  }, []);

  const fetchMyNFTs = async () => {
    try {
      const response = await api.get('/marketplace/my-nfts');
      setNfts(response.data);
    } catch (error) {
      toast.error('Error fetching your NFTs');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNFTs = nfts.filter(nft => {
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
        return new Date(a.purchaseDate) - new Date(b.purchaseDate);
      default: // newest
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
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
        <h1 className="text-3xl font-bold text-gray-900">My NFT Collection</h1>
        <p className="text-gray-500">Total NFTs: {nfts.length}</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="newest">Recently Purchased</option>
            <option value="oldest">First Purchased</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your NFTs..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {sortedNFTs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedNFTs.map((nft) => (
            <NFTCard key={nft._id} nft={nft} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No NFTs in your collection yet</p>
          <a
            href="/marketplace"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Marketplace
          </a>
        </div>
      )}
    </div>
  );
};

export default MyCollection;