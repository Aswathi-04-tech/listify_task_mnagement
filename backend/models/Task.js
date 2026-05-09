/**
 * Task Model
 * Core task document. Stores task info and completion history.
 * Repeat configuration is stored in a separate RepeatSchedule collection.
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // ─── Core Info ─────────────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    color: {
      type: String,
      default: '#a8e6cf',
    },

    // ─── Repeat flag ────────────────────────────────────────────────────────────
    // If false, this is a one-time task tied to oneTimeDate.
    // If true, the repeat config lives in the RepeatSchedule collection.
    isRepeating: {
      type: Boolean,
      default: false,
    },

    // ─── One-time task date ──────────────────────────────────────────────────────
    // Only used when isRepeating = false.
    // Stores the specific date the task should appear on.
    oneTimeDate: {
      type: Date,
      default: null,
    },

    // ─── Completion log ──────────────────────────────────────────────────────────
    // Stores "YYYY-MM-DD" strings for each day this task was marked complete.
    // For one-time tasks, this array will have at most one entry.
    // For repeating tasks, it can accumulate entries over time.
    completions: [
      {
        type: String, // "YYYY-MM-DD"
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Completion date must be in YYYY-MM-DD format'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ─── Text index for search ─────────────────────────────────────────────────────
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
