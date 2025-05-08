import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiSettings, FiActivity, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SiteAccessManager from '../components/admin/SiteAccessManager';
import KycManager from '../components/admin/KycManager';

const Dashboard = () => {
  const { currentUser: user, token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    userCount: 0,
    adminCount: 0,
    walletConnectedCount: 0,
    kycStats: {
      pending: 0,
      approved: 0,
      rejected: 0
    },
    newUserCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminStats();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchAdminStats = async () => {
    try {
      const response = await axios.get('/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'site-access':
        return <SiteAccessManager />;
      case 'kyc':
        return <KycManager />;
      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Stats Card */}
            <div className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <FiUsers className="h-8 w-8" />
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Users</p>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</h2>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div>Regular Users</div>
                  <div>{stats.userCount}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div>Admins</div>
                  <div>{stats.adminCount}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div>New (Last 7 days)</div>
                  <div>{stats.newUserCount}</div>
                </div>
              </div>
            </div>

            {/* KYC Stats Card */}
            <div className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <FiUserCheck className="h-8 w-8" />
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">KYC Verifications</p>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {stats.kycStats?.pending || 0}
                    </h2>
                    <span className="ml-2 text-sm font-medium text-yellow-500">Pending</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div>Approved</div>
                  <div>{stats.kycStats?.approved || 0}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div>Rejected</div>
                  <div>{stats.kycStats?.rejected || 0}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div>Connected Wallets</div>
                  <div>{stats.walletConnectedCount}</div>
                </div>
              </div>
            </div>

            {/* Site Status Card */}
            <div className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <FiSettings className="h-8 w-8" />
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Site Status</p>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {stats.siteSettings?.siteAccessEnabled ? 'Restricted' : 'Open'}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div>Access Control</div>
                  <div className={`font-medium ${stats.siteSettings?.siteAccessEnabled ? 'text-yellow-500' : 'text-green-500'}`}>
                    {stats.siteSettings?.siteAccessEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div>Registration</div>
                  <div className={`font-medium ${stats.siteSettings?.registrationEnabled ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.siteSettings?.registrationEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('site-access')}
                  className="mt-4 w-full px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors text-sm font-medium"
                >
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Regular user dashboard
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
        <div className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Welcome, {user?.firstName}!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            This is your personal dashboard. Here you can manage your account, transactions, and more.
          </p>
          
          {/* User dashboard content would go here */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Account Status</h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                Email Verification: {user?.emailVerified ? 'Verified' : 'Pending'}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user?.kycStatus === 'approved' ? 'bg-green-500' : user?.kycStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                KYC Status: {user?.kycStatus === 'approved' ? 'Approved' : user?.kycStatus === 'pending' ? 'Pending' : 'Not Started'}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user?.walletConnected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                Wallet: {user?.walletConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Activity</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No recent activity.
              </p>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors">
                  Complete Profile
                </button>
                {!user?.walletConnected && (
                  <button className="w-full px-3 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors">
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('site-access')}
              className={`${
                activeTab === 'site-access'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Site Access
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`${
                activeTab === 'kyc'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              KYC Management
            </button>
          </nav>
        </div>
      </div>
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default Dashboard; 