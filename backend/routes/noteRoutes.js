import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getPinnedNotes,
  searchNotes,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';
import { createNoteValidator, updateNoteValidator } from '../validators/noteValidator.js';

const router = express.Router();

router.use(protect);

// Specific paths before generic ID matcher
router.get('/pinned', getPinnedNotes);
router.get('/search', searchNotes);

router
  .route('/')
  .get(getNotes)
  .post(createNoteValidator, createNote);

router
  .route('/:id')
  .get(getNote)
  .patch(updateNoteValidator, updateNote)
  .delete(deleteNote);

export default router;
