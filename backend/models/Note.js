import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a note title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    color: {
      type: String,
      default: '#FFFFFF', // Default background color for card
      trim: true,
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
NoteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });
NoteSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, content: 1 } }
);

const Note = mongoose.model('Note', NoteSchema);
export default Note;
