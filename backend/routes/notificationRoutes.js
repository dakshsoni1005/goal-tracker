import express from 'express';
import {
  getNotifications,
  readNotification,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Specific paths before dynamic matcher
router.get('/unread-count', getUnreadCount);

router.get('/', getNotifications);
router.patch('/:id/read', readNotification);
router.delete('/:id', deleteNotification);

export default router;
