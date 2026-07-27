import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/categoryValidator.js';

const router = express.Router();

// Apply protection to all category routes
router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(createCategoryValidator, createCategory);

router
  .route('/:id')
  .get(getCategory)
  .patch(updateCategoryValidator, updateCategory)
  .delete(deleteCategory);

export default router;
