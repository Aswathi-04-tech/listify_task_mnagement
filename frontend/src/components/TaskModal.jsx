/**
 * TaskModal
 * Slide-in panel for creating or editing a task
 * Matches Listify "New Task" design with color swatches, repeat toggle, tags
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Check, Sparkles } from 'lucide-react';
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

export default function TaskModal({ task, onClose, onSaved }) {
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
      onClose();
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isEdit ? 'Edit Task' : 'New Task'} 
            <Sparkles size={18} color="#7c3aed" />
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center' }}>
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Name your new task"
          style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1.5px solid #e8e8e8', outline: 'none', fontSize: '14px', marginBottom: '14px', background: 'transparent' }}
        />

        <input
          type="text"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe your new task"
          style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1.5px solid #e8e8e8', outline: 'none', fontSize: '13px', marginBottom: '20px', background: 'transparent', color: '#555' }}
        />

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '10px' }}>Card Color</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {COLORS.map(color => (
              <div key={color} className={`color-swatch ${form.color === color ? 'selected' : ''}`} style={{ background: color }} onClick={() => setForm(f => ({ ...f, color }))} />
            ))}
          </div>
        </div>

        {!form.isRepeating && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Select Date</p>
            <input 
              type="date" 
              value={form.oneTimeDate} 
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({ ...f, oneTimeDate: e.target.value }))} 
              style={{ width: '100%', padding: '6px 10px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '13px', background: '#f9f9f9' }} 
            />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Repeat!</p>
            <div className={`toggle ${form.isRepeating ? 'on' : ''}`} onClick={() => setForm(f => ({ ...f, isRepeating: !form.isRepeating }))} />
          </div>
          {form.isRepeating && (
            <div style={{ marginTop: '16px', background: '#fcfcfc', padding: '16px', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
              {/* Cycle Tabs */}
              <div style={{ display: 'flex', background: '#f3f4f6', padding: '2px', borderRadius: '10px', marginBottom: '15px' }}>
                {['daily', 'weekly', 'monthly'].map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, cycle: c }))}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '11px',
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
              {form.cycle === 'weekly' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', marginBottom: '15px' }}>
                  {DAYS_LABELS.map(d => (
                    <button
                      key={d}
                      onClick={() => toggleDay(d)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        fontSize: '9px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '1.5px solid #f0f0f0',
                        background: form.weeklyDays[d] === 1 ? '#111' : 'white',
                        color: form.weeklyDays[d] === 1 ? 'white' : '#666',
                      }}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              {/* Interval Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#444' }}>Repeat</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <select
                    value={form.interval}
                    onChange={e => setForm(f => ({ ...f, interval: e.target.value }))}
                    style={{ border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 500, color: '#666', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="1">Every {form.cycle === 'daily' ? 'day' : form.cycle === 'weekly' ? 'week' : 'month'}</option>
                    <option value="2">Every 2 {form.cycle === 'daily' ? 'days' : form.cycle === 'weekly' ? 'weeks' : 'months'}</option>
                    <option value="3">Every 3 {form.cycle === 'daily' ? 'days' : form.cycle === 'weekly' ? 'weeks' : 'months'}</option>
                    <option value="4">Every 4 {form.cycle === 'daily' ? 'days' : form.cycle === 'weekly' ? 'weeks' : 'months'}</option>
                  </select>
                  <span style={{ color: '#ccc', fontSize: '14px' }}>›</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Lists (Tags)</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Daily Routine', 'Study', 'Work', 'Personal'].map(l => (
              <button key={l} onClick={() => setForm(f => ({ ...f, tags: f.tags.includes(l) ? f.tags.filter(t => t !== l) : [...f.tags, l] }))} style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '11px', background: form.tags.includes(l) ? '#2563eb' : '#f0f0f0', color: form.tags.includes(l) ? 'white' : '#555', border: 'none' }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <button className="done-btn" onClick={handleSubmit} disabled={loading} style={{ position: 'fixed', bottom: '28px', right: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Check size={24} />
      </button>
    </div>
  );
}
