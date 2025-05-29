import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiSearch, FiDownload, FiEye, FiEdit3, FiTrash2, FiCheckSquare, FiSquare, FiFilter } from 'react-icons/fi';
import api from '../../utils/api';

const RequestDetailModal = ({ request, type, isOpen, onClose, onStatusUpdate }) => {
  const [feedback, setFeedback] = useState(request?.adminFeedback || '');
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !request) return null;

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);
      await onStatusUpdate(request._id, type, status, feedback);
      toast.success(`Request ${status} successfully`);
      onClose();
    } catch (error) {
      toast.error('Error updating request status');
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Request Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {request.name}</p>
                <p><span className="font-medium">User:</span> {request.user.name} ({request.user.email})</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </p>
                <p><span className="font-medium">Submitted:</span> {new Date(request.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{request.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">
              {type === 'nft' ? 'NFT Details' : 'Bond Details'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'nft' ? (
                <>
                  <div className="text-sm">
                    <span className="font-medium">Price:</span> {request.price} ETH
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Quantity:</span> {request.quantity}
                  </div>
                  <div className="col-span-2"><span className="font-medium">Category:</span> {request.category || 'Other'}</div>
                  {request.imageUrl && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Image:</span>
                      <img
                        src={request.imageUrl}
                        alt={request.name}
                        className="mt-2 h-40 w-40 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-sm">
                    <span className="font-medium">Face Value:</span> {request.faceValue} ETH
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Interest Rate:</span> {request.interestRate}%
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Maturity Period:</span> {request.maturityPeriod} days
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Quantity:</span> {request.quantity}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Terms:</span>
                    <p className="text-sm text-gray-600 mt-1">{request.terms}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {request.adminFeedback && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Admin Feedback</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{request.adminFeedback}</p>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter feedback for the user..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updating}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {updating ? 'Processing...' : 'Approve & Create ' + (type === 'nft' ? 'NFT' : 'Bond')}
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {updating ? 'Processing...' : 'Reject Request'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RequestCard = ({ request, type, onStatusUpdate, onViewDetails, isSelected, onSelect }) => {
  const [feedback, setFeedback] = useState(request.adminFeedback || '');
  const [updating, setUpdating] = useState(false);

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

  const handleQuickAction = async (status) => {
    try {
      setUpdating(true);
      await onStatusUpdate(request._id, type, status, feedback);
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error('Error updating request status');
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onSelect(request._id)}
            className="mt-1 text-gray-400 hover:text-indigo-600"
          >
            {isSelected ? <FiCheckSquare className="text-indigo-600" /> : <FiSquare />}
          </button>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{request.name}</h3>
            <p className="text-sm text-gray-600">
              by {request.user.name} ({request.user.email})
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        {type === 'nft' ? (
          <>
            <div><span className="font-medium">Price:</span> {request.price} ETH</div>
            <div><span className="font-medium">Quantity:</span> {request.quantity}</div>
            <div className="col-span-2"><span className="font-medium">Category:</span> {request.category || 'Other'}</div>
          </>
        ) : (
          <>
            <div><span className="font-medium">Face Value:</span> {request.faceValue} ETH</div>
            <div><span className="font-medium">Interest:</span> {request.interestRate}%</div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(request)}
            className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            <FiEye className="mr-1" /> Details
          </button>
          {request.status === 'pending' && (
            <>
              <button
                onClick={() => handleQuickAction('approved')}
                disabled={updating}
                className="flex items-center px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded disabled:opacity-50"
              >
                ✓ Quick Approve
              </button>
              <button
                onClick={() => handleQuickAction('rejected')}
                disabled={updating}
                className="flex items-center px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded disabled:opacity-50"
              >
                ✗ Quick Reject
              </button>
            </>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(request.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const RequestManagement = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({ nftRequests: [], bondRequests: [] });
  const [activeTab, setActiveTab] = useState('nft');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/marketplace/all-requests');
      setRequests(response.data);
    } catch (error) {
      toast.error('Error fetching requests');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, type, status, feedback) => {
    try {
      await api.put('/marketplace/request-status', {
        requestId,
        requestType: type,
        status,
        adminFeedback: feedback
      });
      
      // If approved, we could also trigger NFT/Bond creation here
      if (status === 'approved') {
        try {
          // Call the create endpoint for the approved request
          const createEndpoint = type === 'nft' ? 
            `/marketplace/nfts/create-from-request/${requestId}` : 
            `/marketplace/bonds/create-from-request/${requestId}`;
          
          await api.post(createEndpoint);
          toast.success(`${type.toUpperCase()} created successfully on marketplace!`);
        } catch (createError) {
          console.error('Error creating NFT/Bond:', createError);
          toast.warning(`Request approved but ${type.toUpperCase()} creation failed. Please create manually.`);
        }
      }
      
      // Refresh requests after update
      await fetchRequests();
    } catch (error) {
      throw error;
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRequests.length === 0) {
      toast.warning('Please select requests first');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedRequests.length} request(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setLoading(true);
      const promises = selectedRequests.map(requestId => {
        const request = getCurrentRequests().find(r => r._id === requestId);
        return handleStatusUpdate(requestId, activeTab, action, `Bulk ${action} by admin`);
      });
      
      await Promise.all(promises);
      toast.success(`Successfully ${action}d ${selectedRequests.length} request(s)`);
      setSelectedRequests([]);
    } catch (error) {
      toast.error(`Error during bulk ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const exportRequests = () => {
    const currentRequests = getCurrentRequests();
    const csvContent = [
      ['Name', 'User', 'Email', 'Status', 'Created', 'Price/Value', 'Quantity'].join(','),
      ...currentRequests.map(request => [
        request.name,
        request.user.name,
        request.user.email,
        request.status,
        new Date(request.createdAt).toLocaleDateString(),
        activeTab === 'nft' ? request.price : request.faceValue,
        request.quantity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCurrentRequests = () => {
    return activeTab === 'nft' ? requests.nftRequests : requests.bondRequests;
  };

  const filteredAndSortedRequests = () => {
    let filtered = getCurrentRequests();
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(request => request.status === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    const currentRequests = filteredAndSortedRequests();
    if (selectedRequests.length === currentRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(currentRequests.map(r => r._id));
    }
  };

  const getStats = () => {
    const current = getCurrentRequests();
    return {
      total: current.length,
      pending: current.filter(r => r.status === 'pending').length,
      approved: current.filter(r => r.status === 'approved').length,
      rejected: current.filter(r => r.status === 'rejected').length
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const stats = getStats();
  const currentRequests = filteredAndSortedRequests();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Manage NFT & Bond Requests</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Review and manage user requests for creating NFTs and Bonds.
          </p>
        </div>
        <Link 
          to="/admin"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {selectedRequests.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction('approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve Selected ({selectedRequests.length})
                </button>
                <button
                  onClick={() => handleBulkAction('rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject Selected ({selectedRequests.length})
                </button>
              </>
            )}
            <button
              onClick={exportRequests}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FiDownload className="mr-2" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-dark-darker rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => {
                setActiveTab('nft');
                setSelectedRequests([]);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'nft'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              NFT Requests ({requests.nftRequests.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('bond');
                setSelectedRequests([]);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bond'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bond Requests ({requests.bondRequests.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {currentRequests.length > 0 && (
            <div className="mb-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                {selectedRequests.length === currentRequests.length ? <FiCheckSquare /> : <FiSquare />}
                <span className="ml-2">
                  {selectedRequests.length === currentRequests.length ? 'Deselect All' : 'Select All'}
                </span>
              </button>
            </div>
          )}

          <div className="space-y-4">
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  type={activeTab}
                  onStatusUpdate={handleStatusUpdate}
                  onViewDetails={(req) => {
                    setSelectedRequest(req);
                    setShowDetailModal(true);
                  }}
                  isSelected={selectedRequests.includes(request._id)}
                  onSelect={handleSelectRequest}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No requests match your search' : `No ${activeTab} requests found`}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm ? 'Try adjusting your search terms' : 
                   filter !== 'all' ? `No ${filter} requests found.` : 
                   `Users haven't submitted any ${activeTab} requests yet.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        type={activeTab}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRequest(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default RequestManagement;