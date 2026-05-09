

const mongoose = require('mongoose');

const repeatScheduleSchema = new mongoose.Schema(
  {
    // ─── Foreign Keys ────────────────────────────────────────────────────────────
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      unique: true, // One schedule per task
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Denormalized for faster user-scoped queries
    },

    // ─── Cycle selector ─────────────────────────────────────────────────────────
    // Exactly one of daily, weekly, monthly should be 1.
    cycle: {
      daily: { type: Number, default: 1, min: 0, max: 1 },
      weekly: { type: Number, default: 0, min: 0, max: 1 },
      monthly: { type: Number, default: 0, min: 0, max: 1 },
    },
    // For "Every 2 weeks", "Every 3 months", etc.
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    // Reference date for interval calculations
    startDate: {
      type: Date,
      default: Date.now,
    },

    // ─── Daily config ────────────────────────────────────────────────────────────
    // Time in 24-hour "HH:MM" format. E.g. "23:00" for 11 PM.
    dailyTime: {
      type: String,
      default: '09:00',
      match: [/^\d{2}:\d{2}$/, 'dailyTime must be in HH:MM format'],
    },

    // ─── Weekly config ───────────────────────────────────────────────────────────
    weeklyDays: {
      Mon: { type: Number, default: 0, min: 0, max: 1 },
      Tue: { type: Number, default: 0, min: 0, max: 1 },
      Wed: { type: Number, default: 0, min: 0, max: 1 },
      Thu: { type: Number, default: 0, min: 0, max: 1 },
      Fri: { type: Number, default: 0, min: 0, max: 1 },
      Sat: { type: Number, default: 0, min: 0, max: 1 },
      Sun: { type: Number, default: 0, min: 0, max: 1 },
    },

    // ─── Monthly config ──────────────────────────────────────────────────────────
    // Array of day-of-month numbers, e.g. [1, 15, 28].
    monthlyDates: [
      {
        type: Number,
        min: 1,
        max: 31,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RepeatSchedule', repeatScheduleSchema);
