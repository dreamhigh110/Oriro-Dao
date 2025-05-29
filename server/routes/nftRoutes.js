import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getAllNFTs,
  getMyNFTs,
  getNFTDetails,
  purchaseNFT,
  createNFTFromRequest,
  getNFTCategories,
  transferNFT
} from '../controllers/nftController.js';

const router = express.Router();

// Public routes
router.get('/nfts', getAllNFTs);
router.get('/nfts/categories', getNFTCategories);
router.get('/nfts/:nftId', getNFTDetails);

// Protected routes
router.get('/my-nfts', protect, getMyNFTs);
router.post('/nfts/:nftId/purchase', protect, purchaseNFT);
router.post('/nfts/holdings/:holdingId/transfer', protect, transferNFT);

// Admin routes
router.post('/nfts/create-from-request/:requestId', protect, admin, createNFTFromRequest);

export default router;