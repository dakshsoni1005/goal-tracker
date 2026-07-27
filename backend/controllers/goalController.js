import Goal from '../models/Goal.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { getPaginationResults } from '../utils/pagination.js';
import { getFormattedDate } from '../utils/dateHelper.js';

// @desc    Get all goals (with filtering, pagination, sorting)
// @route   GET /api/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
  const { category, priority, status, isArchived, tags, sortBy, order, page, limit } = req.query;

  // Build filter object
  const filter = { user: req.user.id };

  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (status) filter.status = status;
  
  // By default, filter out archived goals unless isArchived is explicitly sent
  if (isArchived !== undefined) {
    filter.isArchived = isArchived === 'true';
  } else {
    filter.isArchived = false;
  }

  // Tags filtering (supports comma separated tags, e.g. tags=work,health)
  if (tags) {
    const tagsArray = tags.split(',').map(t => t.trim());
    filter.tags = { $in: tagsArray };
  }

  // Sorting
  let sortOptions = { createdAt: -1 }; // default sorting
  if (sortBy) {
    const sortOrder = order === 'asc' ? 1 : -1;
    sortOptions = { [sortBy]: sortOrder };
  }

  const paginatedResults = await getPaginationResults(
    Goal,
    filter,
    page,
    limit,
    ['category'],
    sortOptions
  );

  return sendSuccess(res, 'Goals retrieved successfully', paginatedResults);
});

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id).populate('category');

  if (!goal) {
    return sendError(res, 'Goal not found', 404);
  }

  // Check ownership
  if (goal.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to access this goal', 403);
  }

  return sendSuccess(res, 'Goal retrieved successfully', goal);
});

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const { title, description, category, priority, dueDate, reminder, estimatedMinutes, tags } = req.body;

  // Verify category belongs to user or is default
  const cat = await Category.findOne({
    _id: category,
    $or: [{ isDefault: true }, { user: req.user.id }],
  });

  if (!cat) {
    return sendError(res, 'Invalid category ID or category is not owned by user', 400);
  }

  const goal = await Goal.create({
    title,
    description: description || '',
    category,
    priority: priority || 'medium',
    status: 'pending',
    dueDate,
    reminder: reminder || false,
    estimatedMinutes: estimatedMinutes || 0,
    tags: tags || [],
    isArchived: false,
    user: req.user.id,
  });

  const populatedGoal = await Goal.findById(goal._id).populate('category');

  return sendSuccess(res, 'Goal created successfully', populatedGoal, 201);
});

// @desc    Update goal details
// @route   PATCH /api/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  const updates = req.body;

  let goal = await Goal.findById(req.params.id);

  if (!goal) {
    return sendError(res, 'Goal not found', 404);
  }

  // Check ownership
  if (goal.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to update this goal', 403);
  }

  // Validate category if updating
  if (updates.category) {
    const cat = await Category.findOne({
      _id: updates.category,
      $or: [{ isDefault: true }, { user: req.user.id }],
    });
    if (!cat) {
      return sendError(res, 'Invalid category ID', 400);
    }
  }

  // Manage completion details automatically
  if (updates.status === 'completed' && goal.status !== 'completed') {
    updates.completedAt = new Date();
  } else if (updates.status === 'pending') {
    updates.completedAt = null;
  }

  goal = await Goal.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('category');

  return sendSuccess(res, 'Goal updated successfully', goal);
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return sendError(res, 'Goal not found', 404);
  }

  // Check ownership
  if (goal.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to delete this goal', 403);
  }

  await goal.deleteOne();

  return sendSuccess(res, 'Goal deleted successfully', {});
});

// @desc    Mark goal status as completed
// @route   PATCH /api/goals/:id/complete
// @access  Private
export const completeGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return sendError(res, 'Goal not found', 404);
  }

  // Check ownership
  if (goal.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to update this goal', 403);
  }

  goal.status = 'completed';
  goal.completedAt = new Date();
  await goal.save();

  const populatedGoal = await Goal.findById(goal._id).populate('category');

  return sendSuccess(res, 'Goal marked as completed successfully', populatedGoal);
});

// @desc    Archive a goal
// @route   PATCH /api/goals/:id/archive
// @access  Private
export const archiveGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return sendError(res, 'Goal not found', 404);
  }

  // Check ownership
  if (goal.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to archive this goal', 403);
  }

  goal.isArchived = true;
  await goal.save();

  return sendSuccess(res, 'Goal archived successfully', goal);
});

// @desc    Unarchive a goal
// @route   PATCH /api/goals/:id/unarchive
// @access  Private
export const unarchiveGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return sendError(res, 'Goal not found', 404);
  }

  // Check ownership
  if (goal.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to unarchive this goal', 403);
  }

  goal.isArchived = false;
  await goal.save();

  return sendSuccess(res, 'Goal unarchived successfully', goal);
});

// @desc    Get today's goals
// @route   GET /api/goals/today
// @access  Private
export const getTodayGoals = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Retrieve goals due today
  const goals = await Goal.find({
    user: req.user.id,
    isArchived: false,
    dueDate: { $gte: startOfToday, $lte: endOfToday },
  }).populate('category');

  return sendSuccess(res, "Today's goals retrieved successfully", goals);
});

// @desc    Get upcoming goals (due in the future)
// @route   GET /api/goals/upcoming
// @access  Private
export const getUpcomingGoals = asyncHandler(async (req, res) => {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Retrieve upcoming pending goals
  const goals = await Goal.find({
    user: req.user.id,
    isArchived: false,
    status: 'pending',
    dueDate: { $gt: endOfToday },
  }).populate('category').sort({ dueDate: 1 });

  return sendSuccess(res, 'Upcoming goals retrieved successfully', goals);
});

// @desc    Get overdue goals (past due date, still pending)
// @route   GET /api/goals/overdue
// @access  Private
export const getOverdueGoals = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const goals = await Goal.find({
    user: req.user.id,
    isArchived: false,
    status: 'pending',
    dueDate: { $lt: startOfToday },
  }).populate('category').sort({ dueDate: 1 });

  return sendSuccess(res, 'Overdue goals retrieved successfully', goals);
});

// @desc    Search goals via text indexing
// @route   GET /api/goals/search
// @access  Private
export const searchGoals = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return sendError(res, 'Query parameter q is required for searching', 400);
  }

  const goals = await Goal.find({
    user: req.user.id,
    isArchived: false,
    $text: { $search: q },
  })
  .select({ score: { $meta: 'textScore' } })
  .sort({ score: { $meta: 'textScore' } })
  .populate('category');

  return sendSuccess(res, 'Goals search completed successfully', goals);
});
