import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
      maxlength: [30, 'Category name cannot be more than 30 characters'],
    },
    color: {
      type: String,
      default: '#4F46E5', // default hex color
      trim: true,
    },
    icon: {
      type: String,
      default: 'Folder', // default icon name
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return !this.isDefault; // user is required only if it is NOT a default category
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure name uniqueness per user or default category
CategorySchema.index({ name: 1, user: 1 }, { unique: true });

const Category = mongoose.model('Category', CategorySchema);
export default Category;
