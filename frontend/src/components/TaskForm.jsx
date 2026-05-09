/**
 * TaskForm
 * Standalone form for creating or editing a task
 * Rendered inline in the dashboard instead of a modal
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const COLORS = [
  '#a8e6cf', '#c5b3e6', '#f4c6a8', '#b3d9f4',
  '#fef08a', '#86efac', '#67e8f9', '#818cf8',
  '#c084fc', '#f472b6', '#fb923c', '#f87171', '#e5e7eb',
];

const DAYS_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_FORM = {
  title: '',
  description: '',
  color: '#a8e6cf',
  tags: [],
  isRepeating: false,
  oneTimeDate: '',
  cycle: 'daily',
  dailyTime: '09:00',
  weeklyDays: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
  monthlyDates: '',
  interval: 1,
  startDate: new Date().toISOString().split('T')[0],
};

export default function TaskForm({ task, onCancel, onSaved }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(task?._id);

  useEffect(() => {
    if (task) {
      if (task.schedule) {
        const s = task.schedule;
        const cycle = s.cycle.weekly === 1 ? 'weekly' : s.cycle.monthly === 1 ? 'monthly' : 'daily';
        setForm({
          title: task.title || '',
          description: task.description || '',
          color: task.color || '#a8e6cf',
          tags: task.tags || [],
          isRepeating: task.isRepeating || false,
          oneTimeDate: task.oneTimeDate ? task.oneTimeDate.split('T')[0] : '',
          cycle: cycle,
          dailyTime: s.dailyTime || '09:00',
          weeklyDays: s.weeklyDays || { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
          monthlyDates: (s.monthlyDates || []).join(', '),
          interval: s.interval || 1,
          startDate: s.startDate ? s.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
        });
      } else {
        setForm({
          ...DEFAULT_FORM,
          title: task.title || '',
          description: task.description || '',
          color: task.color || '#a8e6cf',
          tags: task.tags || [],
          isRepeating: task.isRepeating || false,
          oneTimeDate: task.oneTimeDate ? task.oneTimeDate.split('T')[0] : '',
        });
      }
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Please enter a task title'); return; }

    // Validate date for one-time tasks
    if (!form.isRepeating && form.oneTimeDate) {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      if (form.oneTimeDate < todayStr) {
        toast.error(isEdit ? 'Cannot move task to a past date' : 'Cannot create tasks for past dates');
        return;
      }
    }

    setLoading(true);
    try {
      const cycleObj = { daily: 0, weekly: 0, monthly: 0 };
      cycleObj[form.cycle] = 1;

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        color: form.color,
        tags: form.tags,
        isRepeating: form.isRepeating,
        oneTimeDate: form.isRepeating ? null : form.oneTimeDate,
        schedule: form.isRepeating ? {
          cycle: cycleObj,
          dailyTime: form.dailyTime,
          weeklyDays: form.weeklyDays,
          monthlyDates: form.monthlyDates.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)),
          interval: parseInt(form.interval) || 1,
          startDate: form.startDate,
        } : null
      };

      if (isEdit) {
        await api.put(`/tasks/${task._id}`, payload);
        toast.success('Task updated ✅');
      } else {
        await api.post('/tasks', payload);
        toast.success('Task created ✅');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      weeklyDays: { ...f.weeklyDays, [day]: f.weeklyDays[day] === 1 ? 0 : 1 }
    }));
  };

  return (
    <div className="task-form-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '26px' }}>{isEdit ? 'Edit Task' : 'New Task'}</h2>
        <button onClick={onCancel} style={{ background: '#f3f4f6', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Task Name</p>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Name your new task"
            style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '2px solid #2563eb', outline: 'none', fontSize: '18px', fontWeight: 600, background: 'transparent' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Description</p>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe your new task"
            rows="3"
            style={{ width: '100%', padding: '12px', border: '1.5px solid #e8e8e8', borderRadius: '12px', outline: 'none', fontSize: '14px', background: '#f9f9f9', resize: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '10px' }}>Card Color</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {COLORS.map(color => (
              <div key={color} className={`color-swatch ${form.color === color ? 'selected' : ''}`} style={{ background: color, width: '32px', height: '32px' }} onClick={() => setForm(f => ({ ...f, color }))} />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '4px' }}>Repeat</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: '#aaa' }}>Set a cycle for your task</p>
              <div className={`toggle ${form.isRepeating ? 'on' : ''}`} onClick={() => setForm(f => ({ ...f, isRepeating: !f.isRepeating }))} />
            </div>

            {form.isRepeating && (
              <div style={{ marginTop: '16px', background: '#fcfcfc', padding: '16px', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                {/* Cycle Tabs */}
                <div style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
                  {['daily', 'weekly', 'monthly'].map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(f => ({ ...f, cycle: c }))}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: form.cycle === c ? 'white' : 'transparent',
                        color: form.cycle === c ? '#111' : '#666',
                        boxShadow: form.cycle === c ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Specific Configs */}
                {form.cycle === 'daily' && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Time</p>
                    <input type="time" value={form.dailyTime} onChange={e => setForm(f => ({ ...f, dailyTime: e.target.value }))} style={{ padding: '8px', borderRadius: '8px', border: '1.5px solid #e8e8e8', width: '100%', outline: 'none' }} />
                  </div>
                )}

                {form.cycle === 'weekly' && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', marginBottom: '20px' }}>
                      {DAYS_LABELS.map(d => (
                        <button
                          key={d}
                          onClick={() => toggleDay(d)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            fontSize: '10px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1.5px solid #f0f0f0',
                            background: form.weeklyDays[d] === 1 ? '#111' : 'white',
                            color: form.weeklyDays[d] === 1 ? 'white' : '#666',
                            transition: 'all 0.2s'
                          }}
                        >
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {form.cycle === 'monthly' && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Specific Days (comma separated)</p>
                    <input type="text" value={form.monthlyDates} onChange={e => setForm(f => ({ ...f, monthlyDates: e.target.value }))} placeholder="e.g. 1, 15, 28" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #e8e8e8', outline: 'none' }} />
                  </div>
                )}

                {/* Interval Row (Every X week/month) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#444' }}>Repeat</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      value={form.interval}
                      onChange={e => setForm(f => ({ ...f, interval: e.target.value }))}
                      style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 500, color: '#666', cursor: 'pointer', textAlign: 'right', outline: 'none' }}
                    >
                      <option value="1">Every {form.cycle === 'daily' ? 'day' : form.cycle === 'weekly' ? 'week' : 'month'}</option>
                      <option value="2">Every 2 {form.cycle === 'daily' ? 'days' : form.cycle === 'weekly' ? 'weeks' : 'months'}</option>
                      <option value="3">Every 3 {form.cycle === 'daily' ? 'days' : form.cycle === 'weekly' ? 'weeks' : 'months'}</option>
                      <option value="4">Every 4 {form.cycle === 'daily' ? 'days' : form.cycle === 'weekly' ? 'weeks' : 'months'}</option>
                    </select>
                    <span style={{ color: '#ccc', fontSize: '16px' }}>›</span>
                  </div>
                </div>

                <div style={{ marginTop: '10px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>Start from</p>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={{ padding: '8px', borderRadius: '8px', border: '1.5px solid #e8e8e8', width: '100%', outline: 'none', fontSize: '13px' }} />
                </div>
              </div>
            )}
          </div>

          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Lists (Tags)</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {['Daily Routine', 'Study', 'Work', 'Personal'].map(l => (
                <button
                  key={l}
                  onClick={() => setForm(f => ({ ...f, tags: f.tags.includes(l) ? f.tags.filter(t => t !== l) : [...f.tags, l] }))}
                  style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', background: form.tags.includes(l) ? '#2563eb' : '#f0f0f0', color: form.tags.includes(l) ? 'white' : '#555', border: 'none', fontWeight: 600 }}
                >{l}</button>
              ))}
            </div>
          </div>
        </div>

        {!form.isRepeating && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Select Date</p>
            <input
              type="date"
              value={form.oneTimeDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({ ...f, oneTimeDate: e.target.value }))}
              style={{ padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: '12px', background: '#f9f9f9', width: '200px' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onCancel} style={{ padding: '12px 24px', borderRadius: '12px', border: '1.5px solid #e8e8e8', background: 'white', fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '12px 40px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>{loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}</button>
        </div>
      </div>
    </div>
  );
}
