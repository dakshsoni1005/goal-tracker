import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get all categories (default + user custom)
// @route   GET /api/categories
// @access  Private
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    $or: [{ isDefault: true }, { user: req.user.id }],
  });

  return sendSuccess(res, 'Categories retrieved successfully', categories);
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return sendError(res, 'Category not found', 404);
  }

  // Check ownership
  if (!category.isDefault && category.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to access this category', 403);
  }

  return sendSuccess(res, 'Category retrieved successfully', category);
});

// @desc    Create new custom category
// @route   POST /api/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
  const { name, color, icon } = req.body;

  // Check if a category with same name already exists for this user or as default
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    $or: [{ isDefault: true }, { user: req.user.id }],
  });

  if (existingCategory) {
    return sendError(res, 'A category with this name already exists', 400);
  }

  const category = await Category.create({
    name,
    color,
    icon,
    isDefault: false,
    user: req.user.id,
  });

  return sendSuccess(res, 'Category created successfully', category, 201);
});

// @desc    Update a custom category
// @route   PATCH /api/categories/:id
// @access  Private
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, color, icon } = req.body;

  let category = await Category.findById(req.params.id);

  if (!category) {
    return sendError(res, 'Category not found', 404);
  }

  // Prevent modifying default categories unless admin
  if (category.isDefault && req.user.role !== 'admin') {
    return sendError(res, 'Cannot modify system default categories', 403);
  }

  // Check ownership
  if (!category.isDefault && category.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to update this category', 403);
  }

  // Check for name duplicate
  if (name && name !== category.name) {
    const existingName = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      $or: [{ isDefault: true }, { user: req.user.id }],
      _id: { $ne: req.params.id },
    });

    if (existingName) {
      return sendError(res, 'A category with this name already exists', 400);
    }
    category.name = name;
  }

  if (color) category.color = color;
  if (icon) category.icon = icon;

  await category.save();

  return sendSuccess(res, 'Category updated successfully', category);
});

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return sendError(res, 'Category not found', 404);
  }

  // Prevent deleting default categories
  if (category.isDefault) {
    return sendError(res, 'Cannot delete system default categories', 403);
  }

  // Check ownership
  if (category.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to delete this category', 403);
  }

  await category.deleteOne();

  return sendSuccess(res, 'Category deleted successfully', {});
});
