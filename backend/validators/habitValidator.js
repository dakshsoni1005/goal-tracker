import { check } from 'express-validator';
import validate from '../middleware/validator.js';

export const createHabitValidator = [
  check('title', 'Title is required').notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').isLength({ max: 100 }),
  check('icon', 'Icon is required if provided').optional().notEmpty(),
  check('color', 'Color must be a valid hex color string').optional().isHexColor(),
  check('frequency', 'Frequency must be daily, weekly, or custom').optional().isIn(['daily', 'weekly', 'custom']),
  check('target', 'Target must be an integer of at least 1').optional().isInt({ min: 1 }),
  validate,
];

export const updateHabitValidator = [
  check('title', 'Title cannot be empty').optional().notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').optional().isLength({ max: 100 }),
  check('icon', 'Icon cannot be empty').optional().notEmpty(),
  check('color', 'Color must be a valid hex color string').optional().isHexColor(),
  check('frequency', 'Frequency must be daily, weekly, or custom').optional().isIn(['daily', 'weekly', 'custom']),
  check('target', 'Target must be an integer of at least 1').optional().isInt({ min: 1 }),
  validate,
];
