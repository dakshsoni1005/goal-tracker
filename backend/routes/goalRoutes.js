import express from 'express';
import {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  archiveGoal,
  unarchiveGoal,
  getTodayGoals,
  getUpcomingGoals,
  getOverdueGoals,
  searchGoals,
} from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';
import { createGoalValidator, updateGoalValidator } from '../validators/goalValidator.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Specific routes first to prevent conflicts with :id parameter
router.get('/today', getTodayGoals);
router.get('/upcoming', getUpcomingGoals);
router.get('/overdue', getOverdueGoals);
router.get('/search', searchGoals);

// Core CRUD routes
router
  .route('/')
  .get(getGoals)
  .post(createGoalValidator, createGoal);

router
  .route('/:id')
  .get(getGoal)
  .patch(updateGoalValidator, updateGoal)
  .delete(deleteGoal);

// Action triggers
router.patch('/:id/complete', completeGoal);
router.patch('/:id/archive', archiveGoal);
router.patch('/:id/unarchive', unarchiveGoal);

export default router;
