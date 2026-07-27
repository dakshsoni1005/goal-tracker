import Goal from '../models/Goal.js';
import Habit from '../models/Habit.js';
import Reminder from '../models/Reminder.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getFormattedDate, getPastDaysList } from '../utils/dateHelper.js';

// @desc    Get consolidated dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const todayStr = getFormattedDate();

  // 1. Time Boundaries
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // 2. Today's Goals
  const todayGoals = await Goal.find({
    user: userId,
    isArchived: false,
    dueDate: { $gte: startOfToday, $lte: endOfToday },
  }).populate('category');

  const todayCompletedCount = todayGoals.filter((g) => g.status === 'completed').length;
  const todayPendingCount = todayGoals.filter((g) => g.status === 'pending').length;

  // 3. Overdue Goals (due before today, status pending, not archived)
  const overdueGoals = await Goal.find({
    user: userId,
    isArchived: false,
    status: 'pending',
    dueDate: { $lt: startOfToday },
  }).populate('category').sort({ dueDate: 1 });

  // 4. Habits for today
  // Retrieve habits, verify completion state for today (YYYY-MM-DD in completedDates)
  const habitsList = await Habit.find({ user: userId });
  const habitsData = habitsList.map((habit) => ({
    id: habit._id,
    title: habit.title,
    icon: habit.icon,
    color: habit.color,
    streak: habit.streak,
    bestStreak: habit.bestStreak,
    isCompletedToday: habit.completedDates.includes(todayStr),
    frequency: habit.frequency,
    target: habit.target,
  }));

  // 5. Upcoming Reminders (triggerTime > now, status pending, limit to 5)
  const upcomingReminders = await Reminder.find({
    user: userId,
    status: 'pending',
    triggerTime: { $gt: new Date() },
  })
    .sort({ triggerTime: 1 })
    .limit(5)
    .populate(['goal', 'habit']);

  // 6. Productivity Score Calculation
  const totalGoalsCount = await Goal.countDocuments({ user: userId });
  const completedGoalsCount = await Goal.countDocuments({ user: userId, status: 'completed' });
  const goalRate = totalGoalsCount > 0 ? (completedGoalsCount / totalGoalsCount) * 100 : 0;

  // Habits score calculation (completions in past 7 days)
  const past7Days = getPastDaysList(7);
  let habitsRatesSum = 0;

  habitsList.forEach((habit) => {
    const last7DaysCompletions = habit.completedDates.filter((date) =>
      past7Days.includes(date)
    ).length;
    const target = habit.frequency === 'daily' ? 7 : 1;
    const habitRate = Math.min(100, (last7DaysCompletions / target) * 100);
    habitsRatesSum += habitRate;
  });

  const habitRate = habitsList.length > 0 ? habitsRatesSum / habitsList.length : 0;
  const productivityScore = Math.round((goalRate * 0.6) + (habitRate * 0.4));

  // 7. Graph Data (Weekly and Monthly Goal completions)
  // Get list of past 7 and 30 days
  const weeklyDays = getPastDaysList(7);
  const monthlyDays = getPastDaysList(30);

  // Group goals completed in past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const completedGoalsInPeriod = await Goal.find({
    user: userId,
    status: 'completed',
    completedAt: { $gte: thirtyDaysAgo },
  });

  // Calculate daily counts for the completed goals
  const dailyCompletedCounts = {};
  completedGoalsInPeriod.forEach((goal) => {
    if (goal.completedAt) {
      const dateStr = getFormattedDate(goal.completedAt);
      dailyCompletedCounts[dateStr] = (dailyCompletedCounts[dateStr] || 0) + 1;
    }
  });

  // Compile graphs
  const weeklyGraph = weeklyDays.map((dayStr) => ({
    date: dayStr,
    completedCount: dailyCompletedCounts[dayStr] || 0,
  }));

  const monthlyGraph = monthlyDays.map((dayStr) => ({
    date: dayStr,
    completedCount: dailyCompletedCounts[dayStr] || 0,
  }));

  return sendSuccess(res, 'Dashboard data retrieved successfully', {
    productivityScore,
    goals: {
      today: todayGoals,
      completedCount: todayCompletedCount,
      pendingCount: todayPendingCount,
      overdue: overdueGoals,
    },
    habits: habitsData,
    upcomingReminders,
    graphs: {
      weekly: weeklyGraph,
      monthly: monthlyGraph,
    },
  });
});
