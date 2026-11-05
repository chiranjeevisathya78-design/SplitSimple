import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Loader2,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Tag,
  Users,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardService } from '../services';
import { formatCurrency, CATEGORIES } from '../utils/helpers';
import { StatCard } from '../components/StatCard';

const RAMP_PALETTE = [
  '#0c0a08', // Ink Black
  '#e4f222', // Highlighter Yellow
  '#6d6c6b', // Ash
  '#1a1919', // Obsidian
  '#a3a3a3', // Neutral gray
  '#d4d4d4', // Smoke
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.get();
      setData(res.data?.data || res.data || {});
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
      </div>
    );
  }

  const summary = data?.summary || { totalExpenses: 0, activeGroups: 0 };
  const analytics = data?.analytics || {};

  // 1. Monthly data
  const monthlyData = analytics?.monthlySpending
    ? Object.entries(analytics.monthlySpending)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, paise]) => {
          const [year, m] = month.split('-');
          const date = new Date(parseInt(year), parseInt(m) - 1);
          return {
            name: date.toLocaleDateString('en-IN', {
              month: 'short',
              year: '2-digit',
            }),
            amount: paise / 100,
          };
        })
    : [];

  // 2. Category data
  const categoryData = analytics?.categoryBreakdown
    ? Object.entries(analytics.categoryBreakdown)
        .filter(([, paise]) => paise > 0)
        .map(([cat, paise]) => ({
          name: CATEGORIES[cat]?.label || cat,
          amount: paise / 100,
          raw: paise,
        }))
        .sort((a, b) => b.amount - a.amount)
    : [];

  // 3. Group spending data
  const groupData = analytics?.groupSpending
    ? Object.entries(analytics.groupSpending)
        .map(([gName, paise]) => ({
          name: gName,
          amount: paise / 100,
          raw: paise,
        }))
        .sort((a, b) => b.amount - a.amount)
    : [];

  // 4. Individual member contributions
  const contributionData = analytics?.memberContributions
    ? Object.entries(analytics.memberContributions)
        .map(([mName, paise]) => ({
          name: mName.split(' ')[0], // first name for clean axis
          fullName: mName,
          amount: paise / 100,
          raw: paise,
        }))
        .sort((a, b) => b.amount - a.amount)
    : [];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="pb-5 border-b border-[#e5e7eb]">
        <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] block mb-1 font-normal">
          Portfolio Analytics
        </span>
        <h1 className="text-3xl sm:text-4xl font-normal text-[#0c0a08] tracking-tight">
          Financial Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#6d6c6b] mt-1 max-w-xl">
          Visual breakdowns of monthly trajectories, category shares, group spending, and individual member contributions.
        </p>
      </div>

      {/* Top Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          variant="dark"
          label="Total Spending Monitored"
          value={formatCurrency(summary.totalExpenses)}
          subtext="Cumulative expenditure volume across all groups"
          icon={TrendingUp}
        />
        <StatCard
          variant="highlight"
          label="Active Groups"
          value={`${summary.activeGroups} Workspaces`}
          subtext="Bangalore Roommates, Goa Trip, College Friends"
          icon={Layers}
        />
        <StatCard
          variant="wash"
          label="Active Categories"
          value={`${categoryData.length} Categories`}
          subtext="Rent, Groceries, Food, Travel, Utilities"
          icon={Tag}
        />
      </div>

      {/* Charts Row 1: Monthly Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[16px] border border-[#e5e7eb] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-normal text-[#0c0a08] tracking-tight">
                  Monthly Spending Trend
                </h2>
                <p className="text-xs text-[#6d6c6b] mt-0.5">
                  Aggregate expenditure over recent billing cycles (₹)
                </p>
              </div>
              <BarChart3 className="w-4 h-4 text-[#6d6c6b]" />
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barSize={32}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6d6c6b' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6d6c6b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Monthly Spend']}
                    contentStyle={{
                      backgroundColor: '#1a1919',
                      color: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '11px',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Bar dataKey="amount" fill="#0c0a08" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[16px] border border-[#e5e7eb] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-normal text-[#0c0a08] tracking-tight">
                  Category Share
                </h2>
                <p className="text-xs text-[#6d6c6b] mt-0.5">
                  Proportional division of group funds
                </p>
              </div>
              <PieIcon className="w-4 h-4 text-[#6d6c6b]" />
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={RAMP_PALETTE[index % RAMP_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#1a1919',
                      color: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '11px',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e7eb] space-y-2">
            {categoryData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-[3px]"
                    style={{
                      backgroundColor:
                        RAMP_PALETTE[idx % RAMP_PALETTE.length],
                    }}
                  />
                  <span className="text-[#0c0a08] font-normal">{item.name}</span>
                </div>
                <span className="text-[#0c0a08] font-normal">
                  {formatCurrency(item.raw)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Group Spending Comparison & Individual Contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Spending Comparison Chart */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-normal text-[#0c0a08] tracking-tight">
                Group Spending Comparison
              </h2>
              <p className="text-xs text-[#6d6c6b] mt-0.5">
                Total expenditure volume per workspace (₹)
              </p>
            </div>
            <Users className="w-4 h-4 text-[#6d6c6b]" />
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#6d6c6b' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#0c0a08' }}
                  axisLine={false}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Total Spent']}
                  contentStyle={{
                    backgroundColor: '#1a1919',
                    color: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="amount" fill="#0c0a08" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Outlays (Who Paid What) */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-normal text-[#0c0a08] tracking-tight">
                Individual Member Outlays
              </h2>
              <p className="text-xs text-[#6d6c6b] mt-0.5">
                Total amounts fronted / paid by each member (₹)
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-[#6d6c6b]" />
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionData} barSize={28}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#0c0a08' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#6d6c6b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `₹${val.toLocaleString('en-IN')}`,
                    item.payload.fullName,
                  ]}
                  contentStyle={{
                    backgroundColor: '#1a1919',
                    color: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="amount" fill="#0c0a08" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
