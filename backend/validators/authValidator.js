import { check } from 'express-validator';
import validate from '../middleware/validator.js';

export const registerValidator = [
  check('name', 'Name is required').notEmpty().trim(),
  check('name', 'Name cannot be longer than 50 characters').isLength({ max: 50 }),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate,
];

export const loginValidator = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty(),
  validate,
];

export const forgotPasswordValidator = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  validate,
];

export const resetPasswordValidator = [
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate,
];

export const updateProfileValidator = [
  check('name', 'Name cannot be empty').optional().notEmpty().trim(),
  check('name', 'Name cannot be longer than 50 characters').optional().isLength({ max: 50 }),
  check('timezone', 'Timezone must be a string').optional().isString(),
  validate,
];

export const changePasswordValidator = [
  check('currentPassword', 'Current password is required').notEmpty(),
  check('newPassword', 'New password must be at least 6 characters long').isLength({ min: 6 }),
  validate,
];
