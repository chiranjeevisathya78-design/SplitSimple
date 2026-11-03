import { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
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
import { dashboardService } from '../services';
import { CATEGORIES } from '../utils/helpers';

const CHART_COLORS = [
  '#6366f1',
  '#f97316',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#eab308',
  '#f43f5e',
  '#06b6d4',
  '#8b5cf6',
  '#64748b',
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.get();
      const data = res.data?.data || res.data || {};
      setAnalytics(data.analytics || data);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Transform monthly spending data
  const getMonthlyData = () => {
    if (!analytics?.monthlySpending) return [];
    return Object.entries(analytics.monthlySpending)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, paise]) => {
        const [year, m] = month.split('-');
        const date = new Date(parseInt(year), parseInt(m) - 1);
        const label = date.toLocaleDateString('en-IN', {
          month: 'short',
          year: '2-digit',
        });
        return {
          month: label,
          amount: paise / 100,
        };
      });
  };

  // Transform category breakdown data
  const getCategoryData = () => {
    if (!analytics?.categoryBreakdown) return [];
    return Object.entries(analytics.categoryBreakdown)
      .filter(([, paise]) => paise > 0)
      .map(([cat, paise], idx) => ({
        name: CATEGORIES[cat]?.label || cat,
        value: paise / 100,
        color: CATEGORIES[cat]?.color || CHART_COLORS[idx % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  };

  const monthlyData = !loading ? getMonthlyData() : [];
  const categoryData = !loading ? getCategoryData() : [];
  const totalSpent = categoryData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-indigo-600 font-semibold">
            ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm font-semibold" style={{ color: payload[0].payload.color }}>
            ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / totalSpent) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">
          Insights into your spending patterns and habits
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Categories</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Months Tracked</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{monthlyData.length}</p>
        </div>
      </div>

      {/* Monthly Spending Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Monthly Spending</h2>
        </div>

        {monthlyData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p>No monthly spending data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Category Distribution
          </h2>
        </div>

        {categoryData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <PieChartIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p>No category data yet</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend */}
            <div className="w-full lg:w-1/2">
              <div className="space-y-2">
                {categoryData.map((cat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{cat.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {((cat.value / totalSpent) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
