import { check } from 'express-validator';
import validate from '../middleware/validator.js';

export const createNoteValidator = [
  check('title', 'Title is required').notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').isLength({ max: 100 }),
  check('content', 'Content must be a string').optional().isString(),
  check('isPinned', 'isPinned must be a boolean').optional().isBoolean(),
  check('tags', 'Tags must be an array of strings').optional().isArray(),
  check('color', 'Color must be a string').optional().isString(),
  validate,
];

export const updateNoteValidator = [
  check('title', 'Title cannot be empty').optional().notEmpty().trim(),
  check('title', 'Title cannot be longer than 100 characters').optional().isLength({ max: 100 }),
  check('content', 'Content must be a string').optional().isString(),
  check('isPinned', 'isPinned must be a boolean').optional().isBoolean(),
  check('tags', 'Tags must be an array of strings').optional().isArray(),
  check('color', 'Color must be a string').optional().isString(),
  validate,
];
