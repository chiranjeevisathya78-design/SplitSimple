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
  ArrowUpRight,
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
        <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
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
    <div className="space-y-8">
      {/* 1. Top Editorial Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e5e7eb]">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1 font-normal">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatHeaderDate()}</span>
            <span>·</span>
            <span>Ledger Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] text-[#0c0a08] font-normal tracking-tight leading-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Chiranjeevi'}
          </h1>
          <p className="text-sm text-[#6d6c6b] mt-1 font-normal max-w-xl">
            Live multi-group expense ledger and optimized repayment settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/expenses/new">
            <Button variant="primary" icon={Plus}>
              Add Expense
            </Button>
          </Link>
          <Link to="/settlements">
            <Button variant="secondary" icon={Handshake}>
              Smart Settlement
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Inverted Obsidian Hero Card (#1a1919) */}
      <div className="bg-[#1a1919] text-white rounded-[16px] border border-white/10 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                Featured Net Balance
              </span>
              <span className="px-2 py-0.5 rounded-[6px] bg-[#e4f222] text-[#0c0a08] text-[10px] uppercase tracking-[0.018em] font-normal">
                {netBalance > 0
                  ? 'Net Creditor'
                  : netBalance < 0
                  ? 'Net Debtor'
                  : 'Balanced'}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-none">
              {netBalance >= 0 ? '+' : ''}
              {formatCurrency(Math.abs(netBalance))}
            </div>

            <p className="text-xs text-[#6d6c6b] mt-2 max-w-md font-normal leading-relaxed">
              {netBalance > 0
                ? 'You are owed money overall. Check Smart Settlement to review incoming repayments.'
                : netBalance < 0
                ? 'You have outstanding debts to group members. Settle up to clear obligations.'
                : 'All accounts balanced at zero. You owe nothing and are owed nothing.'}
            </p>
          </div>

          {/* Breakdown Box inside Hero Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-[12px]">
            <div className="pr-5 sm:border-r sm:border-white/10">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                You Are Owed
              </span>
              <p className="text-2xl sm:text-3xl font-normal text-white mt-1 leading-none">
                {formatCurrency(summary.youAreOwed)}
              </p>
            </div>

            <div className="pl-1 sm:pl-5">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#e4f222] font-normal">
                You Owe
              </span>
              <p className="text-2xl sm:text-3xl font-normal text-[#e4f222] mt-1 leading-none">
                {formatCurrency(summary.youOwe)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ramp Metric Cards (Hairline Borders, 16px Radius) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Smart Settlement */}
        <StatCard
          variant="white"
          label="Settlement Engine"
          value="Greedy Solver"
          subtext="Collapses multi-member circular debt into minimal peer transactions."
          badge="Active"
          action={
            <Link
              to="/settlements"
              className="text-xs text-[#0c0a08] flex items-center gap-1.5 hover:underline font-normal"
            >
              <span>View Repayment Suggestions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {/* Card 2: Cumulative Volume */}
        <StatCard
          variant="white"
          label="Total Group Spending"
          value={formatCurrency(summary.totalExpenses)}
          subtext="Cumulative volume logged across your registered groups"
          icon={Wallet}
        />

        {/* Card 3: Active Groups */}
        <StatCard
          variant="wash"
          label="Active Groups"
          value={`${summary.activeGroups} Desks`}
          subtext="Bangalore Roommates, Goa Trip, College Friends"
          icon={Users}
        />
      </div>

      {/* 4. Transactions & Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Activity (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e7eb]">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-[#0c0a08] tracking-tight">
                  Recent Activity
                </h2>
                <p className="text-xs text-[#6d6c6b] mt-0.5 font-normal">
                  Latest receipts logged across active groups
                </p>
              </div>
              <Link
                to="/expenses"
                className="text-xs text-[#0c0a08] hover:underline flex items-center gap-1 font-normal"
              >
                All Expenses <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentExpenses.length > 0 ? (
              <div className="divide-y divide-[#e5e7eb]">
                {recentExpenses.slice(0, 5).map((expense) => {
                  const groupName =
                    expense.groupId?.name || expense.group?.name || 'Group';
                  const payerName = expense.paidBy?.name || 'Member';

                  return (
                    <div
                      key={expense._id}
                      className="py-3.5 flex items-center justify-between gap-4 transition-colors hover:bg-[#f4f2f0] px-2.5 rounded-[6px]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MemberAvatar name={payerName} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-normal text-[#0c0a08] truncate">
                            {expense.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-[#6d6c6b] font-normal">
                            <span className="text-[#0c0a08]">{groupName}</span>
                            <span>·</span>
                            <span>Paid by {payerName}</span>
                            <span>·</span>
                            <span>{formatDate(expense.date || expense.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-base font-normal text-[#0c0a08]">
                          {formatCurrency(expense.amount)}
                        </p>
                        <span className="inline-block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal mt-0.5">
                          {expense.category || 'general'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-[#6d6c6b] text-sm font-normal">
                No recent transactions recorded yet.
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#e5e7eb] text-right">
            <Link to="/expenses/new">
              <Button size="sm" variant="primary" icon={Plus}>
                Record New Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Your Groups (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e7eb]">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-[#0c0a08] tracking-tight">
                  Active Groups
                </h2>
                <p className="text-xs text-[#6d6c6b] mt-0.5 font-normal">
                  Your shared group workspaces
                </p>
              </div>
              <Link
                to="/groups"
                className="text-xs text-[#0c0a08] hover:underline font-normal"
              >
                All Groups
              </Link>
            </div>

            <div className="space-y-2.5">
              {groups.map((group) => (
                <Link
                  key={group._id}
                  to={`/groups/${group._id}`}
                  className="block p-3.5 rounded-[10px] bg-[#f4f2f0] border border-transparent hover:border-[#0c0a08] hover:bg-white transition-all duration-150"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-normal text-[#0c0a08]">
                      {group.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                      {group.memberCount || group.members?.length || 0} members
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#6d6c6b] font-normal">
                    <span>Inspect Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0c0a08]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-[#e5e7eb]">
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
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-normal text-[#0c0a08] tracking-tight">
                Monthly Spending Trend
              </h2>
              <p className="text-xs text-[#6d6c6b] mt-0.5 font-normal">
                Combined group expenditure over recent billing cycles (in ₹)
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.018em] text-[#0c0a08] bg-[#e4f222] px-2.5 py-0.5 rounded-[6px] font-normal self-start sm:self-auto">
              Live Billing Data
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} barSize={32}>
                <CartesianGrid
                  strokeDasharray="2 2"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="month"
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
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Expenditure']}
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
      )}
    </div>
  );
}
