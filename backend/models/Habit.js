import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a habit title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    icon: {
      type: String,
      default: 'Activity', // default icon name
    },
    color: {
      type: String,
      default: '#10B981', // default emerald green hex color
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedDates: [
      {
        type: String, // format: YYYY-MM-DD to avoid timezone shifting issues
        required: true,
      },
    ],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily',
    },
    target: {
      type: Number,
      default: 1, // e.g. once a day/week
      min: [1, 'Target must be at least 1 time'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
HabitSchema.index({ user: 1 });
HabitSchema.index({ user: 1, streak: -1 });

const Habit = mongoose.model('Habit', HabitSchema);
export default Habit;
