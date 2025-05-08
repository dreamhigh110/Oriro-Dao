import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getDashboardStats,
  updateSiteSettings,
  getSiteSettings,
  generateAccessPassword,
  getKycRequests,
  updateKycStatus
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect, admin);

// User management routes
router.route('/users').get(getUsers);
router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Dashboard and analytics
router.get('/dashboard', getDashboardStats);

// Site settings
router.route('/site-settings')
  .get(getSiteSettings)
  .put(updateSiteSettings);
router.post('/generate-access-password', generateAccessPassword);

// KYC management
router.get('/kyc-requests', getKycRequests);
router.put('/kyc-requests/:id', updateKycStatus);

export default router; 