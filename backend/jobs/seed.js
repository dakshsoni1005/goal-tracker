import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Goal from '../models/Goal.js';
import Habit from '../models/Habit.js';
import Note from '../models/Note.js';
import Reminder from '../models/Reminder.js';
import Notification from '../models/Notification.js';

dotenv.config();

const defaultCategoriesList = [
  { name: 'Work', color: '#2563EB', icon: 'Briefcase', isDefault: true },
  { name: 'Health & Fitness', color: '#10B981', icon: 'Activity', isDefault: true },
  { name: 'Personal Development', color: '#7C3AED', icon: 'BookOpen', isDefault: true },
  { name: 'Finance', color: '#F59E0B', icon: 'DollarSign', isDefault: true },
  { name: 'Social & Family', color: '#EC4899', icon: 'Heart', isDefault: true },
];

const seedDatabase = async () => {
  try {
    // 1. Establish DB Connection
    await connectDB();

    console.log('[Seeder] Cleaning existing default categories...');
    await Category.deleteMany({ isDefault: true });

    console.log('[Seeder] Seeding default categories...');
    const categories = await Category.create(defaultCategoriesList);
    console.log(`[Seeder] Seeded ${categories.length} default categories.`);

    // 2. Seed Sandbox User for testing
    const sandboxEmail = 'sandbox@goalflow.com';
    let user = await User.findOne({ email: sandboxEmail });

    if (user) {
      console.log('[Seeder] Cleaning existing sandbox data...');
      await Goal.deleteMany({ user: user._id });
      await Habit.deleteMany({ user: user._id });
      await Note.deleteMany({ user: user._id });
      await Reminder.deleteMany({ user: user._id });
      await Notification.deleteMany({ user: user._id });
      await Category.deleteMany({ user: user._id, isDefault: false });
      await User.deleteOne({ _id: user._id });
    }

    console.log('[Seeder] Creating sandbox user...');
    user = await User.create({
      name: 'Sandbox User',
      email: sandboxEmail,
      password: 'Password123', // Will be hashed by pre-save hook
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
      timezone: 'UTC',
    });

    console.log(`[Seeder] Sandbox User created: ${user.email} (Password: Password123)`);

    // Get seeded default category IDs
    const workCat = categories.find((c) => c.name === 'Work');
    const healthCat = categories.find((c) => c.name === 'Health & Fitness');
    const personalCat = categories.find((c) => c.name === 'Personal Development');
    const financeCat = categories.find((c) => c.name === 'Finance');

    // 3. Seed Custom Categories
    const customCat = await Category.create({
      name: 'Hobbies & Games',
      color: '#14B8A6',
      icon: 'Gamepad',
      isDefault: false,
      user: user._id,
    });

    // 4. Seed Goals
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const goalsList = [
      {
        title: 'Review System Design Docs',
        description: 'Review architecture diagram and API schemas with team.',
        category: workCat._id,
        priority: 'high',
        status: 'pending',
        dueDate: today,
        reminder: true,
        estimatedMinutes: 60,
        tags: ['architecture', 'planning'],
        isArchived: false,
        user: user._id,
      },
      {
        title: 'Complete GoalFlow API Seed script',
        description: 'Complete the Node seeder script and write readme file.',
        category: workCat._id,
        priority: 'high',
        status: 'completed',
        dueDate: yesterday,
        completedAt: yesterday,
        estimatedMinutes: 30,
        tags: ['development', 'mongodb'],
        isArchived: false,
        user: user._id,
      },
      {
        title: 'Morning 5km Run',
        description: 'Run around the park in the morning.',
        category: healthCat._id,
        priority: 'medium',
        status: 'completed',
        dueDate: today,
        completedAt: today,
        estimatedMinutes: 45,
        tags: ['running', 'cardio'],
        isArchived: false,
        user: user._id,
      },
      {
        title: 'Read 20 pages of clean code book',
        description: 'Read Chapter 4 on Comments and formatting patterns.',
        category: personalCat._id,
        priority: 'low',
        status: 'pending',
        dueDate: tomorrow,
        estimatedMinutes: 20,
        tags: ['reading', 'learning'],
        isArchived: false,
        user: user._id,
      },
      {
        title: 'Setup Monthly Budget Plan',
        description: 'Allocate expenses and investment buckets for this month.',
        category: financeCat._id,
        priority: 'medium',
        status: 'pending',
        dueDate: yesterday, // Overdue goal!
        estimatedMinutes: 45,
        tags: ['finance', 'budgeting'],
        isArchived: false,
        user: user._id,
      },
      {
        title: 'Old Archived Goal example',
        description: 'This is an example of an archived goal that doesn\'t show in active lists.',
        category: customCat._id,
        priority: 'low',
        status: 'completed',
        dueDate: yesterday,
        completedAt: yesterday,
        isArchived: true,
        user: user._id,
      },
    ];

    console.log('[Seeder] Seeding goals...');
    await Goal.create(goalsList);

    // 5. Seed Habits
    // Format dates for past few consecutive days to simulate active streaks
    const getPastDateStr = (daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const habitsList = [
      {
        title: 'Drink 3L Water',
        icon: 'Droplet',
        color: '#3B82F6',
        streak: 5,
        bestStreak: 12,
        completedDates: [
          getPastDateStr(0), // Today
          getPastDateStr(1), // Yesterday
          getPastDateStr(2),
          getPastDateStr(3),
          getPastDateStr(4),
          getPastDateStr(6), // gap on 5, resets streak logic internally
          getPastDateStr(7),
          getPastDateStr(8),
        ],
        frequency: 'daily',
        target: 1,
        user: user._id,
      },
      {
        title: 'Gym Workout',
        icon: 'Dumbbell',
        color: '#EF4444',
        streak: 2,
        bestStreak: 2,
        completedDates: [
          getPastDateStr(0),
          getPastDateStr(1),
        ],
        frequency: 'daily',
        target: 1,
        user: user._id,
      },
      {
        title: 'Weekly Budget Review',
        icon: 'TrendingUp',
        color: '#10B981',
        streak: 0,
        bestStreak: 4,
        completedDates: [
          getPastDateStr(7),
          getPastDateStr(14),
        ],
        frequency: 'weekly',
        target: 1,
        user: user._id,
      },
    ];

    console.log('[Seeder] Seeding habits...');
    await Habit.create(habitsList);

    // 6. Seed Notes
    const notesList = [
      {
        title: 'Project Tech Stack Ideas',
        content: 'Backend: Node/Express\nFrontend: React/Vite\nStyling: HSL-palette Vanilla CSS\nAnalytics: Aggregation pipelines\nScheduler: node-cron',
        isPinned: true,
        tags: ['work', 'ideas'],
        color: '#FEE2E2', // light red card
        user: user._id,
      },
      {
        title: 'Gym Exercise Routine',
        content: 'Monday: Push (Chest/Shoulders/Triceps)\nWednesday: Pull (Back/Biceps)\nFriday: Legs (Squats/Quads/Calves)',
        isPinned: false,
        tags: ['health', 'fitness'],
        color: '#ECFDF5', // light green card
        user: user._id,
      },
      {
        title: 'Shopping List',
        content: '- Almond milk\n- Avocados\n- Oatmeal\n- Protein powder\n- Salmon',
        isPinned: false,
        tags: ['personal', 'shopping'],
        color: '#FFFBEB', // light yellow card
        user: user._id,
      },
    ];

    console.log('[Seeder] Seeding notes...');
    await Note.create(notesList);

    // 7. Seed Notifications
    const notificationsList = [
      {
        title: 'Welcome to GoalFlow!',
        message: 'Welcome! Start setting up your daily goals, routines, and custom categories.',
        type: 'info',
        isRead: true,
        user: user._id,
      },
      {
        title: 'Streak Warning! 🔥',
        message: 'Your gym habit streak is about to reset. Complete it today to keep the streak alive!',
        type: 'habit',
        isRead: false,
        user: user._id,
      },
    ];

    console.log('[Seeder] Seeding notifications...');
    await Notification.create(notificationsList);

    // 8. Seed Reminders
    const reminderTriggerTime = new Date();
    reminderTriggerTime.setMinutes(reminderTriggerTime.getMinutes() + 10); // 10 minutes in future

    const remindersList = [
      {
        title: 'Review System Design Docs Reminder',
        type: 'both',
        triggerTime: reminderTriggerTime,
        frequency: 'once',
        status: 'pending',
        user: user._id,
      },
    ];

    console.log('[Seeder] Seeding reminders...');
    await Reminder.create(remindersList);

    console.log('\x1b[32m[Seeder] Seed complete! Database ready for exploration.\x1b[0m');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder] Seed Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
