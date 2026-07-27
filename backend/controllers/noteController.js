import Note from '../models/Note.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { getPaginationResults } from '../utils/pagination.js';

// @desc    Get all user notes (with pagination and optional tag filtering)
// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  const { tag, page, limit } = req.query;

  const filter = { user: req.user.id };
  if (tag) {
    filter.tags = { $in: [tag] };
  }

  // Sort: pinned first, then updatedDate descending
  const results = await getPaginationResults(
    Note,
    filter,
    page,
    limit,
    [],
    { isPinned: -1, updatedAt: -1 }
  );

  return sendSuccess(res, 'Notes retrieved successfully', results);
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return sendError(res, 'Note not found', 404);
  }

  if (note.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to access this note', 403);
  }

  return sendSuccess(res, 'Note retrieved successfully', note);
});

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, isPinned, tags, color } = req.body;

  const note = await Note.create({
    title,
    content: content || '',
    isPinned: isPinned || false,
    tags: tags || [],
    color: color || '#FFFFFF',
    user: req.user.id,
  });

  return sendSuccess(res, 'Note created successfully', note, 201);
});

// @desc    Update a note
// @route   PATCH /api/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req, res) => {
  const updates = req.body;

  let note = await Note.findById(req.params.id);

  if (!note) {
    return sendError(res, 'Note not found', 404);
  }

  if (note.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to update this note', 403);
  }

  note = await Note.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 'Note updated successfully', note);
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return sendError(res, 'Note not found', 404);
  }

  if (note.user.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to delete this note', 403);
  }

  await note.deleteOne();

  return sendSuccess(res, 'Note deleted successfully', {});
});

// @desc    Get all pinned notes
// @route   GET /api/notes/pinned
// @access  Private
export const getPinnedNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id, isPinned: true }).sort({ updatedAt: -1 });

  return sendSuccess(res, 'Pinned notes retrieved successfully', notes);
});

// @desc    Search notes via text index
// @route   GET /api/notes/search
// @access  Private
export const searchNotes = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return sendError(res, 'Query parameter q is required for searching', 400);
  }

  const notes = await Note.find({
    user: req.user.id,
    $text: { $search: q },
  })
  .select({ score: { $meta: 'textScore' } })
  .sort({ score: { $meta: 'textScore' } });

  return sendSuccess(res, 'Notes search completed successfully', notes);
});
