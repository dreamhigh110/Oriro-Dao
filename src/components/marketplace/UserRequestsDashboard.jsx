import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const RequestCard = ({ request, type }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{request.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {type === 'nft' ? (
          <>
            <p className="text-sm">
              <span className="font-medium">Price:</span> {request.price} ETH
            </p>
            <p className="text-sm">
              <span className="font-medium">Quantity:</span> {request.quantity}
            </p>
            {request.imageUrl && (
              <img
                src={request.imageUrl}
                alt={request.name}
                className="h-24 w-24 object-cover rounded-md mt-2"
              />
            )}
          </>
        ) : (
          <>
            <p className="text-sm">
              <span className="font-medium">Face Value:</span> {request.faceValue} ETH
            </p>
            <p className="text-sm">
              <span className="font-medium">Interest Rate:</span> {request.interestRate}%
            </p>
            <p className="text-sm">
              <span className="font-medium">Maturity Period:</span> {request.maturityPeriod} days
            </p>
            <p className="text-sm">
              <span className="font-medium">Quantity:</span> {request.quantity}
            </p>
          </>
        )}
      </div>

      {request.adminFeedback && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700">Admin Feedback:</p>
          <p className="text-sm text-gray-600">{request.adminFeedback}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Submitted on {new Date(request.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

const UserRequestsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({ nftRequests: [], bondRequests: [] });
  const [activeTab, setActiveTab] = useState('nft');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/marketplace/user-requests');
      setRequests(response.data);
    } catch (error) {
      toast.error('Error fetching requests');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Requests</h2>
        <div className="space-x-4">
          <Link
            to="/marketplace/create-nft"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create NFT
          </Link>
          <Link
            to="/marketplace/create-bond"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Bond
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('nft')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'nft'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            NFT Requests ({requests.nftRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('bond')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'bond'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bond Requests ({requests.bondRequests.length})
          </button>
        </nav>
      </div>

      <div className="space-y-6">
        {activeTab === 'nft' ? (
          requests.nftRequests.length > 0 ? (
            requests.nftRequests.map((request) => (
              <RequestCard key={request._id} request={request} type="nft" />
            ))
          ) : (
            <p className="text-center text-gray-500">No NFT requests yet</p>
          )
        ) : requests.bondRequests.length > 0 ? (
          requests.bondRequests.map((request) => (
            <RequestCard key={request._id} request={request} type="bond" />
          ))
        ) : (
          <p className="text-center text-gray-500">No Bond requests yet</p>
        )}
      </div>
    </div>
  );
};

export default UserRequestsDashboard;