import React, { useState, useEffect } from 'react';
import { goalService } from '../../services/goalService.js';
import { reminderService } from '../../services/reminderService.js';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { getFormattedDate } from '../../utils/dateHelper.js';

const CalendarPage = () => {
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' | 'week' | 'day'

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const goalsRes = await goalService.getGoals({ limit: 100 });
      if (goalsRes.success) {
        setGoals(goalsRes.data.results || []);
      }

      const remindersRes = await reminderService.getReminders({ limit: 100 });
      if (remindersRes.success) {
        setReminders(remindersRes.data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (view === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else if (view === 'week') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    if (view === 'month') {
      prev.setMonth(prev.getMonth() - 1);
    } else if (view === 'week') {
      prev.setDate(prev.getDate() - 7);
    } else {
      prev.setDate(prev.getDate() - 1);
    }
    setCurrentDate(prev);
  };

  const getEventsForDate = (dateStr) => {
    const matchedGoals = goals.filter((g) => getFormattedDate(g.dueDate) === dateStr);
    const matchedReminders = reminders.filter((r) => getFormattedDate(r.triggerTime) === dateStr);
    return { goals: matchedGoals, reminders: matchedReminders };
  };

  // Month View Renderer
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const cells = [];
    // Pad previous month slots
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ empty: true, key: `empty-${i}` });
    }

    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const { goals: dayGoals, reminders: dayReminders } = getEventsForDate(dateStr);
      cells.push({
        day,
        dateStr,
        goals: dayGoals,
        reminders: dayReminders,
        key: dateStr,
      });
    }

    return (
      <div className="space-y-2">
        {/* Day label headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell) => {
            if (cell.empty) {
              return <div key={cell.key} className="h-28 bg-slate-50/20 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-100 dark:border-slate-850" />;
            }

            const isToday = getFormattedDate(new Date()) === cell.dateStr;

            return (
              <div
                key={cell.key}
                className={`h-28 p-2 text-left rounded-2xl border bg-cardBg-light dark:bg-cardBg-dark flex flex-col justify-between transition-all group hover:border-primary/30 ${
                  isToday 
                    ? 'border-primary ring-1 ring-primary/10 shadow-sm' 
                    : 'border-borderCol-light dark:border-borderCol-dark'
                }`}
              >
                {/* Date digit */}
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-black h-5 w-5 rounded-full flex items-center justify-center ${
                    isToday ? 'bg-primary text-white' : 'text-slate-500'
                  }`}>
                    {cell.day}
                  </span>
                </div>

                {/* Events list preview inside day card */}
                <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5">
                  {cell.goals.map((g) => (
                    <div
                      key={g._id}
                      className="text-[9px] font-bold p-1 rounded-lg border leading-tight truncate flex items-center space-x-1"
                      style={{
                        backgroundColor: g.priority === 'high' ? 'rgba(239, 68, 68, 0.08)' : g.priority === 'medium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                        borderColor: g.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : g.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: g.priority === 'high' ? '#EF4444' : g.priority === 'medium' ? '#D97706' : '#2563EB',
                      }}
                      title={`Goal: ${g.title} (${g.status})`}
                    >
                      <Target className="h-2 w-2 flex-shrink-0" />
                      <span className="truncate">{g.title}</span>
                    </div>
                  ))}

                  {cell.reminders.map((r) => (
                    <div
                      key={r._id}
                      className="text-[9px] font-bold p-1 rounded-lg border bg-indigo-50/40 border-indigo-100 text-indigo-500 leading-tight truncate flex items-center space-x-1"
                      title={`Reminder: ${r.title}`}
                    >
                      <Clock className="h-2 w-2 flex-shrink-0" />
                      <span className="truncate">{r.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Week View Renderer
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    // Find Monday of current week
    const currentDay = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dateStr = getFormattedDate(day);
          const { goals: dayGoals, reminders: dayReminders } = getEventsForDate(dateStr);
          const isToday = getFormattedDate(new Date()) === dateStr;

          return (
            <div key={dateStr} className="space-y-3 text-left">
              {/* Day Header */}
              <div className="text-center p-2 rounded-2xl bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {day.toLocaleDateString('default', { weekday: 'short' })}
                </p>
                <p className={`text-sm font-black mt-0.5 inline-block h-6 w-6 rounded-full flex items-center justify-center mx-auto ${
                  isToday ? 'bg-primary text-white' : 'text-slate-700 dark:text-slate-200'
                }`}>
                  {day.getDate()}
                </p>
              </div>

              {/* Event Stack */}
              <div className="space-y-2 min-h-[300px] bg-slate-50/20 dark:bg-slate-900/10 rounded-2xl border border-dashed border-slate-100 dark:border-slate-850 p-2">
                {dayGoals.map((g) => (
                  <div
                    key={g._id}
                    className="p-2.5 rounded-xl border text-[10px] font-bold space-y-1 bg-cardBg-light dark:bg-cardBg-dark"
                    style={{
                      borderLeft: `4px solid ${g.priority === 'high' ? '#EF4444' : g.priority === 'medium' ? '#F59E0B' : '#2563EB'}`
                    }}
                  >
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Goal</span>
                    <p className="text-slate-800 dark:text-slate-100 font-bold line-clamp-2 leading-tight">{g.title}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{g.estimatedMinutes} mins • {g.status}</p>
                  </div>
                ))}

                {dayReminders.map((r) => (
                  <div key={r._id} className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/20 text-[10px] font-bold space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-indigo-400">Reminder</span>
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold leading-tight truncate">{r.title}</p>
                    <p className="text-[9px] text-slate-400 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(r.triggerTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Day View Renderer
  const renderDayView = () => {
    const dateStr = getFormattedDate(currentDate);
    const { goals: dayGoals, reminders: dayReminders } = getEventsForDate(dateStr);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Goals list for the day */}
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
              <Target className="h-4 w-4 text-primary" />
              <span>Goals Scheduled</span>
            </h3>
            <Badge variant="slate">{dayGoals.length}</Badge>
          </div>
          <div className="space-y-3">
            {dayGoals.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">No goals scheduled for this date.</p>
            ) : (
              dayGoals.map((goal) => (
                <div key={goal._id} className="p-3 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{goal.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{goal.category?.name || 'Category'} • {goal.estimatedMinutes} mins</p>
                  </div>
                  <Badge variant={goal.priority === 'high' ? 'danger' : goal.priority === 'medium' ? 'warning' : 'primary'}>
                    {goal.priority}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Reminders list for the day */}
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span>Reminders & Alerts</span>
            </h3>
            <Badge variant="secondary">{dayReminders.length}</Badge>
          </div>
          <div className="space-y-3">
            {dayReminders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">No reminders set for this date.</p>
            ) : (
              dayReminders.map((rem) => (
                <div key={rem._id} className="p-3 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between bg-indigo-50/10">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{rem.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(rem.triggerTime).toLocaleTimeString()} ({rem.frequency})</span>
                    </p>
                  </div>
                  <Badge variant="slate">{rem.type}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    );
  };

  const getCalendarTitle = () => {
    if (view === 'month') {
      return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('default', { month: 'short' })} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('default', { month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Schedule Calendar</h2>
          <p className="text-xs text-slate-400">Timeline and deadline views of goals and reminders.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* View select buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/50 dark:border-slate-700">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                  view === v
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Navigation Header */}
      <div className="flex items-center justify-between bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPeriod}
            className="p-1.5 rounded-xl border border-borderCol-light dark:border-borderCol-dark hover:bg-slate-50 dark:hover:bg-slate-850"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 w-44 text-center">
            {getCalendarTitle()}
          </h3>
          <button
            onClick={nextPeriod}
            className="p-1.5 rounded-xl border border-borderCol-light dark:border-borderCol-dark hover:bg-slate-50 dark:hover:bg-slate-850"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1.5 text-xs font-bold border border-borderCol-light dark:border-borderCol-dark hover:bg-slate-50 rounded-xl"
        >
          Today
        </button>
      </div>

      {/* 3. Render dynamic views */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <Card className="p-4 border border-borderCol-light dark:border-borderCol-dark">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;
