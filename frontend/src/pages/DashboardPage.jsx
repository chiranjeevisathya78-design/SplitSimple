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
  Handshake,
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
import { formatCurrency, formatDate, formatHeaderDate, CATEGORIES } from '../utils/helpers';
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

  const netBalance = (summary.youAreOwed || 0) - (summary.youOwe || 0);

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
      {/* 1. Welcome Heading & Date Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#f2f2f3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#777b86] mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatHeaderDate()}</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c]">
            Welcome back, {user?.name?.split(' ')[0] || 'Chiranjeevi'}
          </h1>
          <p className="text-sm text-[#777b86] mt-1.5 max-w-xl">
            Live ledger across your active groups. Review outstanding shares and settle balances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/expenses/new">
            <Button variant="primary" icon={Plus}>
              Add Expense
            </Button>
          </Link>
          <Link to="/settlements">
            <Button variant="peach" icon={Handshake}>
              Smart Settlement
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Featured Net Balance Card (Dark Charcoal #17191c) */}
      <div className="bg-[#17191c] text-white rounded-[24px] border border-white/10 p-8 sm:p-10 shadow-[0_8px_30px_rgba(23,25,28,0.12)] relative overflow-hidden transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#a3a6af]">
                Featured Net Balance
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] text-[11px] font-bold">
                {netBalance > 0
                  ? 'Net Creditor'
                  : netBalance < 0
                  ? 'Net Debtor'
                  : 'Balanced'}
              </span>
            </div>

            <div className="font-editorial text-5xl sm:text-6xl font-normal tracking-tight text-white">
              {netBalance >= 0 ? '+' : ''}
              {formatCurrency(Math.abs(netBalance))}
            </div>

            <p className="text-xs sm:text-sm text-[#a3a6af] mt-2 max-w-md">
              {netBalance > 0
                ? 'You are owed money overall. Check Smart Settlement to review incoming repayments.'
                : netBalance < 0
                ? 'You have outstanding debts to group members. Settle up to clear obligations.'
                : 'All accounts balanced at zero. You owe nothing and are owed nothing.'}
            </p>
          </div>

          {/* Breakdown Pills inside the Hero Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/5 border border-white/10 p-4 sm:p-5 rounded-[20px] backdrop-blur-xs">
            <div className="pr-6 sm:border-r sm:border-white/10">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#a3a6af]">
                You Are Owed
              </span>
              <p className="font-editorial text-2xl sm:text-3xl font-semibold text-white mt-1">
                {formatCurrency(summary.youAreOwed)}
              </p>
            </div>

            <div className="pl-2 sm:pl-6">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#fbe1d1]">
                You Owe
              </span>
              <p className="font-editorial text-2xl sm:text-3xl font-semibold text-[#fbe1d1] mt-1">
                {formatCurrency(summary.youOwe)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Varied Supporting Financial Cards (Color Variation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Peach Accent Card: Smart Settlement Summary */}
        <StatCard
          variant="peach"
          label="Smart Settlement Engine"
          value="Greedy Plan"
          subtext="Debt minimization collapses complex multi-member debts into minimal repayments"
          badge="Greedy Solver"
          action={
            <Link
              to="/settlements"
              className="text-xs font-bold text-[#5d2a1a] flex items-center gap-1.5 hover:underline"
            >
              <span>View Repayment Suggestions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {/* Paper White Card: Total Group Expenses */}
        <StatCard
          variant="white"
          label="Total Group Spending"
          value={formatCurrency(summary.totalExpenses)}
          subtext="Cumulative volume logged across your registered groups"
          icon={Wallet}
        />

        {/* Soft Mist Gray Card: Active Workspaces */}
        <StatCard
          variant="mist"
          label="Active Groups"
          value={`${summary.activeGroups} Workspaces`}
          subtext="Bangalore Roommates, Goa Trip, College Friends"
          icon={Users}
        />
      </div>

      {/* 4. Transactions & Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Transactions (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#f2f2f3]">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  Recent Activity
                </h2>
                <p className="text-xs text-[#777b86] mt-0.5">
                  Latest shared receipts logged across group ledgers
                </p>
              </div>
              <Link
                to="/expenses"
                className="text-xs font-semibold text-[#17191c] hover:underline flex items-center gap-1"
              >
                All Expenses <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentExpenses.length > 0 ? (
              <div className="divide-y divide-[#f2f2f3]">
                {recentExpenses.slice(0, 5).map((expense) => {
                  const groupName =
                    expense.groupId?.name || expense.group?.name || 'Group';
                  const payerName = expense.paidBy?.name || 'Member';
                  const catConfig =
                    CATEGORIES[expense.category] || CATEGORIES.other;

                  return (
                    <div
                      key={expense._id}
                      className="py-4 flex items-center justify-between gap-4 transition-all hover:bg-[#fafafb] px-3 rounded-[16px]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <MemberAvatar name={payerName} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#17191c] truncate">
                            {expense.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#777b86]">
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
                        <span
                          className="inline-block text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: catConfig.bg,
                            color: catConfig.text,
                          }}
                        >
                          {catConfig.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-[#777b86] text-sm">
                No recent transactions recorded yet.
              </div>
            )}
          </div>

          <div className="pt-5 mt-5 border-t border-[#f2f2f3] text-right">
            <Link to="/expenses/new">
              <Button size="sm" variant="primary" icon={Plus}>
                Record New Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Your Groups (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#f2f2f3]">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  Active Groups
                </h2>
                <p className="text-xs text-[#777b86] mt-0.5">
                  Your shared expense spaces
                </p>
              </div>
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
                  className="block p-4 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] hover:border-[#17191c] hover:bg-white hover:shadow-xs transition-all duration-150"
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
                    <span>Inspect Ledger</span>
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

      {/* 5. Monthly Spending Trend Chart */}
      {monthlyChartData.length > 0 && (
        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                Monthly Spending Trend
              </h2>
              <p className="text-xs text-[#777b86] mt-0.5">
                Combined group expenditure over recent billing cycles (in ₹)
              </p>
            </div>
            <span className="text-xs font-semibold text-[#5d2a1a] bg-[#fbe1d1] px-3 py-1 rounded-full">
              Live Billing Data
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
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Expenditure']}
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
