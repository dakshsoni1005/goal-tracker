import express from 'express';
import {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  getActiveReminders,
} from '../controllers/reminderController.js';
import { protect } from '../middleware/auth.js';
import { createReminderValidator, updateReminderValidator } from '../validators/reminderValidator.js';

const router = express.Router();

router.use(protect);

// Specific routes first
router.get('/active', getActiveReminders);

router
  .route('/')
  .get(getReminders)
  .post(createReminderValidator, createReminder);

router
  .route('/:id')
  .get(getReminder)
  .patch(updateReminderValidator, updateReminder)
  .delete(deleteReminder);

export default router;
