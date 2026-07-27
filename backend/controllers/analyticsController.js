import mongoose from 'mongoose';
import Goal from '../models/Goal.js';
import Habit from '../models/Habit.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { getFormattedDate, getPastDaysList, parseDateString } from '../utils/dateHelper.js';

// Helper to map index to Day Name
const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// @desc    Get dashboard metrics & overview statistics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  // 1. Goal Completion Stats
  const totalGoals = await Goal.countDocuments({ user: userId });
  const completedGoals = await Goal.countDocuments({ user: userId, status: 'completed' });
  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Today's goals progress
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todayTotal = await Goal.countDocuments({
    user: userId,
    isArchived: false,
    dueDate: { $gte: startOfToday, $lte: endOfToday },
  });
  const todayCompleted = await Goal.countDocuments({
    user: userId,
    isArchived: false,
    status: 'completed',
    dueDate: { $gte: startOfToday, $lte: endOfToday },
  });

  // 2. Habit Stats
  const habits = await Habit.find({ user: userId });
  let longestStreak = 0;
  let currentStreak = 0;
  let totalHabitCompletions = 0;
  let habitScoresSum = 0;

  const past7Days = getPastDaysList(7);

  habits.forEach((habit) => {
    totalHabitCompletions += habit.completedDates.length;
    if (habit.streak > currentStreak) currentStreak = habit.streak;
    if (habit.bestStreak > longestStreak) longestStreak = habit.bestStreak;

    // Calculate completions in past 7 days for current completion rate
    const completionsInLast7Days = habit.completedDates.filter((d) =>
      past7Days.includes(d)
    ).length;

    const possibleTarget = habit.frequency === 'daily' ? 7 : 1;
    const habitScore = Math.min(100, Math.round((completionsInLast7Days / possibleTarget) * 100));
    habitScoresSum += habitScore;
  });

  const habitCompletionRate = habits.length > 0 ? Math.round(habitScoresSum / habits.length) : 0;

  // 3. Productivity Score
  // Normalized score: 60% based on goals rate, 40% on habits rate
  const productivityScore = Math.round((goalCompletionRate * 0.6) + (habitCompletionRate * 0.4));

  // 4. Most Productive Day of Week (Aggregation on goals)
  let mostProductiveDay = 'N/A';
  const completedGoalsAggregation = await Goal.aggregate([
    {
      $match: {
        user: userId,
        status: 'completed',
        completedAt: { $ne: null },
      },
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: '$completedAt' }, // 1 (Sunday) to 7 (Saturday)
      },
    },
    {
      $group: {
        _id: '$dayOfWeek',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  if (completedGoalsAggregation.length > 0) {
    // MongoDB dayOfWeek index is 1-indexed (1=Sunday, 7=Saturday)
    const dayIndex = completedGoalsAggregation[0]._id - 1;
    mostProductiveDay = DAYS_OF_WEEK[dayIndex] || 'N/A';
  }

  // 5. Category Distribution
  const categoryDistribution = await Goal.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'catDetails',
      },
    },
    { $unwind: '$catDetails' },
    {
      $project: {
        _id: 1,
        name: '$catDetails.name',
        color: '$catDetails.color',
        count: 1,
      },
    },
  ]);

  return sendSuccess(res, 'Dashboard metrics calculated successfully', {
    productivityScore,
    goalStats: {
      totalGoals,
      completedGoals,
      goalCompletionRatePercent: goalCompletionRate,
      todayProgress: {
        total: todayTotal,
        completed: todayCompleted,
        pending: todayTotal - todayCompleted,
      },
    },
    habitStats: {
      totalHabits: habits.length,
      totalCompletions: totalHabitCompletions,
      habitCompletionRatePercent: habitCompletionRate,
      currentStreak,
      longestStreak,
    },
    productivityDetails: {
      mostProductiveDay,
      categoryDistribution,
    },
  });
});

// @desc    Get monthly breakdown (daily stats for current calendar month)
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlyAnalytics = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const now = new Date();
  
  // Start and End of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Group goals completed in current month by day
  const goalsBreakdown = await Goal.aggregate([
    {
      $match: {
        user: userId,
        status: 'completed',
        completedAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        completedCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Habits completed in current month
  const habits = await Habit.find({ user: userId });
  const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Count habit completions by day
  const dailyHabitCompletions = {};
  habits.forEach((habit) => {
    habit.completedDates.forEach((dateStr) => {
      if (dateStr.startsWith(monthString)) {
        dailyHabitCompletions[dateStr] = (dailyHabitCompletions[dateStr] || 0) + 1;
      }
    });
  });

  const formattedHabitBreakdown = Object.entries(dailyHabitCompletions).map(([date, count]) => ({
    date,
    completionsCount: count,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return sendSuccess(res, 'Monthly performance analytics calculated successfully', {
    month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
    goalsBreakdown,
    habitsBreakdown: formattedHabitBreakdown,
  });
});

// @desc    Get yearly breakdown (monthly statistics for current calendar year)
// @route   GET /api/analytics/yearly
// @access  Private
export const getYearlyAnalytics = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const now = new Date();
  
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  // Completed goals by month (1 to 12)
  const goalsByMonth = await Goal.aggregate([
    {
      $match: {
        user: userId,
        status: 'completed',
        completedAt: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $group: {
        _id: { $month: '$completedAt' },
        completedCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Habits completed in current year
  const habits = await Habit.find({ user: userId });
  const yearString = `${now.getFullYear()}`;
  
  const monthlyHabitCompletions = Array(12).fill(0);
  
  habits.forEach((habit) => {
    habit.completedDates.forEach((dateStr) => {
      if (dateStr.startsWith(yearString)) {
        const monthIndex = parseInt(dateStr.split('-')[1], 10) - 1; // 0-indexed month
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyHabitCompletions[monthIndex]++;
        }
      }
    });
  });

  const habitsByMonth = monthlyHabitCompletions.map((count, index) => ({
    monthIndex: index + 1,
    monthName: new Date(2000, index).toLocaleString('default', { month: 'short' }),
    completionsCount: count,
  }));

  // Format goals by month with month name
  const formattedGoals = Array(12).fill(0).map((_, index) => {
    const matched = goalsByMonth.find(item => item._id === (index + 1));
    return {
      monthIndex: index + 1,
      monthName: new Date(2000, index).toLocaleString('default', { month: 'short' }),
      completedCount: matched ? matched.completedCount : 0,
    };
  });

  return sendSuccess(res, 'Yearly performance analytics calculated successfully', {
    year: now.getFullYear(),
    goalsBreakdown: formattedGoals,
    habitsBreakdown: habitsByMonth,
  });
});
