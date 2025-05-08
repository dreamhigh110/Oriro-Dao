import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiUserCheck, FiUserX, FiUser, FiCheck, FiX, FiLoader, FiFile, FiExternalLink } from 'react-icons/fi';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import DocumentViewer from './DocumentViewer';

const KycManager = () => {
  const { token } = useAuth();
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [documents, setDocuments] = useState({
    idDocument: null,
    addressDocument: null
  });

  useEffect(() => {
    fetchKycRequests();
  }, [token]);

  const fetchKycRequests = async () => {
    try {
      console.log('Fetching KYC requests...');
      setLoading(true);
      const response = await api.get('/admin/kyc-requests');
      console.log('KYC requests data:', response.data);
      
      setKycRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch KYC requests', error);
      toast.error(error.response?.data?.message || 'Failed to load KYC requests');
      setLoading(false);
    }
  };

  // Function to extract file name from path
  const getFileName = (filePath) => {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  // Function to handle viewing user details and documents
  const handleViewDetails = async (user) => {
    setViewDetails(user);
    setDocuments({
      idDocument: null,
      addressDocument: null
    });

    try {
      // If the user has KYC documents, load them
      if (user.kycDocuments) {
        setDocuments({
          idDocument: user.kycDocuments.idDocument || null,
          addressDocument: user.kycDocuments.addressDocument || null
        });
      }
    } catch (error) {
      console.error('Failed to load documents', error);
      toast.error('Failed to load user documents');
    }
  };

  const handleApprove = async (userId) => {
    try {
      console.log(`Approving KYC for user: ${userId}`);
      setProcessingId(userId);
      
      const response = await api.put(`/admin/kyc-requests/${userId}`, {
        status: 'approved',
      });
      
      console.log('Approval response:', response.data);
      if (response.data.success) {
        toast.success('KYC approved successfully');
        setKycRequests(prev => prev.filter(user => user._id !== userId));
        setViewDetails(null);
      }
      
      setProcessingId(null);
    } catch (error) {
      console.error('Failed to approve KYC', error);
      toast.error(error.response?.data?.message || 'Failed to approve KYC');
      setProcessingId(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      console.log(`Rejecting KYC for user: ${userId}, reason: ${rejectReason}`);
      setProcessingId(userId);
      
      const response = await api.put(`/admin/kyc-requests/${userId}`, {
        status: 'rejected',
        message: rejectReason,
      });
      
      console.log('Rejection response:', response.data);
      if (response.data.success) {
        toast.success('KYC rejected');
        setKycRequests(prev => prev.filter(user => user._id !== userId));
        setViewDetails(null);
        setRejectReason('');
      }
      
      setProcessingId(null);
    } catch (error) {
      console.error('Failed to reject KYC', error);
      toast.error(error.response?.data?.message || 'Failed to reject KYC');
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6"
    >
      <div className="flex items-center mb-6">
        <FiUserCheck className="text-2xl text-primary mr-2" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">KYC Verification Requests</h2>
      </div>

      {kycRequests.length === 0 ? (
        <div className="bg-gray-50 dark:bg-dark rounded-lg p-8 text-center">
          <FiUserCheck className="mx-auto text-4xl text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">No pending KYC verification requests.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Documents
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-darker divide-y divide-gray-200 dark:divide-gray-700">
              {kycRequests.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full">
                        <FiUser className="text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user._id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.contactPhone ? `Phone: ${user.contactPhone}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.kycDocuments ? (
                        <div className="flex items-center space-x-1">
                          <FiFile className="text-primary" />
                          <span>{user.kycDocuments.idDocument ? 'ID Document' : 'Missing'}</span>
                          {user.kycDocuments.addressDocument && (
                            <>
                              <span className="text-gray-400 mx-1">|</span>
                              <FiFile className="text-primary" />
                              <span>Address Document</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-500">No documents</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.kycDocuments && user.kycDocuments.submittedAt ? (
                        new Date(user.kycDocuments.submittedAt).toLocaleDateString()
                      ) : (
                        new Date(user.updatedAt).toLocaleDateString()
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="text-primary-light hover:text-primary-dark dark:text-primary-light dark:hover:text-primary mr-3"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApprove(user._id)}
                      disabled={processingId === user._id}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-3 disabled:opacity-50"
                    >
                      {processingId === user._id ? (
                        <FiLoader className="animate-spin inline" />
                      ) : (
                        <FiCheck className="inline" />
                      )} Approve
                    </button>
                    <button
                      onClick={() => setViewDetails({ ...user, showReject: true })}
                      disabled={processingId === user._id}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      <FiX className="inline" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-dark-darker rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                KYC Verification Details
              </h3>
              <button 
                onClick={() => {
                  setViewDetails(null);
                  setRejectReason('');
                  setDocuments({ idDocument: null, addressDocument: null });
                }}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDetails.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDetails.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Phone</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {viewDetails.contactPhone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewDetails._id}</p>
                </div>
                {viewDetails.kycDocuments && viewDetails.kycDocuments.submittedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submission Date</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(viewDetails.kycDocuments.submittedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* KYC Documents Section */}
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">KYC Documents</h4>
              
              {viewDetails.kycDocuments ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.idDocument ? (
                    <DocumentViewer 
                      documentPath={documents.idDocument} 
                      documentName={getFileName(documents.idDocument)}
                      type="id"
                    />
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <FiFile className="mr-2" />
                      <span>ID Document not available</span>
                    </div>
                  )}
                  
                  {documents.addressDocument ? (
                    <DocumentViewer 
                      documentPath={documents.addressDocument} 
                      documentName={getFileName(documents.addressDocument)}
                      type="address"
                    />
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <FiFile className="mr-2" />
                      <span>Address Document not available</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No KYC documents available</p>
                </div>
              )}

              {viewDetails.showReject && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark dark:text-white"
                    placeholder="Provide a reason for rejection"
                  ></textarea>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setViewDetails(null);
                  setRejectReason('');
                  setDocuments({ idDocument: null, addressDocument: null });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-dark-lighter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Close
              </button>
              {viewDetails.showReject ? (
                <button
                  onClick={() => handleReject(viewDetails._id)}
                  disabled={processingId === viewDetails._id || !rejectReason.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {processingId === viewDetails._id ? (
                    <>
                      <FiLoader className="animate-spin inline mr-1" />
                      Processing...
                    </>
                  ) : (
                    <>Confirm Rejection</>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleApprove(viewDetails._id)}
                  disabled={processingId === viewDetails._id}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {processingId === viewDetails._id ? (
                    <>
                      <FiLoader className="animate-spin inline mr-1" />
                      Processing...
                    </>
                  ) : (
                    <>Approve KYC</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default KycManager; 