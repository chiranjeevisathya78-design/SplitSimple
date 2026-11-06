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
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardService } from '../services';
import { formatCurrency, CATEGORIES } from '../utils/helpers';
import { StatCard } from '../components/StatCard';

const BRUTAL_CHART_COLORS = [
  '#ccff00', // Neon Lime
  '#ff529a', // Acid Pink
  '#00f0ff', // Electric Cyan
  '#ff8800', // Tangerine Orange
  '#b388ff', // Electric Purple
  '#00e676', // Acid Green
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
      <div className="flex items-center justify-center min-h-[60vh] font-mono font-bold">
        <Loader2 className="w-6 h-6 animate-spin text-black mr-2" />
        <span>PROCESSING FINANCIAL ANALYTICS...</span>
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
      <div className="pb-6 border-b-3 border-black">
        <span className="px-2.5 py-0.5 bg-[#b388ff] text-black border-2 border-black rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-[2px_2px_0px_#000]">
          DATA INTELLIGENCE
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
          FINANCIAL ANALYTICS
        </h1>
        <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
          Visual breakdowns of billing trajectories, category shares, group volumes, and individual fronted costs.
        </p>
      </div>

      {/* Top Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          variant="yellow"
          label="Total Spending Monitored"
          value={formatCurrency(summary.totalExpenses)}
          subtext="Cumulative expenditure volume across all groups"
          icon={TrendingUp}
        />
        <StatCard
          variant="pink"
          label="Active Groups"
          value={`${summary.activeGroups} Desks`}
          subtext="Bangalore Roommates, Goa Trip, College Friends"
          icon={Layers}
        />
        <StatCard
          variant="cyan"
          label="Active Categories"
          value={`${categoryData.length} Categories`}
          subtext="Rent, Groceries, Food, Travel, Utilities"
          icon={Tag}
        />
      </div>

      {/* Charts Row 1: Monthly Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Trend Bar Chart (7 cols) */}
        <div className="lg:col-span-7 glass-brutal-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black">
              <div>
                <h2 className="text-2xl font-display font-black text-black uppercase">
                  Monthly Trajectory
                </h2>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">
                  Aggregate billing across cycles (₹ INR)
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-black" />
            </div>

            <div className="h-[260px] w-full font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barSize={34}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#000000" strokeOpacity={0.15} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#000000', fontFamily: 'Space Mono' }}
                    axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#000000', fontFamily: 'Space Mono' }}
                    axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Monthly Spend']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      borderRadius: '4px',
                      border: '2px solid #000000',
                      boxShadow: '4px 4px 0px #000000',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    itemStyle={{ color: '#000000' }}
                  />
                  <Bar dataKey="amount" fill="#ccff00" stroke="#000000" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown Donut Chart (5 cols) */}
        <div className="lg:col-span-5 glass-brutal-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black">
              <div>
                <h2 className="text-2xl font-display font-black text-black uppercase">
                  Category Share
                </h2>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">
                  Proportional division of group funds
                </p>
              </div>
              <PieIcon className="w-5 h-5 text-black" />
            </div>

            <div className="h-[180px] w-full font-mono">
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
                    stroke="#000000"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BRUTAL_CHART_COLORS[index % BRUTAL_CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      borderRadius: '4px',
                      border: '2px solid #000000',
                      boxShadow: '4px 4px 0px #000000',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    itemStyle={{ color: '#000000' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-black space-y-2 font-mono">
            {categoryData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 border border-black rounded-[2px]"
                    style={{
                      backgroundColor:
                        BRUTAL_CHART_COLORS[idx % BRUTAL_CHART_COLORS.length],
                    }}
                  />
                  <span className="text-black uppercase">{item.name}</span>
                </div>
                <span className="text-black">
                  {formatCurrency(item.raw)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Group Spending Comparison & Individual Contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Group Spending Comparison Chart */}
        <div className="glass-brutal-card p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black">
            <div>
              <h2 className="text-2xl font-display font-black text-black uppercase">
                Group Volume
              </h2>
              <p className="text-xs font-mono text-neutral-600 mt-0.5">
                Total expenditure volume per workspace (₹ INR)
              </p>
            </div>
            <Users className="w-5 h-5 text-black" />
          </div>

          <div className="h-[240px] w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupData} layout="vertical" barSize={22}>
                <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#000000" strokeOpacity={0.15} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#000000', fontFamily: 'Space Mono' }}
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#000000', fontFamily: 'Space Mono' }}
                  axisLine={false}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Total Spent']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    borderRadius: '4px',
                    border: '2px solid #000000',
                    boxShadow: '4px 4px 0px #000000',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  itemStyle={{ color: '#000000' }}
                />
                <Bar dataKey="amount" fill="#ff529a" stroke="#000000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Outlays (Who Paid What) */}
        <div className="glass-brutal-card p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black">
            <div>
              <h2 className="text-2xl font-display font-black text-black uppercase">
                Member Fronted Outlays
              </h2>
              <p className="text-xs font-mono text-neutral-600 mt-0.5">
                Total expenditure upfronted by each member (₹ INR)
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-black" />
          </div>

          <div className="h-[240px] w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionData} barSize={28}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#000000" strokeOpacity={0.15} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#000000', fontFamily: 'Space Mono' }}
                  axisLine={{ stroke: '#000000', strokeWidth: 2 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#000000', fontFamily: 'Space Mono' }}
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
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    borderRadius: '4px',
                    border: '2px solid #000000',
                    boxShadow: '4px 4px 0px #000000',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  itemStyle={{ color: '#000000' }}
                />
                <Bar dataKey="amount" fill="#00f0ff" stroke="#000000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
