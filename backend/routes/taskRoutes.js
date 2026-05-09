/* Task Routes*/

const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  getTasksForDate,
  getCalendarDots,
  createTask,
  updateTask,
  toggleCompletion,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes require a valid JWT
router.use(protect);

// ─── Validation ───────────────────────────────────────────────────────────────
const createValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('isRepeating')
    .optional()
    .isBoolean().withMessage('isRepeating must be true or false'),
];

const updateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('isRepeating')
    .optional()
    .isBoolean().withMessage('isRepeating must be true or false'),
];

// ─── Named routes (must come BEFORE /:id routes) ─────────────────────────────
// GET /api/tasks/for-date?date=YYYY-MM-DD
router.get('/for-date', getTasksForDate);

// GET /api/tasks/calendar-dots?month=5&year=2026
router.get('/calendar-dots', getCalendarDots);

// ─── Collection routes ────────────────────────────────────────────────────────
router.route('/')
  .get(getTasks)
  .post(createValidation, createTask);

// ─── Document routes ──────────────────────────────────────────────────────────
router.route('/:id')
  .get(getTask)
  .put(updateValidation, updateTask)
  .delete(deleteTask);

// PUT /api/tasks/:id/complete  — Toggle completion for a specific date
router.put('/:id/complete', toggleCompletion);

module.exports = router;
