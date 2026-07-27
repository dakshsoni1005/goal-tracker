import crypto from 'crypto';
import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sendTokenResponse } from '../utils/tokenHelper.js';
import { sendEmail, getWelcomeEmailTemplate, getPasswordResetEmailTemplate } from '../utils/emailHelper.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, timezone } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return sendError(res, 'User already exists with this email', 400);
  }

  // Create verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    timezone: timezone || 'UTC',
    verificationToken,
    verificationTokenExpiresAt,
  });

  // Verification URL
  const protocol = req.secure ? 'https' : 'http';
  const verificationUrl = `${protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;

  // Send Welcome & Verification Email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify your GoalFlow account',
      message: `Welcome to GoalFlow! Please verify your email by opening this link: ${verificationUrl}`,
      html: getWelcomeEmailTemplate(user.name, verificationUrl),
    });
  } catch (err) {
    console.error(`Email error on registration: ${err.message}`);
    // Do not fail registration if email fails, but log it
  }

  // Sign tokens and set cookies
  return sendTokenResponse(user, 201, res, 'User registered successfully. Verification email sent.');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 'Invalid credentials', 401);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid credentials', 401);
  }

  return sendTokenResponse(user, 200, res, 'Logged in successfully');
});

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
  });
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
  });

  return sendSuccess(res, 'Logged out successfully', {});
});

// @desc    Verify email token
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return sendError(res, 'Verification token is required', 400);
  }

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return sendError(res, 'Verification token is invalid or has expired', 400);
  }

  // Update user status
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  return sendSuccess(res, 'Email verified successfully', { isVerified: true });
});

// @desc    Forgot password - generate reset token & email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Return success to prevent enumeration attacks, but log in background
    return sendSuccess(res, 'If an account exists with that email, a password reset link has been sent.', {});
  }

  // Generate plain reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and store in PasswordResetToken model (expires in 10 minutes)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete existing tokens for this user
  await PasswordResetToken.deleteMany({ user: user._id });

  await PasswordResetToken.create({
    user: user._id,
    token: hashedToken,
    expiresAt,
  });

  // Password reset URL (frontend URL format can be configured in real production, using API fallback here)
  const protocol = req.secure ? 'https' : 'http';
  const resetUrl = `${protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'GoalFlow Password Reset Request',
      message: `You requested a password reset. Please click this link to reset your password: ${resetUrl}`,
      html: getPasswordResetEmailTemplate(user.name, resetUrl),
    });
    
    return sendSuccess(res, 'Password reset link sent to email.', {});
  } catch (err) {
    console.error(`Email error on reset: ${err.message}`);
    // Remove token on failure
    await PasswordResetToken.deleteOne({ token: hashedToken });
    return sendError(res, 'Email could not be sent. Please try again later.', 500);
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  if (!token) {
    return sendError(res, 'Reset token is required', 400);
  }

  // Hash query token to match DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const resetRecord = await PasswordResetToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  }).populate('user');

  if (!resetRecord || !resetRecord.user) {
    return sendError(res, 'Reset token is invalid or has expired', 400);
  }

  // Update password
  const user = resetRecord.user;
  user.password = password; // pre-save hook will hash it
  await user.save();

  // Delete reset record
  await resetRecord.deleteOne();

  return sendSuccess(res, 'Password reset successful. You can now log in.', {});
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  return sendSuccess(res, 'Profile retrieved successfully', user);
});

// @desc    Update user profile details
// @route   PATCH /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, timezone } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (timezone) user.timezone = timezone;

  await user.save();

  return sendSuccess(res, 'Profile updated successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    avatar: user.avatar,
    timezone: user.timezone,
  });
});

// @desc    Change password
// @route   PATCH /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  // Check if current password is correct
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return sendError(res, 'Incorrect current password', 400);
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  return sendSuccess(res, 'Password changed successfully', {});
});
