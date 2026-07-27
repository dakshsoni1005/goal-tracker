import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Zap,
  Target,
  Flame,
  Clock
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

const CHART_COLORS = ['#B2A999', '#D8CCBB', '#F3EEE6', '#423C35', '#6E645A', '#9E9585'];

const AnalyticsPage = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [yearlyStats, setYearlyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const dbRes = await analyticsService.getDashboardAnalytics();
      if (dbRes.success) setDashboardStats(dbRes.data);

      const monRes = await analyticsService.getMonthlyAnalytics();
      if (monRes.success) setMonthlyStats(monRes.data);

      const yrRes = await analyticsService.getYearlyAnalytics();
      if (yrRes.success) setYearlyStats(yrRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Format Category data for PieChart
  const categoryData = dashboardStats?.productivityDetails?.categoryDistribution?.map(item => ({
    name: item.name,
    value: item.count,
    color: item.color || '#3B82F6',
  })) || [];

  // Format goals progress dataset from monthly statistics
  const monthlyGoalsDataset = monthlyStats?.goalsBreakdown?.map(item => ({
    date: new Date(item._id).toLocaleDateString('default', { day: 'numeric', month: 'short' }),
    Goals: item.completedCount,
  })) || [];

  // Format yearly dataset
  const yearlyDataset = yearlyStats?.goalsBreakdown?.map(item => ({
    month: item.monthName,
    Goals: item.completedCount,
    Habits: yearlyStats?.habitsBreakdown?.find(h => h.monthIndex === item.monthIndex)?.completionsCount || 0,
  })) || [];

  const goalStats = dashboardStats?.goalStats || {};
  const habitStats = dashboardStats?.habitStats || {};

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Performance Analytics</h2>
        <p className="text-xs text-slate-400 font-semibold">Weekly, monthly, and yearly productivity breakdowns.</p>
      </div>

      {/* 1. Overall stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Productivity Score</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{dashboardStats?.productivityScore || 0}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
            <TrendingUp className="h-5 w-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Goal Completion</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{goalStats.goalCompletionRatePercent || 0}%</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Target className="h-5 w-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Streak</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{habitStats.currentStreak || 0} days</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Zap className="h-5 w-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Best Day</span>
            <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-2 truncate w-32">
              {dashboardStats?.productivityDetails?.mostProductiveDay || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
            <Award className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* 2. Yearly Double Dataset linechart and Category Piechart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yearly lines trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Yearly completions curves ({yearlyStats?.year || 2026})</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {yearlyDataset.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-24">No yearly statistics logs yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyDataset} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="Goals" stroke="#B2A999" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Habits" stroke="#D8CCBB" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category breakdown piechart */}
        <Card>
          <CardHeader>
            <CardTitle>Categories distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex flex-col items-center justify-between">
            {categoryData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-20 w-full">No category associations recorded</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '10px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Labels legends list */}
                <div className="flex flex-wrap gap-2 justify-center w-full max-h-20 overflow-y-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                  {categoryData.map((entry, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 text-[9px] font-bold text-slate-500">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span>{entry.name} ({entry.value})</span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Monthly daily stats Barchart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily completions breakdown ({monthlyStats?.month || 'Current Month'})</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {monthlyGoalsDataset.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-20">No monthly daily completions logs yet</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGoalsDataset} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="Goals" fill="#B2A999" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
