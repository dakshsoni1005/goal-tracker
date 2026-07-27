import express from 'express';
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  resetHabit,
  getHabitStreak,
  getHabitStats,
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';
import { createHabitValidator, updateHabitValidator } from '../validators/habitValidator.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getHabits)
  .post(createHabitValidator, createHabit);

// Nested detail actions
router.patch('/:id/complete', completeHabit);
router.patch('/:id/reset', resetHabit);
router.get('/:id/streak', getHabitStreak);
router.get('/:id/stats', getHabitStats);

router
  .route('/:id')
  .get(getHabit)
  .patch(updateHabitValidator, updateHabit)
  .delete(deleteHabit);

export default router;
