import express from 'express';
import {
  getDashboardAnalytics,
  getMonthlyAnalytics,
  getYearlyAnalytics,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);
router.get('/monthly', getMonthlyAnalytics);
router.get('/yearly', getYearlyAnalytics);

export default router;
