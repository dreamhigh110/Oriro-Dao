import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('oriroToken') || null);
  
  // Set auth token header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setCurrentUser(res.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          // If token is invalid, remove it
          localStorage.removeItem('oriroToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Helper method to check if current user is an admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // Login function
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setCurrentUser(res.data);
    setToken(res.data.token);
    localStorage.setItem('oriroToken', res.data.token);
    return res.data;
  };

  // Register function
  const register = async (firstName, lastName, middleName, companyName, email, password) => {
    const res = await api.post('/auth/register', { 
      firstName, 
      lastName, 
      middleName, 
      companyName, 
      email, 
      password 
    });
    setCurrentUser(res.data);
    setToken(res.data.token);
    localStorage.setItem('oriroToken', res.data.token);
    return res.data;
  };

  // Register admin function (development only)
  const registerAdmin = async (name, email, password, adminSecret) => {
    const res = await api.post('/auth/register-admin', { name, email, password, adminSecret });
    setCurrentUser(res.data);
    setToken(res.data.token);
    localStorage.setItem('oriroToken', res.data.token);
    return res.data;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('oriroToken');
    return Promise.resolve();
  };

  // Connect wallet function
  const connectWallet = async (walletAddress = "0x...") => {
    if (!currentUser) return Promise.reject('User not logged in');
    
    try {
      const res = await api.put('/auth/connect-wallet', { walletAddress });
      const updatedUser = res.data;
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Connect wallet error:', error);
      return Promise.reject(error.response?.data?.message || 'Failed to connect wallet');
    }
  };

  const value = {
    currentUser,
    login,
    register,
    registerAdmin,
    logout,
    connectWallet,
    loading,
    token,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 