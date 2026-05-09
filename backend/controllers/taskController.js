

const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const RepeatSchedule = require('../models/RepeatSchedule');

// ─── Helper: Day-of-week name from a JS Date ─────────────────────────────────
// Returns 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
const getDayName = (date) => {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[date.getUTCDay()];
};

// ─── Helper: Format a Date as "YYYY-MM-DD" string ────────────────────────────
const toDateStr = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// ─── Helper: Check if a task is relevant for a given date ────────────────────
// Returns true if the task (with its schedule) falls on the given Date object.
const isTaskOnDate = (task, schedule, targetDate) => {
  if (!task.isRepeating) {
    if (!task.oneTimeDate) return false;
    return toDateStr(task.oneTimeDate) === toDateStr(targetDate);
  }

  if (!schedule) return false;

  const interval = schedule.interval || 1;
  const startDate = new Date(schedule.startDate || task.createdAt);
  startDate.setUTCHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setUTCHours(0, 0, 0, 0);

  // If target date is before start date, it's not on date
  if (target < startDate) return false;

  if (schedule.cycle.daily === 1) {
    const diffDays = Math.floor((target - startDate) / (1000 * 60 * 60 * 24));
    return diffDays % interval === 0;
  }

  if (schedule.cycle.weekly === 1) {
    // Check day of week first
    const dayName = getDayName(targetDate);
    if (schedule.weeklyDays[dayName] !== 1) return false;

    // Check interval: weeks since start week
    const startCopy = new Date(startDate);
    const startDay = startCopy.getUTCDay();
    const startMonday = new Date(startCopy);
    startMonday.setUTCDate(startCopy.getUTCDate() - (startDay === 0 ? 6 : startDay - 1));

    const targetCopy = new Date(target);
    const targetDay = targetCopy.getUTCDay();
    const targetMonday = new Date(targetCopy);
    targetMonday.setUTCDate(targetCopy.getUTCDate() - (targetDay === 0 ? 6 : targetDay - 1));

    const diffWeeks = Math.round((targetMonday - startMonday) / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks % interval === 0;
  }

  if (schedule.cycle.monthly === 1) {
    // Check day of month first
    const dayOfMonth = target.getUTCDate();
    if (!schedule.monthlyDates.includes(dayOfMonth)) return false;

    // Check interval: months since start month
    const diffMonths = (target.getUTCFullYear() - startDate.getUTCFullYear()) * 12 + (target.getUTCMonth() - startDate.getUTCMonth());
    return diffMonths % interval === 0;
  }

  return false;
};

// ─── Helper: Build a map of date→boolean for a full month ────────────────────
// Used by getCalendarDots to find all dates with tasks in a month.
const getDatesInMonth = (year, month) => {
  const dates = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    // Create as UTC midnight
    dates.push(new Date(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00Z`));
  }
  return dates;
};

// =============================================================================

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the current user (basic list, no date filtering)
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { user: req.user._id };

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    // Fetch all repeat schedules for this user's tasks in one query
    const taskIds = tasks.map((t) => t._id);
    const schedules = await RepeatSchedule.find({ task: { $in: taskIds } });
    const scheduleMap = {};
    schedules.forEach((s) => {
      scheduleMap[s.task.toString()] = s;
    });

    const today = toDateStr(new Date());
    const result = tasks.map((task) => ({
      ...task.toObject(),
      schedule: scheduleMap[task._id.toString()] || null,
      isCompleted: task.completions.includes(today),
    }));

    res.json({ tasks: result });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

/**
 * @route   GET /api/tasks/for-date?date=YYYY-MM-DD
 * @desc    Get all tasks relevant for a specific calendar date
 *          Includes: one-time tasks on that date, daily, weekly, monthly repeats.
 *          Each task has an `isCompleted` boolean for that specific date.
 * @access  Private
 */
const getTasksForDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Query param `date` is required in YYYY-MM-DD format' });
    }

    const targetDate = new Date(date + 'T00:00:00Z'); // UTC midnight

    // Fetch all tasks for this user
    const allTasks = await Task.find({ user: req.user._id });
    const taskIds = allTasks.map((t) => t._id);

    // Fetch all repeat schedules in one query
    const schedules = await RepeatSchedule.find({ task: { $in: taskIds } });
    const scheduleMap = {};
    schedules.forEach((s) => {
      scheduleMap[s.task.toString()] = s;
    });

    // Filter tasks that fall on the target date
    const relevant = allTasks.filter((task) => {
      const schedule = scheduleMap[task._id.toString()] || null;
      return isTaskOnDate(task, schedule, targetDate);
    });

    // Build response with isCompleted flag for the target date
    const result = relevant.map((task) => ({
      ...task.toObject(),
      schedule: scheduleMap[task._id.toString()] || null,
      isCompleted: task.completions.includes(date),
    }));

    res.json({ tasks: result, date });
  } catch (error) {
    console.error('Get tasks for date error:', error);
    res.status(500).json({ message: 'Error fetching tasks for date' });
  }
};

/**
 * @route   GET /api/tasks/calendar-dots?month=5&year=2026
 * @desc    Returns an array of "YYYY-MM-DD" strings for all dates in the given
 *          month that have at least one task. Used to render dots on the calendar.
 * @access  Private
 */
const getCalendarDots = async (req, res) => {
  try {
    const month = parseInt(req.query.month, 10); // 1-12
    const year = parseInt(req.query.year, 10);

    if (!month || !year || month < 1 || month > 12) {
      return res.status(400).json({ message: '`month` (1-12) and `year` are required' });
    }

    const allTasks = await Task.find({ user: req.user._id });
    const taskIds = allTasks.map((t) => t._id);
    const schedules = await RepeatSchedule.find({ task: { $in: taskIds } });
    const scheduleMap = {};
    schedules.forEach((s) => {
      scheduleMap[s.task.toString()] = s;
    });

    const datesInMonth = getDatesInMonth(year, month);
    const dotsSet = new Set();

    for (const date of datesInMonth) {
      for (const task of allTasks) {
        const schedule = scheduleMap[task._id.toString()] || null;
        if (isTaskOnDate(task, schedule, date)) {
          dotsSet.add(toDateStr(date));
          break; // No need to check other tasks for this date
        }
      }
    }

    res.json({ dots: Array.from(dotsSet), month, year });
  } catch (error) {
    console.error('Get calendar dots error:', error);
    res.status(500).json({ message: 'Error fetching calendar dots' });
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task with its repeat schedule
 * @access  Private
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const today = toDateStr(new Date());
    res.json({
      ...task.toObject(),
      schedule: schedule || null,
      isCompleted: task.completions.includes(today)
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, tags, color, isRepeating, oneTimeDate, schedule } = req.body;

  try {
    // Create the Task document
    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      tags: tags || [],
      color: color || '#a8e6cf',
      isRepeating: isRepeating || false,
      oneTimeDate: isRepeating ? null : (oneTimeDate || null),
      completions: [],
    });

    let repeatSchedule = null;

    // If repeating, create the RepeatSchedule document
    if (isRepeating && schedule) {
      repeatSchedule = await RepeatSchedule.create({
        task: task._id,
        user: req.user._id,
        cycle: schedule.cycle || { daily: 1, weekly: 0, monthly: 0 },
        dailyTime: schedule.dailyTime || '09:00',
        weeklyDays: schedule.weeklyDays || { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
        monthlyDates: schedule.monthlyDates || [],
        interval: schedule.interval || 1,
        startDate: schedule.startDate || new Date(),
      });
    }

    res.status(201).json({ ...task.toObject(), schedule: repeatSchedule });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task and its repeat schedule
 * @access  Private
 */
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, tags, color, isRepeating, oneTimeDate, schedule } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (tags !== undefined) task.tags = tags;
    if (color !== undefined) task.color = color;
    if (isRepeating !== undefined) task.isRepeating = isRepeating;
    if (oneTimeDate !== undefined) task.oneTimeDate = isRepeating ? null : oneTimeDate;

    await task.save();

    let repeatSchedule = null;

    if (isRepeating && schedule) {
      // Upsert the repeat schedule
      repeatSchedule = await RepeatSchedule.findOneAndUpdate(
        { task: task._id },
        {
          task: task._id,
          user: req.user._id,
          cycle: schedule.cycle,
          dailyTime: schedule.dailyTime || '09:00',
          weeklyDays: schedule.weeklyDays,
          monthlyDates: schedule.monthlyDates || [],
          interval: schedule.interval || 1,
          startDate: schedule.startDate || task.createdAt,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else if (!isRepeating) {
      // If switching from repeating to one-time, remove the schedule
      await RepeatSchedule.deleteOne({ task: task._id });
    }

    res.json({ ...task.toObject(), schedule: repeatSchedule });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

/**
 * @route   PUT /api/tasks/:id/complete
 * @desc    Toggle completion of a task for a specific date.
 *          Body: { date: "YYYY-MM-DD" }
 *          - Only allowed for today's date (enforced on frontend, also validated here)
 * @access  Private
 */
const toggleCompletion = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: '`date` is required in YYYY-MM-DD format' });
    }

    const today = toDateStr(new Date());
    if (date !== today) {
      return res.status(403).json({ message: 'Tasks can only be marked complete for today' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const alreadyDone = task.completions.includes(date);

    if (alreadyDone) {
      // Un-complete: remove the date
      task.completions = task.completions.filter((d) => d !== date);
    } else {
      // Complete: add the date
      task.completions.push(date);
    }

    await task.save();

    res.json({
      message: alreadyDone ? 'Task marked incomplete' : 'Task marked complete',
      isCompleted: !alreadyDone,
      completions: task.completions,
    });
  } catch (error) {
    console.error('Toggle completion error:', error);
    res.status(500).json({ message: 'Error toggling task completion' });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task and its associated RepeatSchedule (cascade)
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Delete the RepeatSchedule if it exists
    await RepeatSchedule.deleteOne({ task: task._id });

    // Delete the task itself
    await task.deleteOne();

    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

module.exports = {
  getTasks,
  getTask,
  getTasksForDate,
  getCalendarDots,
  createTask,
  updateTask,
  toggleCompletion,
  deleteTask,
};
