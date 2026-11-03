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
  Legend,
} from 'recharts';
import { Loader2, TrendingUp, PieChart as PieIcon, BarChart3, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardService } from '../services';
import { formatCurrency, CATEGORIES } from '../utils/helpers';
import { StatCard } from '../components/StatCard';

const STEEP_CHART_COLORS = [
  '#17191c', // Ink Black
  '#5d2a1a', // Sienna Brown
  '#777b86', // Slate Gray
  '#a3a6af', // Smoke Gray
  '#fbe1d1', // Blush Peach
  '#3f434a', // Charcoal
  '#979799', // Ash Gray
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
        <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
      </div>
    );
  }

  const summary = data?.summary || { totalExpenses: 0, activeGroups: 0 };
  const analytics = data?.analytics || {};

  // Transform monthly data
  const monthlyData = analytics?.monthlySpending
    ? Object.entries(analytics.monthlySpending)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, paise]) => {
          const [year, m] = month.split('-');
          const date = new Date(parseInt(year), parseInt(m) - 1);
          return {
            name: date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
            amount: paise / 100,
          };
        })
    : [];

  // Transform category data
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

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-[#f2f2f3]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
          Data Insights
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] mt-1">
          Spending Analytics
        </h1>
        <p className="text-sm text-[#777b86] mt-1 max-w-xl">
          Visual breakdowns of monthly trajectories, category allocations, and group spending.
        </p>
      </div>

      {/* Top Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Tracked Spending"
          value={formatCurrency(summary.totalExpenses)}
          subtext="Aggregate volume across all registered workspaces"
          icon={TrendingUp}
        />
        <StatCard
          label="Active Categories"
          value={categoryData.length}
          subtext="Categories actively contributing to group ledgers"
          icon={Tag}
        />
        <StatCard
          label="Reporting Cycle"
          value="6 Months"
          subtext="Rolling window of historical expense analysis"
          badge="Live Data"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Trend Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                Monthly Spending Trend
              </h2>
              <p className="text-xs text-[#777b86] mt-0.5">
                Expenditure volume by calendar month (₹)
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#777b86]" />
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barSize={34}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f2f2f3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#777b86' }}
                  axisLine={{ stroke: '#f2f2f3' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#777b86' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Monthly Total']}
                  contentStyle={{
                    backgroundColor: '#17191c',
                    color: '#ffffff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="amount" fill="#17191c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  Category Share
                </h2>
                <p className="text-xs text-[#777b86] mt-0.5">
                  Proportional division of group resources
                </p>
              </div>
              <PieIcon className="w-5 h-5 text-[#777b86]" />
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STEEP_CHART_COLORS[index % STEEP_CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#17191c',
                      color: '#ffffff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category List */}
          <div className="pt-4 border-t border-[#f2f2f3] space-y-2">
            {categoryData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        STEEP_CHART_COLORS[idx % STEEP_CHART_COLORS.length],
                    }}
                  />
                  <span className="text-[#17191c] font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-[#17191c]">
                  {formatCurrency(item.raw)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
