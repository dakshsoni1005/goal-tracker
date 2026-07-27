import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService.js';
import { goalService } from '../../services/goalService.js';
import { habitService } from '../../services/habitService.js';
import {
  CheckCircle,
  Clock,
  Plus,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { PriorityBadge } from '../../components/ui/Badge.jsx';
import ProgressRing from '../../components/ui/ProgressRing.jsx';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pomodoro States
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work'); // 'work' | 'break'

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  // Pomodoro Clock ticking logic
  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds((s) => s - 1);
        } else if (pomoMinutes > 0) {
          setPomoMinutes((m) => m - 1);
          setPomoSeconds(59);
        } else {
          // Timer finished!
          setPomoActive(false);
          if (pomoMode === 'work') {
            toast.success('Pomodoro complete! Time for a short break.');
            setPomoMode('break');
            setPomoMinutes(5);
          } else {
            toast.success('Break complete! Back to focus.');
            setPomoMode('work');
            setPomoMinutes(25);
          }
          setPomoSeconds(0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoMinutes, pomoSeconds, pomoMode]);

  const fetchDashboardMetrics = async () => {
    try {
      const res = await dashboardService.getDashboardData();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalComplete = async (id) => {
    try {
      const res = await goalService.completeGoal(id);
      if (res.success) {
        toast.success('Goal completed! Keep going!');
        fetchDashboardMetrics(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHabitComplete = async (id) => {
    try {
      const res = await habitService.completeHabit(id);
      if (res.success) {
        toast.success('Habit tracked successfully! Streak updated!');
        fetchDashboardMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pomodoro Handlers
  const togglePomo = () => setPomoActive(!pomoActive);
  const resetPomo = () => {
    setPomoActive(false);
    setPomoMode('work');
    setPomoMinutes(25);
    setPomoSeconds(0);
  };

  const setPomoConfig = (mode, minutes) => {
    setPomoActive(false);
    setPomoMode(mode);
    setPomoMinutes(minutes);
    setPomoSeconds(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const todayGoalsList = data?.goals?.today || [];
  const pendingGoalsList = todayGoalsList.filter(g => g.status === 'pending');
  const completedGoalsList = todayGoalsList.filter(g => g.status === 'completed');
  const habitsList = data?.habits || [];
  
  // Format weekly chart dataset
  const chartData = data?.graphs?.weekly?.map(item => {
    const formattedDate = new Date(item.date).toLocaleDateString('default', { weekday: 'short' });
    return {
      day: formattedDate,
      Completed: item.completedCount,
    };
  }) || [];

  return (
    <div className="space-y-6">
      {/* 1. Overall stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Productivity Score Circular ring */}
        <Card className="flex items-center space-x-6">
          <ProgressRing progress={data?.productivityScore || 0} />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Productivity Score</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Based on {data?.goals?.completedCount || 0} completed goals and active habit streaks.
            </p>
          </div>
        </Card>

        {/* Goals Checklist Counter */}
        <Card className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-400">Goals Due Today</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{todayGoalsList.length}</span>
              <span className="text-xs text-slate-400 font-medium">({pendingGoalsList.length} pending)</span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center">
              <CheckCircle className="h-3 w-3 text-emerald-500 mr-1" />
              <span>{completedGoalsList.length} completed today</span>
            </p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <CheckCircle className="h-6 w-6" />
          </div>
        </Card>

        {/* Focus Widget / Best Streak */}
        <Card className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-400">Habit Streaks</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                {habitsList.length > 0 ? Math.max(...habitsList.map(h => h.streak), 0) : 0}
              </span>
              <span className="text-xs text-slate-400 font-medium">days active</span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center">
              <Zap className="h-3 w-3 text-amber-500 mr-1" />
              <span>Streak builds productivity habits</span>
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Zap className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* 2. Today's Dashboard Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Goals Grid list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Goals Checklist</CardTitle>
            <Link to="/goals" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayGoalsList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400">No goals scheduled for today.</p>
                <Link to="/goals" className="inline-block mt-2">
                  <Button size="sm">+ Create Goal</Button>
                </Link>
              </div>
            ) : (
              todayGoalsList.map((goal) => (
                <div
                  key={goal._id}
                  className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-850 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      onClick={() => goal.status === 'pending' && handleGoalComplete(goal._id)}
                      className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                        goal.status === 'completed'
                          ? 'bg-success border-success text-white'
                          : 'border-slate-350 dark:border-slate-700 hover:border-primary'
                      }`}
                      disabled={goal.status === 'completed'}
                    >
                      {goal.status === 'completed' && (
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      )}
                    </button>
                    <div className="truncate">
                      <p className={`text-xs font-semibold text-slate-800 dark:text-slate-100 truncate ${goal.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                        {goal.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {goal.category?.name || 'Uncategorized'} • {goal.estimatedMinutes || 0} mins
                      </p>
                    </div>
                  </div>
                  <PriorityBadge priority={goal.priority} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pomodoro Timer widget */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Focus Pomodoro</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 py-4">
            {/* Timer digits */}
            <div className="text-center">
              <span className="text-4xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-wider">
                {String(pomoMinutes).padStart(2, '0')}:{String(pomoSeconds).padStart(2, '0')}
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1 flex items-center justify-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{pomoMode === 'work' ? 'Work Interval' : 'Break Time'}</span>
              </p>
            </div>

            {/* Timer configs quick switcher */}
            <div className="flex space-x-2 text-[10px] font-bold">
              <button
                onClick={() => setPomoConfig('work', 25)}
                className={`px-3 py-1.5 rounded-xl border ${pomoMode === 'work' ? 'bg-primary border-primary text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
              >
                Work 25m
              </button>
              <button
                onClick={() => setPomoConfig('break', 5)}
                className={`px-3 py-1.5 rounded-xl border ${pomoMode === 'break' ? 'bg-success border-success text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
              >
                Short 5m
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Button
                variant={pomoActive ? 'outline' : 'primary'}
                size="sm"
                onClick={togglePomo}
                className="flex items-center space-x-1.5"
              >
                {pomoActive ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Start</span>
                  </>
                )}
              </Button>
              <button
                onClick={resetPomo}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Reset Clock"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Habits Checklist & Weekly Progress Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Graph */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Productivity Trends</CardTitle>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
              <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
              <span>Goals Completed</span>
            </span>
          </CardHeader>
          <CardContent className="h-60">
            {chartData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-20">No analytics data available yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B2A999" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#B2A999" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="Completed" stroke="#B2A999" strokeWidth={2} fillOpacity={1} fill="url(#colorGoals)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Habits quick list */}
        <Card>
          <CardHeader>
            <CardTitle>Habits Tracker</CardTitle>
            <Link to="/habits" className="text-xs font-semibold text-primary hover:underline">
              Checklist
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {habitsList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">No active habits. Start one now!</p>
            ) : (
              habitsList.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-850 rounded-2xl"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Flame className="h-4 w-4" style={{ color: habit.color }} />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{habit.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">🔥 Streak: {habit.streak} days</p>
                    </div>
                  </div>
                  <button
                    onClick={() => !habit.isCompletedToday && handleHabitComplete(habit.id)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all ${
                      habit.isCompletedToday
                        ? 'bg-success/15 text-success pointer-events-none'
                        : 'bg-primary hover:bg-primary-dark text-white'
                    }`}
                  >
                    {habit.isCompletedToday ? 'Done' : 'Track'}
                  </button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. AI Coach Planning Suggestions */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start space-x-4">
          <div className="p-2.5 bg-primary/25 rounded-2xl text-primary flex-shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center">
              <span>AI Coach Suggestions</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              {pendingGoalsList.length > 0 ? (
                `You have ${pendingGoalsList.length} pending goals left today. Focus on "${pendingGoalsList[0].title}" first (Priority: ${pendingGoalsList[0].priority}) to make the most of your morning energy!`
              ) : (
                "Fantastic job! All today's scheduled goals are complete. Use the remaining time to review notes or complete habit routines!"
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
