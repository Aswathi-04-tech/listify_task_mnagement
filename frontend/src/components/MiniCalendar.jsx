/**
 * MiniCalendar
 * Small calendar shown in the dashboard sidebar
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

export default function MiniCalendar({ selectedDate, onDateClick, taskDates = [], onMonthChange }) {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });

  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  // Monday-first: get offset (0=Mon...6=Sun)
  const firstDay = new Date(current.year, current.month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => {
    setCurrent(c => {
      const next = c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year };
      if (onMonthChange) onMonthChange(next.month + 1, next.year);
      return next;
    });
  };

  const nextMonth = () => {
    setCurrent(c => {
      const next = c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year };
      if (onMonthChange) onMonthChange(next.month + 1, next.year);
      return next;
    });
  };

  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const isSelected = (d) => {
    if (!selectedDate || !d) return false;
    const sel = new Date(selectedDate);
    return d === sel.getDate() &&
           current.month === sel.getMonth() &&
           current.year === sel.getFullYear();
  };

  const hasTask = (d) => {
    if (!d) return false;
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return taskDates.some(td => td.startsWith(dateStr));
  };

  // Build grid cells
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <button
          onClick={prevMonth}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px', display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={16} />
        </button>
        <span>{MONTHS[current.month]} <span style={{ color: '#999', fontWeight: 400 }}>{current.year}</span></span>
        <button
          onClick={nextMonth}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px', display: 'flex', alignItems: 'center' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mini-calendar-grid">
        {DAYS.map(d => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`cal-day ${d && isToday(d) ? 'today' : ''} ${d && isSelected(d) ? 'selected' : ''} ${d && hasTask(d) ? 'has-task' : ''} ${!d ? 'other-month' : ''}`}
            onClick={() => d && onDateClick && onDateClick(new Date(current.year, current.month, d))}
          >
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  );
}
