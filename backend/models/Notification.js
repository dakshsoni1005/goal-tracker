import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a notification title'],
      trim: true,
      maxlength: [100],
    },
    message: {
      type: String,
      required: [true, 'Please add notification content'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'reminder', 'goal', 'habit'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
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

// Index for getting unread count and sorting by date
NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
