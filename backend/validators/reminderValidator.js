import { check } from 'express-validator';
import validate from '../middleware/validator.js';

export const createReminderValidator = [
  check('title', 'Title is required').notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').isLength({ max: 100 }),
  check('type', 'Type must be email, browser, or both').optional().isIn(['email', 'browser', 'both']),
  check('triggerTime', 'Trigger time is required and must be a valid ISO8601 date').notEmpty().isISO8601(),
  check('frequency', 'Frequency must be once, daily, or weekly').optional().isIn(['once', 'daily', 'weekly']),
  check('goal', 'Goal ID must be a valid MongoDB ID if provided').optional().isMongoId(),
  check('habit', 'Habit ID must be a valid MongoDB ID if provided').optional().isMongoId(),
  validate,
];

export const updateReminderValidator = [
  check('title', 'Title cannot be empty').optional().notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').optional().isLength({ max: 100 }),
  check('type', 'Type must be email, browser, or both').optional().isIn(['email', 'browser', 'both']),
  check('triggerTime', 'Trigger time must be a valid ISO8601 date').optional().isISO8601(),
  check('frequency', 'Frequency must be once, daily, or weekly').optional().isIn(['once', 'daily', 'weekly']),
  check('status', 'Status must be pending, sent, or failed').optional().isIn(['pending', 'sent', 'failed']),
  check('goal', 'Goal ID must be a valid MongoDB ID').optional().isMongoId(),
  check('habit', 'Habit ID must be a valid MongoDB ID').optional().isMongoId(),
  validate,
];
