import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiUsers, FiSettings, FiUserCheck, FiPackage, FiFileText, FiHome } from 'react-icons/fi';

const StatCard = ({ title, value, icon, bgColor }) => (
  <div className={`p-6 rounded-lg shadow-md ${bgColor}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <h2 className="mt-2 text-3xl font-semibold">{value}</h2>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching admin dashboard stats...');
        const res = await api.get('/admin/dashboard');
        console.log('Dashboard stats response:', res.data);
        setStats(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {currentUser?.name}! Here's an overview of your platform.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon="👥" 
          bgColor="bg-white dark:bg-dark-darker" 
        />
        <StatCard 
          title="Admin Users" 
          value={stats?.adminCount || 0} 
          icon="🔑" 
          bgColor="bg-white dark:bg-dark-darker" 
        />
        <StatCard 
          title="Connected Wallets" 
          value={stats?.walletConnectedCount || 0} 
          icon="👛" 
          bgColor="bg-white dark:bg-dark-darker" 
        />
        <StatCard 
          title="New Users (7d)" 
          value={stats?.newUserCount || 0} 
          icon="🆕" 
          bgColor="bg-white dark:bg-dark-darker" 
        />
      </div>
      
      <div className="bg-white dark:bg-dark-darker rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/users"
            className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark hover:shadow-md transition-all duration-200 text-center w-full"
          >
            <FiUsers className="mr-2" /> Manage Users
          </Link>
          
          <Link 
            to="/admin/settings"
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 hover:shadow-md transition-all duration-200 text-center w-full"
          >
            <FiSettings className="mr-2" /> Platform Settings
          </Link>

          <Link 
            to="/admin/homepage"
            className="flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 hover:shadow-md transition-all duration-200 text-center w-full"
          >
            <FiHome className="mr-2" /> Homepage Settings
          </Link>
          
          <Link 
            to="/admin/kyc"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200 text-center w-full"
          >
            <FiUserCheck className="mr-2" /> KYC Management
          </Link>

          <Link 
            to="/admin/requests"
            className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 hover:shadow-md transition-all duration-200 text-center w-full"
          >
            <FiPackage className="mr-2" /> NFT/Bond Requests
          </Link>

          <Link 
            to="/admin/content"
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:shadow-md transition-all duration-200 text-center w-full"
          >
            <FiFileText className="mr-2" /> Content Management
          </Link>
        </div>
      </div>
    </div>
  );
}; 