import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a goal title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate a category'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add a due date'],
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    estimatedMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Estimated minutes cannot be negative'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    completedAt: {
      type: Date,
    },
    isArchived: {
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

// Indexes for sorting, filtering, and text search
GoalSchema.index({ user: 1, status: 1 });
GoalSchema.index({ user: 1, dueDate: 1 });
GoalSchema.index({ user: 1, isArchived: 1 });
GoalSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 1 } }
);

const Goal = mongoose.model('Goal', GoalSchema);
export default Goal;
