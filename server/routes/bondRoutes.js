import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getAllBonds,
  getMyBonds,
  purchaseBond,
  createBondFromRequest,
  checkBondMaturity
} from '../controllers/bondController.js';

const router = express.Router();

// Public routes
router.get('/bonds', getAllBonds);

// Protected routes
router.get('/my-bonds', protect, getMyBonds);
router.post('/bonds/:bondId/purchase', protect, purchaseBond);

// Admin routes
router.post('/bonds/create-from-request/:requestId', protect, admin, createBondFromRequest);
router.post('/bonds/check-maturity', protect, admin, checkBondMaturity);

export default router;