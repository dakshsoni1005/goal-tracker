import Habit from '../models/Habit.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { getPaginationResults } from '../utils/pagination.js';
import { getFormattedDate, isConsecutiveDay, parseDateString } from '../utils/dateHelper.js';

/**
 * Recalculates current and best streaks from a list of completed dates
 */
const recalculateStreaks = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Remove duplicates and sort descending (newest first)
  const uniqueDates = [...new Set(completedDates)].sort((a, b) => b.localeCompare(a));

  const todayStr = getFormattedDate(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getFormattedDate(yesterday);

  let currentStreak = 0;

  // Streak is only active if completed today or yesterday
  if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
    currentStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      if (isConsecutiveDay(uniqueDates[i + 1], uniqueDates[i])) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate the best streak by walking the entire chronological list ascending
  const chronologicalDates = [...uniqueDates].reverse();
  let bestStreak = chronologicalDates.length > 0 ? 1 : 0;
  let tempStreak = bestStreak;

  for (let i = 0; i < chronologicalDates.length - 1; i++) {
    if (isConsecutiveDay(chronologicalDates[i], chronologicalDates[i + 1])) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }

  return { currentStreak, bestStreak };
};

// @desc    Get all user habits
// @route   GET /api/habits
// @access  Private
export const getHabits = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const results = await getPaginationResults(
    Habit,
    { user: req.user.id },
    page,
    limit,
    [],
    { createdAt: -1 }
  );

  return sendSuccess(res, 'Habits retrieved successfully', results);
});

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
export const getHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return sendError(res, 'Habit not found', 404);
  }

  if (habit.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to access this habit', 403);
  }

  return sendSuccess(res, 'Habit retrieved successfully', habit);
});

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = asyncHandler(async (req, res) => {
  const { title, icon, color, frequency, target } = req.body;

  const habit = await Habit.create({
    title,
    icon: icon || 'Activity',
    color: color || '#10B981',
    frequency: frequency || 'daily',
    target: target || 1,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
    user: req.user.id,
  });

  return sendSuccess(res, 'Habit created successfully', habit, 201);
});

// @desc    Update habit details
// @route   PATCH /api/habits/:id
// @access  Private
export const updateHabit = asyncHandler(async (req, res) => {
  const updates = req.body;

  let habit = await Habit.findById(req.params.id);

  if (!habit) {
    return sendError(res, 'Habit not found', 404);
  }

  if (habit.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to update this habit', 403);
  }

  // Prevent direct modification of streak/completedDates in standard updates
  delete updates.streak;
  delete updates.bestStreak;
  delete updates.completedDates;

  habit = await Habit.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 'Habit updated successfully', habit);
});

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return sendError(res, 'Habit not found', 404);
  }

  if (habit.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to delete this habit', 403);
  }

  await habit.deleteOne();

  return sendSuccess(res, 'Habit deleted successfully', {});
});

// @desc    Complete a habit for a specific date (or today)
// @route   PATCH /api/habits/:id/complete
// @access  Private
export const completeHabit = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const targetDate = date ? date : getFormattedDate(new Date());

  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return sendError(res, 'Habit not found', 404);
  }

  if (habit.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to modify this habit', 403);
  }

  // If already completed on this date, skip to avoid double addition
  if (habit.completedDates.includes(targetDate)) {
    return sendSuccess(res, 'Habit already completed on this date', habit);
  }

  habit.completedDates.push(targetDate);

  // Recalculate streak values
  const { currentStreak, bestStreak } = recalculateStreaks(habit.completedDates);
  habit.streak = currentStreak;
  habit.bestStreak = bestStreak;

  await habit.save();

  return sendSuccess(res, 'Habit completion registered successfully', habit);
});

// @desc    Reset habit streak
// @route   PATCH /api/habits/:id/reset
// @access  Private
export const resetHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return sendError(res, 'Habit not found', 404);
  }

  if (habit.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to modify this habit', 403);
  }

  habit.streak = 0;
  // bestStreak remains intact as record
  await habit.save();

  return sendSuccess(res, 'Habit streak reset successfully', habit);
});

// @desc    Get current streak statistics
// @route   GET /api/habits/:id/streak
// @access  Private
export const getHabitStreak = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return sendError(res, 'Habit not found', 404);
  }

  if (habit.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to view this habit', 403);
  }

  // Re-run calculator in case dates elapsed without a completion
  const { currentStreak, bestStreak } = recalculateStreaks(habit.completedDates);
  
  if (habit.streak !== currentStreak) {
    habit.streak = currentStreak;
    await habit.save();
  }

  return sendSuccess(res, 'Habit streak retrieved successfully', {
    currentStreak: habit.streak,
    bestStreak: habit.bestStreak,
  });
});

// @desc    Get monthly statistics for a habit
// @route   GET /api/habits/:id/stats
// @access  Private
export const getHabitStats = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return sendError(res, 'Habit not found', 404);
  }

  if (habit.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to access this habit', 403);
  }

  // Monthly stats (filter completions belonging to current calendar month)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthPrefix = `${year}-${month}`; // YYYY-MM

  const monthlyCompletions = habit.completedDates.filter((d) => d.startsWith(monthPrefix));
  
  // Calculate completion rate based on days elapsed in the month
  const totalDaysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const currentDayOfMonth = now.getDate();
  
  const completionRate = monthlyCompletions.length > 0 
    ? Math.round((monthlyCompletions.length / currentDayOfMonth) * 100)
    : 0;

  return sendSuccess(res, 'Habit monthly statistics retrieved successfully', {
    totalCompletionsCount: habit.completedDates.length,
    monthlyCompletionsCount: monthlyCompletions.length,
    monthlyCompletionsList: monthlyCompletions,
    completionRatePercent: Math.min(100, completionRate),
    currentStreak: habit.streak,
    bestStreak: habit.bestStreak,
  });
});
