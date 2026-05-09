/**
 * Dashboard
 * Main task management view matching Listify "To do List" design
 * Features: sidebar with calendar + lists, task list, search, filter, CRUD
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Bell, LogOut, User, ClipboardCheck, Sparkles } from "lucide-react";


import {
  Sun,
  Moon,
  Pencil,
  Trash2,
  X,
  Play,
  Plus,
  Menu,
  Search,
  Check,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import MiniCalendar from '../components/MiniCalendar';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeList, setActiveList] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [editTask, setEditTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDots, setCalendarDots] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // For counts

  // Helper for date string (Local to YYYY-MM-DD)
  const toDateStr = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = toDateStr(new Date());
  const activeDateStr = selectedDate ? toDateStr(selectedDate) : todayStr;
  const isToday = activeDateStr === todayStr && !activeList;

  // ─── Fetch tasks ──────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/tasks/for-date?date=${activeDateStr}`;

      // If a specific list is selected, fetch ALL tasks for that list (ignoring date)
      if (activeList) {
        url = `/tasks`; // This returns all tasks, we will filter by activeList client-side
      }

      const { data } = await api.get(url);
      setTasks(data.tasks || []);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [activeDateStr, activeList]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Fetch all tasks for counts ──────────────────────────────────────────
  const fetchAllTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setAllTasks(data.tasks || []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  // ─── Fetch calendar dots ──────────────────────────────────────────────────
  const fetchDots = useCallback(async (month, year) => {
    try {
      const { data } = await api.get(`/tasks/calendar-dots?month=${month}&year=${year}`);
      setCalendarDots(data.dots || []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    fetchDots(now.getMonth() + 1, now.getFullYear());
  }, [fetchDots]);

  // ─── Toggle completion (Today only) ────────────────────────────────────────
  const toggleCompletion = async (task) => {
    // Only allow toggling if looking at Today
    if (!isToday && !activeList) return;

    // If in a list view, we use today's date for completion
    const dateToComplete = activeList ? todayStr : activeDateStr;

    try {
      // Backend toggleCompletion only allows today's date currently
      const { data } = await api.put(`/tasks/${task._id}/complete`, { date: todayStr });
      setTasks(ts => ts.map(t => t._id === task._id ? { ...t, isCompleted: data.isCompleted } : t));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  // ─── Delete task ─────────────────────────────────────────────────────────────
  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(ts => ts.filter(t => t._id !== id));
      fetchAllTasks(); // Refresh counts
      const d = selectedDate || new Date();
      fetchDots(d.getMonth() + 1, d.getFullYear());
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const openEdit = (task) => { setEditTask(task); setView('form'); };
  const openNew = () => {
    setEditTask({
      isRepeating: false,
      oneTimeDate: activeDateStr,
      tags: activeList ? [activeList] : []
    });
    setView('form');
  };
  const closeForm = () => { setView('list'); setEditTask(null); };

  const onTaskSaved = () => {
    fetchTasks();
    fetchAllTasks();
    const d = selectedDate || new Date();
    fetchDots(d.getMonth() + 1, d.getFullYear());
    closeForm();
  };

  // ─── Filtering Logic ──────────────────────────────────────────────────────
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;

    // Status filter
    if (statusFilter === 'todo' && task.isCompleted) return false;
    if (statusFilter === 'completed' && !task.isCompleted) return false;

    // List/Tag filter
    if (activeList && !task.tags?.includes(activeList)) return false;

    return true;
  });

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  // Helper to count tasks for a list
  const getListCount = (name) => allTasks.filter(t => t.tags?.includes(name)).length;

  // Helper to check if a task is scheduled for a specific date (YYYY-MM-DD)
  const isTaskScheduledForDate = (task, dateStr) => {
    if (!task.isRepeating) {
      if (!task.oneTimeDate) return false;
      return task.oneTimeDate.split('T')[0] === dateStr;
    }
    
    const schedule = task.schedule;
    if (!schedule) return false;

    const target = new Date(dateStr + 'T00:00:00Z');
    const startDate = new Date(schedule.startDate || task.createdAt);
    startDate.setUTCHours(0, 0, 0, 0);
    
    if (target < startDate) return false;

    const interval = schedule.interval || 1;

    if (schedule.cycle.daily === 1) {
      const diffDays = Math.floor((target - startDate) / (1000 * 60 * 60 * 24));
      return diffDays % interval === 0;
    }

    if (schedule.cycle.weekly === 1) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = days[target.getUTCDay()];
      if (schedule.weeklyDays[dayName] !== 1) return false;

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
      const dayOfMonth = target.getUTCDate();
      if (!schedule.monthlyDates.includes(dayOfMonth)) return false;

      const diffMonths = (target.getUTCFullYear() - startDate.getUTCFullYear()) * 12 + (target.getUTCMonth() - startDate.getUTCMonth());
      return diffMonths % interval === 0;
    }

    return false;
  };

  // Helper to count tasks for today
  const getTodayCount = () => allTasks.filter(t => isTaskScheduledForDate(t, todayStr)).length;

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`} style={darkMode ? { filter: 'brightness(0.92)' } : {}}>
      {isSidebarOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999, backdropFilter: 'blur(2px)' }}
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ zIndex: 1000, transition: 'all 0.3s ease' }}>
        <button onClick={() => setIsSidebarOpen(false)} className="mobile-close-btn" style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}>
          <X size={20} color="#999" />
        </button>

        <Link to="/dashboard" className="sidebar-nav-logo">
          <div className="logo-icon" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/listify.svg" alt="Listify" />
          </div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '26px' }}>
            Listify
          </span>
        </Link>
        <MiniCalendar
          selectedDate={selectedDate}
          onDateClick={(d) => { setSelectedDate(d); setActiveList(''); }}
          taskDates={calendarDots}
          onMonthChange={fetchDots}
        />

        <div className="sidebar-section">
          <p className="sidebar-section-title">Tasks</p>
          <div
            className={`sidebar-item ${!selectedDate && !activeList && !statusFilter ? 'active' : ''}`}
            onClick={() => { setSelectedDate(null); setActiveList(''); setStatusFilter(''); }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Today</span>
            <span style={{ fontSize: '11px', color: '#999', background: '#f0f0f0', padding: '2px 6px', borderRadius: '10px' }}>{getTodayCount()}</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Lists</p>
          {['Daily Routine', 'Study', 'Work', 'Personal'].map(name => (
            <div
              key={name}
              className={`sidebar-item ${activeList === name ? 'active' : ''}`}
              onClick={() => { setActiveList(name === activeList ? '' : name); setSelectedDate(null); }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{name}</span>
              <span style={{ fontSize: '11px', color: '#999', background: '#f0f0f0', padding: '2px 6px', borderRadius: '10px' }}>{getListCount(name)}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="main-content">
        <div className="top-bar">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', padding: '4px' }}>
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            <button onClick={() => setDarkMode(d => !d)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div
              style={{
                position: "relative",
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Bell size={18} color="#374151" />

              {/* Notification Dot */}

            </div>

            <div style={{ position: "relative" }}>
              {/* Profile Avatar */}
              <div
                title="Profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
                  transition: "0.3s",
                }}
              >
                {initials}
              </div>

              {/* Dropdown */}
              {showProfileMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    right: 0,
                    width: "240px",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    zIndex: 100,
                    animation: "fadeIn 0.2s ease",
                  }}
                >
                  {/* User Info */}
                  <div
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {user.name}
                      </h4>

                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: "8px" }}>


                    <button
                      onClick={logout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        border: "none",
                        background: "transparent",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#ef4444",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="page-content">
          {view === 'list' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '26px' }}>
                  {activeList ? activeList : (isToday ? 'Today' : new Date(activeDateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1.5px solid #e8e8e8' }}
                  />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8e8e8', background: 'white' }}>
                  <option value="">All status</option>
                  <option value="todo">To Do</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Loading tasks...</div>
              ) : filteredTasks.length === 0 ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '100px 20px', 
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.4)',
                  borderRadius: '24px',
                  border: '1.5px dashed #e5e7eb',
                  marginTop: '20px'
                }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: '#f0f4ff', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '20px',
                    color: '#2563eb'
                  }}>
                    <ClipboardCheck size={40} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                    You're all caught up!
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '300px', marginBottom: '24px', lineHeight: 1.6 }}>
                    No tasks found here. Take a break or start planning your next big goal.
                  </p>
                  <button 
                    onClick={openNew}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: '#2563eb', 
                      color: 'white', 
                      padding: '10px 20px', 
                      borderRadius: '12px', 
                      border: 'none', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    <Plus size={18} />
                    Create a Task
                  </button>
                </div>
              ) : (
                <div>
                  {filteredTasks.map(task => (
                    <div key={task._id} className="task-card" style={{ background: task.color || '#f9f9f9', opacity: task.isCompleted ? 0.7 : 1 }}>
                      {/* Checkbox enabled for Today OR when in List view, BUT only if date is not in future */}
                      {(() => {
                        const taskDateStr = task.oneTimeDate ? task.oneTimeDate.split('T')[0] : null;
                        const isUpcoming = taskDateStr && taskDateStr > todayStr;
                        const isCompletable = (isToday || activeList) && !isUpcoming;

                        if (isCompletable) {
                          return (
                            <div className={`task-checkbox ${task.isCompleted ? 'checked' : ''}`} onClick={() => toggleCompletion(task)}>
                              {task.isCompleted && <Check size={12} strokeWidth={3} color="white" />}
                            </div>
                          );
                        } else {
                          return (
                            <div title={isUpcoming ? "Upcoming task - locked" : "Completion only available for Today"} style={{ width: 18, height: 18, borderRadius: '4px', border: '1.5px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed' }}>
                              <Lock size={10} color="#ccc" />
                            </div>
                          );
                        }
                      })()}
                      <div style={{ flex: 1, minWidth: 0, marginLeft: '12px' }}>
                        <p className={`task-title ${task.isCompleted ? 'completed' : ''}`}>{task.title}</p>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {task.description && <p style={{ fontSize: '11px', color: '#777' }}>{task.description}</p>}
                          {activeList && task.oneTimeDate && (
                            <span style={{ fontSize: '10px', color: '#999', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                              {new Date(task.oneTimeDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => openEdit(task)} style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Pencil size={14} color="#555" />
                        </button>
                        <button onClick={() => deleteTask(task._id)} style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <TaskForm task={editTask} onCancel={closeForm} onSaved={onTaskSaved} />
          )}
        </div>
      </div>

      {view === 'list' && (
        <button className="fab" onClick={openNew} title="Add new task">
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
