import express from 'express';
import { 
  register, 
  registerAdmin, 
  login, 
  getMe, 
  connectWallet,
  verifySiteAccess,
  verifyEmail,
  resendVerification,
  updateKyc,
  forgotPassword,
  verifyResetToken,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/site-access', verifySiteAccess);
router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/connect-wallet', protect, connectWallet);
router.put('/kyc', protect, updateKyc);

export default router; 