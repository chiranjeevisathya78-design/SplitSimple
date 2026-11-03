import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  Plus,
  Receipt,
  Scale,
  Users,
  Loader2,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, CATEGORIES } from '../utils/helpers';
import { StatCard, MemberAvatar } from '../components/StatCard';
import { Button, SecondaryButton } from '../components/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.get();
        setData(res.data?.data || res.data);
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
        <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
      </div>
    );
  }

  const summary = data?.summary || {
    totalExpenses: 0,
    youOwe: 0,
    youAreOwed: 0,
    activeGroups: 0,
  };
  const recentExpenses = data?.recentExpenses || [];
  const groups = data?.groups || [];
  const analytics = data?.analytics || {};

  const netBalance = summary.youAreOwed - summary.youOwe;

  // Chart data from backend
  const monthlyChartData = analytics?.monthlySpending
    ? Object.entries(analytics.monthlySpending)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, paise]) => {
          const [year, m] = month.split('-');
          const date = new Date(parseInt(year), parseInt(m) - 1);
          return {
            month: date.toLocaleDateString('en-IN', { month: 'short' }),
            amount: paise / 100,
          };
        })
    : [];

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#f2f2f3]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Financial Overview
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Chiranjeevi'}
          </h1>
          <p className="text-sm text-[#777b86] mt-2 max-w-xl">
            Track active groups, monitor your individual ledger, and settle debts with optimized transfers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/expenses/new">
            <Button variant="primary" icon={Plus}>
              Add Expense
            </Button>
          </Link>
          <Link to="/settlements">
            <Button variant="peach" icon={Scale}>
              Smart Settlement
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Net Balance Hero Card */}
      <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Your Net Group Balance
          </span>
          <div className="font-editorial text-4xl sm:text-5xl font-semibold mt-2 text-[#17191c]">
            {netBalance >= 0 ? '+' : ''}
            {formatCurrency(Math.abs(netBalance))}
          </div>
          <p className="text-xs text-[#777b86] mt-1.5">
            {netBalance > 0
              ? 'You are owed money overall across your groups.'
              : netBalance < 0
              ? 'You owe money to your group members. Check settlements to resolve.'
              : 'You are completely settled up with all group members.'}
          </p>
        </div>

        <div className="flex items-center gap-6 divide-x divide-[#f2f2f3] pt-4 md:pt-0">
          <div className="pr-6">
            <span className="text-xs text-[#777b86] uppercase font-semibold">You Are Owed</span>
            <p className="font-editorial text-2xl font-semibold text-[#17191c] mt-1">
              {formatCurrency(summary.youAreOwed)}
            </p>
          </div>
          <div className="pl-6">
            <span className="text-xs text-[#777b86] uppercase font-semibold">You Owe</span>
            <p className="font-editorial text-2xl font-semibold text-[#5d2a1a] mt-1">
              {formatCurrency(summary.youOwe)}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total Group Spending"
          value={formatCurrency(summary.totalExpenses)}
          subtext="Cumulative expenses logged across all your groups"
          icon={Wallet}
        />
        <StatCard
          label="Active Groups"
          value={summary.activeGroups}
          subtext="Bangalore Roommates, Goa Trip, College Friends"
          icon={Users}
        />
        <StatCard
          label="Smart Settlement Status"
          value="Calculated"
          subtext="Greedy creditor-debtor optimization engine active"
          badge="Ready to Settle"
        />
      </div>

      {/* Main Content: Recent Expenses + Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Expenses (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#f2f2f3]">
            <div>
              <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                Recent Transactions
              </h2>
              <p className="text-xs text-[#777b86] mt-0.5">
                Latest shared expenses across all workspaces
              </p>
            </div>
            <Link
              to="/expenses"
              className="text-xs font-semibold text-[#17191c] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentExpenses.length > 0 ? (
            <div className="divide-y divide-[#f2f2f3]">
              {recentExpenses.slice(0, 6).map((expense) => {
                const groupName =
                  expense.groupId?.name || expense.group?.name || 'Group';
                const payerName = expense.paidBy?.name || 'Member';
                return (
                  <div
                    key={expense._id}
                    className="py-4 flex items-center justify-between gap-4 transition-colors hover:bg-[#fafafb] px-2 rounded-[12px]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <MemberAvatar name={payerName} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#17191c] truncate">
                          {expense.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#777b86]">
                          <span className="font-medium text-[#17191c]">{groupName}</span>
                          <span>·</span>
                          <span>Paid by {payerName}</span>
                          <span>·</span>
                          <span>{formatDate(expense.date || expense.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-editorial text-lg font-semibold text-[#17191c]">
                        {formatCurrency(expense.amount)}
                      </p>
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#f2f2f3] text-[#777b86] uppercase tracking-wider font-semibold">
                        {expense.splitType || 'Equal'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-[#777b86] text-sm">
              No recent expenses. Click "Add Expense" to start.
            </div>
          )}
        </div>

        {/* Right Column: Your Groups (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#f2f2f3]">
              <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                Your Groups
              </h2>
              <Link
                to="/groups"
                className="text-xs font-semibold text-[#17191c] hover:underline"
              >
                All Groups
              </Link>
            </div>

            <div className="space-y-3">
              {groups.map((group) => (
                <Link
                  key={group._id}
                  to={`/groups/${group._id}`}
                  className="block p-4 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] hover:border-[#17191c] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#17191c]">
                      {group.name}
                    </h4>
                    <span className="text-xs font-medium text-[#777b86]">
                      {group.memberCount || group.members?.length || 0} members
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#777b86]">
                    <span>Open group ledger</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#17191c]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#f2f2f3]">
            <Link to="/groups/new" className="block">
              <SecondaryButton className="w-full text-xs">
                + Create New Group
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Monthly Spending Chart Section */}
      {monthlyChartData.length > 0 && (
        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                Monthly Spending Trend
              </h2>
              <p className="text-xs text-[#777b86] mt-0.5">
                Total expenditure volume over recent billing cycles (in ₹)
              </p>
            </div>
            <span className="text-xs font-medium text-[#777b86]">
              Updated in real-time
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} barSize={36}>
                <CartesianGrid
                  strokeDasharray="2 2"
                  vertical={false}
                  stroke="#f2f2f3"
                />
                <XAxis
                  dataKey="month"
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
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Group Spend']}
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
      )}
    </div>
  );
}
