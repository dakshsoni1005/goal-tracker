import { check } from 'express-validator';
import validate from '../middleware/validator.js';

export const createGoalValidator = [
  check('title', 'Title is required').notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').isLength({ max: 100 }),
  check('category', 'Category ID must be a valid MongoDB ID').isMongoId(),
  check('priority', 'Priority must be low, medium, or high').optional().isIn(['low', 'medium', 'high']),
  check('dueDate', 'Due date is required and must be a valid ISO8601 date').notEmpty().isISO8601(),
  check('estimatedMinutes', 'Estimated minutes must be a non-negative integer').optional().isInt({ min: 0 }),
  check('tags', 'Tags must be an array of strings').optional().isArray(),
  check('reminder', 'Reminder must be a boolean').optional().isBoolean(),
  validate,
];

export const updateGoalValidator = [
  check('title', 'Title cannot be empty').optional().notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').optional().isLength({ max: 100 }),
  check('category', 'Category ID must be a valid MongoDB ID').optional().isMongoId(),
  check('priority', 'Priority must be low, medium, or high').optional().isIn(['low', 'medium', 'high']),
  check('dueDate', 'Due date must be a valid ISO8601 date').optional().isISO8601(),
  check('estimatedMinutes', 'Estimated minutes must be a non-negative integer').optional().isInt({ min: 0 }),
  check('tags', 'Tags must be an array of strings').optional().isArray(),
  check('reminder', 'Reminder must be a boolean').optional().isBoolean(),
  check('status', 'Status must be pending or completed').optional().isIn(['pending', 'completed']),
  validate,
];
