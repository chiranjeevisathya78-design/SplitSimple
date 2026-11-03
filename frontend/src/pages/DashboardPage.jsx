import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Users,
  Plus,
  Receipt,
  Scale,
  ArrowRight,
  Loader2,
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Home,
  Car,
  Film,
  Heart,
  Zap,
  MoreHorizontal,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, CATEGORIES } from '../utils/helpers';

const categoryIcons = {
  food: Utensils,
  transport: Car,
  entertainment: Film,
  shopping: ShoppingCart,
  utilities: Zap,
  rent: Home,
  health: Heart,
  other: MoreHorizontal,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.get();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  const { summary, recentExpenses, groups, analytics } = data;

  const monthlyChartData = analytics?.monthlySpending
    ? Object.entries(analytics.monthlySpending)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, amount]) => ({
          month: new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          amount: amount / 100,
        }))
    : [];

  const summaryCards = [
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: Wallet,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'You Owe',
      value: formatCurrency(summary.youOwe),
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'You Are Owed',
      value: formatCurrency(summary.youAreOwed),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Active Groups',
      value: summary.activeGroups,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      raw: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 mt-1">Here's your spending overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
            >
              <div className={`${card.bg} p-3 rounded-lg`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={`text-xl font-semibold ${card.color}`}>
                  {card.raw ? card.value : card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <Link to="/expenses" className="text-indigo-600 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentExpenses && recentExpenses.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentExpenses.slice(0, 5).map((expense) => {
                const catKey = (expense.category || 'other').toLowerCase();
                const CatIcon = categoryIcons[catKey] || MoreHorizontal;
                return (
                  <div key={expense._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <CatIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.title || expense.description}</p>
                        <p className="text-xs text-gray-500">
                          {expense.group?.name && <span>{expense.group.name} · </span>}
                          {formatDate(expense.date || expense.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-6 text-center">No recent expenses</p>
          )}
        </div>

        {/* Your Groups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Groups</h2>
            <Link to="/groups" className="text-indigo-600 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {groups && groups.length > 0 ? (
            <div className="space-y-3">
              {groups.map((group) => (
                <Link
                  key={group._id}
                  to={`/groups/${group._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{group.name}</p>
                      <p className="text-xs text-gray-500">{group.memberCount || group.members?.length || 0} members</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-6 text-center">No groups yet</p>
          )}
        </div>
      </div>

      {/* Monthly Spending Chart */}
      {monthlyChartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spending']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/groups/new"
          className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-indigo-200 hover:shadow transition-all"
        >
          <div className="bg-indigo-50 p-3 rounded-lg">
            <Plus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Create Group</p>
            <p className="text-sm text-gray-500">Start splitting expenses</p>
          </div>
        </Link>
        <Link
          to="/expenses/new"
          className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-indigo-200 hover:shadow transition-all"
        >
          <div className="bg-green-50 p-3 rounded-lg">
            <Receipt className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Add Expense</p>
            <p className="text-sm text-gray-500">Record a new expense</p>
          </div>
        </Link>
        <Link
          to="/balances"
          className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-indigo-200 hover:shadow transition-all"
        >
          <div className="bg-purple-50 p-3 rounded-lg">
            <Scale className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">View Balances</p>
            <p className="text-sm text-gray-500">See who owes whom</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
