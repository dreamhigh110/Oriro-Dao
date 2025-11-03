import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmailVerification from './components/auth/EmailVerification';
import ConnectWalletButton from './components/wallet/ConnectWalletButton';
import Dashboard from './pages/Dashboard';
import Staking from './pages/Staking';
import Governance from './pages/Governance';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import EditUser from './components/admin/EditUser';
import RegisterAdmin from './components/admin/RegisterAdmin';
import SiteSettings from './components/admin/SiteSettings';
import KycManager from './components/admin/KycManager';
import RequestManagement from './components/admin/RequestManagement';
import ContentManagement from './components/admin/ContentManagement';
import HomepageSettings from './components/admin/HomepageSettings';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BlockchainProvider } from './context/BlockchainContext';
import SiteAccessGate from './components/auth/SiteAccessGate';
import KycForm from './components/profile/KycForm';
import ProfileLayout from './components/profile/ProfileLayout';
import api from './utils/api';
import WalletProvider from './providers/WalletProvider';
import ProfileEdit from './components/profile/ProfileEdit';
import UserSettings from './components/profile/UserSettings';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import MarketplaceLayout from './components/marketplace/MarketplaceLayout';
import Marketplace from './components/marketplace/Marketplace';
import MyCollection from './components/marketplace/MyCollection';
import NFTRequestForm from './components/marketplace/NFTRequestForm';
import UserRequestsDashboard from './components/marketplace/UserRequestsDashboard';
import Bonds from './components/marketplace/Bonds';
import MyBonds from './components/marketplace/MyBonds';
import BondRequestForm from './components/marketplace/BondRequestForm';
import Tokens from './components/marketplace/Tokens';
import TokenRequestForm from './components/marketplace/TokenRequestForm';
// New page imports
import Documentation from './pages/Documentation';
import Whitepaper from './pages/Whitepaper';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Contact from './pages/Contact';
import { ExchangeProvider } from './context/ExchangeContext';
import Exchange from './pages/Exchange';

function App() {
  const [isSiteAccessRequired, setIsSiteAccessRequired] = useState(false);
  const [isCheckingSiteAccess, setIsCheckingSiteAccess] = useState(true);
  
  // Check site access on first load
  useEffect(() => {
    const checkSiteAccess = async () => {
      try {
        setIsCheckingSiteAccess(true);
        console.log('Checking site access...');
        
        // Check if we have a site access token in local storage
        const siteAccessToken = localStorage.getItem('siteAccessToken');
        const headers = {};
        
        if (siteAccessToken) {
          console.log('Found site access token in localStorage');
          headers['x-site-access-token'] = siteAccessToken;
          
          try {
            // Only validate the token if it exists
            console.log('Making request to /health endpoint with token');
            await api.get('/health', { headers });
            
            // If successful with token, access is granted
            console.log('Token is valid, access granted');
            setIsSiteAccessRequired(false);
          } catch (tokenError) {
            console.log('Token validation error:', tokenError);
            // Token is invalid, remove it
            localStorage.removeItem('siteAccessToken');
            // Force site access requirement
            console.log('Token is invalid, site access is required');
            setIsSiteAccessRequired(true);
          }
        } else {
          console.log('No site access token found in localStorage');
          // No token found, always require site access
          console.log('No token, site access is required');
          setIsSiteAccessRequired(true);
        }
      } catch (error) {
        console.log('Site access error:', error);
        console.log('Error response:', error.response?.data);
        
        // Default to requiring access on any errors
        console.log('Error occurred, defaulting to require site access');
        setIsSiteAccessRequired(true);
      } finally {
        setIsCheckingSiteAccess(false);
      }
    };
    
    checkSiteAccess();
  }, []);
  
  // Set up axios interceptor for site access token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const siteAccessToken = localStorage.getItem('siteAccessToken');
        if (siteAccessToken) {
          config.headers['x-site-access-token'] = siteAccessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);
  
  if (isCheckingSiteAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (isSiteAccessRequired) {
    return (
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="*" element={<SiteAccessGate />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
          <BlockchainProvider>
            <ExchangeProvider>
              <Router>
                <Routes>
                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/register-admin" element={<RegisterAdmin />} />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  <Route path="/verify-email/:token" element={<EmailVerification />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<Layout />}>
                    <Route element={<AdminRoute />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="users/:id/edit" element={<EditUser />} />
                      <Route path="settings" element={<SiteSettings />} />
                      <Route path="homepage" element={<HomepageSettings />} />
                      <Route path="kyc" element={<KycManager />} />
                      <Route path="requests" element={<RequestManagement />} />
                      <Route path="content" element={<ContentManagement />} />
                    </Route>
                  </Route>
                  
                  {/* Main layout routes */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    
                    {/* Protected routes */}
                    <Route path="dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Marketplace routes */}
                    <Route path="marketplace" element={<MarketplaceLayout />}>
                      <Route index element={<Marketplace />} />
                      <Route path="collection" element={
                        <ProtectedRoute>
                          <MyCollection />
                        </ProtectedRoute>
                      } />
                      <Route path="bonds" element={<Bonds />} />
                      <Route path="my-bonds" element={
                        <ProtectedRoute>
                          <MyBonds />
                        </ProtectedRoute>
                      } />
                      <Route path="tokens" element={<Tokens />} />
                      <Route path="create-nft" element={
                        <ProtectedRoute>
                          <NFTRequestForm />
                        </ProtectedRoute>
                      } />
                      <Route path="create-bond" element={
                        <ProtectedRoute>
                          <BondRequestForm />
                        </ProtectedRoute>
                      } />
                      <Route path="create-token" element={
                        <ProtectedRoute>
                          <TokenRequestForm />
                        </ProtectedRoute>
                      } />
                      <Route path="my-requests" element={
                        <ProtectedRoute>
                          <UserRequestsDashboard />
                        </ProtectedRoute>
                      } />
                    </Route>
                    
                    <Route path="staking" element={
                      <ProtectedRoute>
                        <Staking />
                      </ProtectedRoute>
                    } />
                    <Route path="governance" element={
                      <ProtectedRoute>
                        <Governance />
                      </ProtectedRoute>
                    } />
                    
                    {/* Wallet connection (protected) */}
                    <Route path="connect-wallet" element={
                      <ProtectedRoute>
                        <div className="container mx-auto py-12 px-4">
                          <h1 className="text-3xl font-display font-bold mb-8">Connect Your Wallet</h1>
                          <div className="bg-white dark:bg-dark-light p-6 rounded-lg shadow-md">
                            <p className="mb-6">Connect your Web3 wallet to interact with the Oriro platform.</p>
                            <ConnectWalletButton />
                          </div>
                        </div>
                      </ProtectedRoute>
                    } />
                    
                    {/* User profile routes (protected) */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <ProfileLayout />
                      </ProtectedRoute>
                    }>
                      <Route path="profile" element={<KycForm />} />
                      <Route path="profile/edit" element={<ProfileEdit />} />
                      <Route path="settings" element={<UserSettings />} />
                    </Route>

                    {/* Public pages */}
                    <Route path="docs" element={<Documentation />} />
                    <Route path="whitepaper" element={<Whitepaper />} />
                    <Route path="support" element={<Support />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<TermsOfService />} />
                    <Route path="cookies" element={<CookiePolicy />} />
                    <Route path="contact" element={<Contact />} />
                    
                    <Route path="exchange" element={
                      <ProtectedRoute>
                        <Exchange />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </Router>
              <ToastContainer position="bottom-right" />
            </ExchangeProvider>
          </BlockchainProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
