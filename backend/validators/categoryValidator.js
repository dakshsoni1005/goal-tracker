import { check } from 'express-validator';
import validate from '../middleware/validator.js';

export const createCategoryValidator = [
  check('name', 'Category name is required').notEmpty().trim(),
  check('name', 'Category name cannot be longer than 30 characters').isLength({ max: 30 }),
  check('color', 'Color must be a string').optional().isString(),
  check('icon', 'Icon must be a string').optional().isString(),
  validate,
];

export const updateCategoryValidator = [
  check('name', 'Category name cannot be empty').optional().notEmpty().trim(),
  check('name', 'Category name cannot be longer than 30 characters').optional().isLength({ max: 30 }),
  check('color', 'Color must be a string').optional().isString(),
  check('icon', 'Icon must be a string').optional().isString(),
  validate,
];
