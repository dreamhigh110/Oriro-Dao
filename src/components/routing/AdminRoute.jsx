import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  // If not logged in or not admin, redirect to login with the current location
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but not admin, redirect to dashboard with access denied message
  if (!isAdmin()) {
    return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
  }

  // If admin, render the child routes
  return <Outlet />;
};

export default AdminRoute; 