import Reminder from '../models/Reminder.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { getPaginationResults } from '../utils/pagination.js';

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
export const getReminders = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;

  const filter = { user: req.user.id };
  if (status) {
    filter.status = status;
  }

  const results = await getPaginationResults(
    Reminder,
    filter,
    page,
    limit,
    ['goal', 'habit'],
    { triggerTime: 1 }
  );

  return sendSuccess(res, 'Reminders retrieved successfully', results);
});

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
export const getReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id).populate(['goal', 'habit']);

  if (!reminder) {
    return sendError(res, 'Reminder not found', 404);
  }

  if (reminder.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to access this reminder', 403);
  }

  return sendSuccess(res, 'Reminder retrieved successfully', reminder);
});

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = asyncHandler(async (req, res) => {
  const { title, type, triggerTime, frequency, goal, habit } = req.body;

  const reminder = await Reminder.create({
    title,
    type: type || 'email',
    triggerTime,
    frequency: frequency || 'once',
    status: 'pending',
    goal: goal || undefined,
    habit: habit || undefined,
    user: req.user.id,
  });

  return sendSuccess(res, 'Reminder created successfully', reminder, 201);
});

// @desc    Update reminder details
// @route   PATCH /api/reminders/:id
// @access  Private
export const updateReminder = asyncHandler(async (req, res) => {
  const updates = req.body;

  let reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    return sendError(res, 'Reminder not found', 404);
  }

  if (reminder.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to update this reminder', 403);
  }

  reminder = await Reminder.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 'Reminder updated successfully', reminder);
});

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    return sendError(res, 'Reminder not found', 404);
  }

  if (reminder.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to delete this reminder', 403);
  }

  await reminder.deleteOne();

  return sendSuccess(res, 'Reminder deleted successfully', {});
});

// @desc    Get active/pending reminders for browser polling (Browser Reminder Ready)
// @route   GET /api/reminders/active
// @access  Private
export const getActiveReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({
    user: req.user.id,
    status: 'pending',
    triggerTime: { $lte: new Date(Date.now() + 5 * 60 * 1000) }, // due within next 5 minutes
  }).populate(['goal', 'habit']);

  return sendSuccess(res, 'Active browser-ready reminders retrieved successfully', reminders);
});
