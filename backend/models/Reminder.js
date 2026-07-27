import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a reminder title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    type: {
      type: String,
      enum: ['email', 'browser', 'both'],
      default: 'email',
    },
    triggerTime: {
      type: Date,
      required: [true, 'Please add a reminder execution date-time'],
    },
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly'],
      default: 'once',
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: false,
    },
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: false,
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
ReminderSchema.index({ user: 1, status: 1 });
ReminderSchema.index({ triggerTime: 1, status: 1 }); // used by node-cron scheduler

const Reminder = mongoose.model('Reminder', ReminderSchema);
export default Reminder;
