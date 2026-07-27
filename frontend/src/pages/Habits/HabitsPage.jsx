import React, { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService.js';
import {
  Plus,
  Flame,
  Check,
  Calendar,
  Trash2,
  TrendingUp,
  Award,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { getFormattedDate } from '../../utils/dateHelper.js';
import toast from 'react-hot-toast';

const habitSchema = zod.object({
  title: zod.string().min(1, 'Title is required').max(100),
  icon: zod.string().default('Flame'),
  color: zod.string().default('#10B981'),
  frequency: zod.enum(['daily', 'weekly', 'custom']),
  target: zod.coerce.number().min(1, 'Target must be at least 1'),
});

const iconOptions = [
  { value: 'Activity', label: 'Activity 📈' },
  { value: 'Flame', label: 'Flame 🔥' },
  { value: 'Droplet', label: 'Droplet 💧' },
  { value: 'BookOpen', label: 'Book 📖' },
  { value: 'Dumbbell', label: 'Dumbbell 🏋️' },
  { value: 'Heart', label: 'Heart ❤️' },
];

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitForStats, setSelectedHabitForStats] = useState(null);
  const [statsMonthOffset, setStatsMonthOffset] = useState(0); // 0 = current month, -1 = last month

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      color: '#10B981',
      icon: 'Flame',
      frequency: 'daily',
      target: 1,
    }
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await habitService.getHabits();
      if (res.success && res.data) {
        const list = res.data.results || [];
        setHabits(list);
        if (list.length > 0 && !selectedHabitForStats) {
          setSelectedHabitForStats(list[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      const res = await habitService.createHabit(values);
      if (res.success) {
        toast.success('Habit created! Time to build a streak!');
        fetchHabits();
        reset();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (habit) => {
    const todayStr = getFormattedDate();
    if (habit.completedDates.includes(todayStr)) {
      toast.error('Already tracked for today!');
      return;
    }
    try {
      const res = await habitService.completeHabit(habit._id);
      if (res.success) {
        toast.success('Habit completed! Keep the streak alive! 🔥');
        
        // Update local list
        setHabits(prev => prev.map(h => h._id === habit._id ? res.data : h));
        if (selectedHabitForStats?._id === habit._id) {
          setSelectedHabitForStats(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this habit and all history?')) return;
    try {
      const res = await habitService.deleteHabit(id);
      if (res.success) {
        toast.success('Habit deleted');
        const remaining = habits.filter(h => h._id !== id);
        setHabits(remaining);
        if (selectedHabitForStats?._id === id) {
          setSelectedHabitForStats(remaining[0] || null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate monthly heatmap dates grid
  const renderHeatmapGrid = () => {
    if (!selectedHabitForStats) return null;

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + statsMonthOffset);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    // Days in selected month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // First day of month offset
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.

    const daysGrid = [];
    // Pad empty slots before first day
    for (let i = 0; i < firstDayIndex; i++) {
      daysGrid.push({ empty: true, key: `empty-${i}` });
    }

    const monthStrPrefix = `${year}-${String(month + 1).padStart(2, '0')}`; // YYYY-MM

    for (let day = 1; day <= totalDays; day++) {
      const dayStr = `${monthStrPrefix}-${String(day).padStart(2, '0')}`;
      const completed = selectedHabitForStats.completedDates?.includes(dayStr);
      daysGrid.push({ day, dayStr, completed, key: dayStr });
    }

    return (
      <div className="space-y-4">
        {/* Heatmap header navigation */}
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              {targetDate.toLocaleString('default', { month: 'long', year: 'numeric' })} completions
            </span>
          </h4>
          <div className="flex space-x-1">
            <button
              onClick={() => setStatsMonthOffset(prev => prev - 1)}
              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setStatsMonthOffset(0)}
              className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
            >
              Today
            </button>
            <button
              disabled={statsMonthOffset >= 0}
              onClick={() => setStatsMonthOffset(prev => prev + 1)}
              className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Calendar Day headers */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-slate-400 font-bold">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        {/* Heatmap grid items */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysGrid.map((cell) => {
            if (cell.empty) {
              return <div key={cell.key} className="h-8 w-8" />;
            }
            return (
              <div
                key={cell.key}
                className={`h-8 w-8 text-[10px] font-bold rounded-lg flex items-center justify-center transition-all ${
                  cell.completed
                    ? 'text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                style={cell.completed ? { backgroundColor: selectedHabitForStats.color } : {}}
                title={cell.dayStr}
              >
                {cell.day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const todayStr = getFormattedDate();

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Routine Habits</h2>
          <p className="text-xs text-slate-400">Track streaks, targets, and build daily practices.</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>New Habit</span>
        </Button>
      </div>

      {/* 2. Habits Listing and Heatmap workspace splits */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-20 bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark rounded-2xl">
          <p className="text-sm text-slate-400">No habit routines tracking yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List panel */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Active Tracker</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => {
                const completedToday = habit.completedDates?.includes(todayStr);
                const selected = selectedHabitForStats?._id === habit._id;
                
                return (
                  <Card
                    key={habit._id}
                    onClick={() => setSelectedHabitForStats(habit)}
                    className={`text-left border transition-all ${
                      selected ? 'border-primary ring-1 ring-primary/20' : 'border-borderCol-light dark:border-borderCol-dark'
                    }`}
                    hoverEffect
                  >
                    <CardContent className="space-y-4">
                      {/* Top icon & color info */}
                      <div className="flex justify-between items-start">
                        <div
                          className="p-2.5 rounded-xl text-white shadow-sm"
                          style={{ backgroundColor: habit.color }}
                        >
                          <Flame className="h-4 w-4" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(habit._id);
                          }}
                          className="p-1 text-slate-400 hover:text-danger hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
                          title="Delete Habit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{habit.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Frequency: {habit.frequency}
                        </p>
                      </div>

                      {/* Streaks counters */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Streak</p>
                          <p className="text-sm font-black text-slate-850 dark:text-slate-150 flex items-center justify-center space-x-1">
                            <Zap className="h-3.5 w-3.5 text-amber-500 fill-current" />
                            <span>{habit.streak}d</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Best</p>
                          <p className="text-sm font-black text-slate-850 dark:text-slate-150 flex items-center justify-center space-x-1">
                            <Award className="h-3.5 w-3.5 text-primary" />
                            <span>{habit.bestStreak}d</span>
                          </p>
                        </div>
                      </div>

                      {/* Track Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(habit);
                        }}
                        className={`w-full py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                          completedToday
                            ? 'bg-success/10 text-success pointer-events-none'
                            : 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-650'
                        }`}
                      >
                        {completedToday ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Tracked Today</span>
                          </>
                        ) : (
                          <span>Mark Complete</span>
                        )}
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Details & Monthly Heatmap */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Habit Analytics</h3>
            {selectedHabitForStats ? (
              <Card>
                <CardHeader className="border-b-0 pb-0">
                  <CardTitle className="text-sm font-black">{selectedHabitForStats.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-3">
                  {/* Heatmap Grid */}
                  {renderHeatmapGrid()}
                  
                  {/* Overview details */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Total completions:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{selectedHabitForStats.completedDates?.length || 0} times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Streak record:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{selectedHabitForStats.bestStreak} days max</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <p className="text-xs text-slate-400">Select a habit card to view completions heatmap calendar.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 3. Modal: Create Habit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Track New Routine Habit">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Habit Name"
            placeholder="e.g. Read Tech Articles"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Select Icon"
              options={iconOptions}
              error={errors.icon?.message}
              {...register('icon')}
            />

            <Select
              label="Frequency Schedule"
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'custom', label: 'Custom' },
              ]}
              error={errors.frequency?.message}
              {...register('frequency')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Completions Color"
              type="color"
              error={errors.color?.message}
              {...register('color')}
            />

            <Input
              label="Target per frequency"
              type="number"
              error={errors.target?.message}
              {...register('target')}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Habit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HabitsPage;
