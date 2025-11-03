import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createNFTRequest,
  createBondRequest,
  createTokenRequest,
  getUserRequests,
  getAllRequests,
  getApprovedTokens,
  updateRequestStatus,
  uploadNFTImage
} from '../controllers/marketplaceController.js';

const router = express.Router();

// Public routes
router.get('/tokens', getApprovedTokens);

// User routes
router.post('/nft-request', protect, createNFTRequest);
router.post('/bond-request', protect, createBondRequest);
router.post('/token-request', protect, createTokenRequest);
router.get('/user-requests', protect, getUserRequests);

// Admin routes
router.get('/all-requests', protect, admin, getAllRequests);
router.put('/request-status', protect, admin, updateRequestStatus);

// NFT image upload route
router.post('/upload', protect, uploadNFTImage);

export default router;