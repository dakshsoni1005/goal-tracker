import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { getPaginationResults } from '../utils/pagination.js';

// @desc    Get user notifications (paginated)
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const results = await getPaginationResults(
    Notification,
    { user: req.user.id },
    page,
    limit,
    [],
    { createdAt: -1 }
  );

  return sendSuccess(res, 'Notifications retrieved successfully', results);
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const readNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return sendError(res, 'Notification not found', 404);
  }

  if (notification.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to modify this notification', 403);
  }

  notification.isRead = true;
  await notification.save();

  return sendSuccess(res, 'Notification marked as read successfully', notification);
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return sendError(res, 'Notification not found', 404);
  }

  if (notification.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to delete this notification', 403);
  }

  await notification.deleteOne();

  return sendSuccess(res, 'Notification deleted successfully', {});
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false,
  });

  return sendSuccess(res, 'Unread notifications count retrieved successfully', { count });
});
