import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getExchangeRates,
  initiateCryptoToFiat,
  initiateFiatToCrypto,
  getExchangeStatus,
  getExchangeHistory,
  cancelExchange
} from '../controllers/exchangeController.js';

const router = express.Router();

// Public routes
router.get('/rates', getExchangeRates);

// Protected routes
router.use(protect);
router.post('/crypto-to-fiat', initiateCryptoToFiat);
router.post('/fiat-to-crypto', initiateFiatToCrypto);
router.get('/:exchangeId/status', getExchangeStatus);
router.get('/history', getExchangeHistory);
router.post('/:exchangeId/cancel', cancelExchange);

export default router; 