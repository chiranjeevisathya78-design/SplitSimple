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
  Sparkles,
  Zap,
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
import { formatCurrency, formatDate, formatHeaderDate } from '../utils/helpers';
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
        <div className="p-6 bg-white border-3 border-black shadow-[5px_5px_0px_#000] flex items-center gap-3 font-mono font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-black" />
          <span>LOADING LEDGER DESK...</span>
        </div>
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
      {/* 1. Header Desk Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-3 border-black">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#ccff00] border-2 border-black rounded-[3px] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000]">
            <Calendar className="w-3 h-3 text-black" />
            <span>{formatHeaderDate()}</span>
            <span>·</span>
            <span>ACTIVE LEDGER DESK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
            WELCOME, {user?.name?.split(' ')[0] || 'CHIRANJEEVI'}
          </h1>
          <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
            Live multi-group expense ledger and optimized repayment settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/expenses/new">
            <Button variant="yellow" icon={Plus}>
              Record Expense
            </Button>
          </Link>
          <Link to="/settlements">
            <Button variant="cyan" icon={Handshake}>
              Settlement Engine
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Surreal Neo-Brutalist Net Balance Hero Card */}
      <div className="bg-[#000000] text-white border-3 sm:border-4 border-black rounded-[6px] p-6 sm:p-8 relative overflow-hidden shadow-[8px_8px_0px_#000000]">
        {/* Washi Tape Accent */}
        <div className="absolute -top-3 left-10 w-20 h-5 bg-[#ccff00] border border-black/40 rotate-1 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ccff00]">
                ★ GLOBAL NET BALANCE
              </span>
              <span
                className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold uppercase border border-black ${
                  netBalance > 0
                    ? 'bg-[#00c853] text-black'
                    : netBalance < 0
                    ? 'bg-[#ff3b30] text-white'
                    : 'bg-white text-black'
                }`}
              >
                {netBalance > 0
                  ? 'NET CREDITOR (+)'
                  : netBalance < 0
                  ? 'NET DEBTOR (−)'
                  : 'BALANCED (₹0)'}
              </span>
            </div>

            <div className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white leading-none">
              {netBalance >= 0 ? '+' : ''}
              {formatCurrency(Math.abs(netBalance))}
            </div>

            <p className="text-xs font-mono text-neutral-300 mt-2 max-w-md leading-relaxed">
              {netBalance > 0
                ? 'You are owed money overall. Check Smart Settlement to review incoming repayments.'
                : netBalance < 0
                ? 'You have outstanding debts to group members. Settle up to clear obligations.'
                : 'All accounts balanced at zero. You owe nothing and are owed nothing.'}
            </p>
          </div>

          {/* Breakdown Box */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-[#1a1a1a] border-2 border-white/20 p-4 rounded-[4px] shadow-[4px_4px_0px_#ccff00]">
            <div className="pr-6 sm:border-r-2 sm:border-white/20">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#00f0ff]">
                YOU ARE OWED
              </span>
              <p className="text-2xl sm:text-3xl font-display font-black text-white mt-1 leading-none">
                {formatCurrency(summary.youAreOwed)}
              </p>
            </div>

            <div className="pl-1 sm:pl-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff529a]">
                YOU OWE
              </span>
              <p className="text-2xl sm:text-3xl font-display font-black text-[#ff529a] mt-1 leading-none">
                {formatCurrency(summary.youOwe)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Brutalist Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          variant="yellow"
          label="Settlement Engine"
          value="Greedy Solver"
          subtext="Collapses circular debt into minimal peer transactions"
          badge="ACTIVE"
          icon={Zap}
        />
        <StatCard
          variant="cyan"
          label="Total Group Spending"
          value={formatCurrency(summary.totalExpenses)}
          subtext="Cumulative volume logged across registered workspaces"
          icon={Wallet}
        />
        <StatCard
          variant="pink"
          label="Active Groups"
          value={`${summary.activeGroups} Desks`}
          subtext="Bangalore Roommates, Goa Trip, College Friends"
          icon={Users}
        />
      </div>

      {/* 4. Transactions & Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity (8 cols) */}
        <div className="lg:col-span-8 bg-white border-3 border-black rounded-[4px] p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
              <div>
                <h2 className="text-2xl font-display font-black text-black uppercase">
                  Recent Activity
                </h2>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">
                  Latest receipts logged across active groups
                </p>
              </div>
              <Link
                to="/expenses"
                className="font-mono text-xs font-bold uppercase text-black hover:text-[#ff529a] flex items-center gap-1 underline"
              >
                All Expenses <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentExpenses.length > 0 ? (
              <div className="divide-y-2 divide-black">
                {recentExpenses.slice(0, 5).map((expense) => {
                  const groupName =
                    expense.groupId?.name || expense.group?.name || 'Group';
                  const payerName = expense.paidBy?.name || 'Member';

                  return (
                    <div
                      key={expense._id}
                      className="py-3.5 flex items-center justify-between gap-4 transition-colors hover:bg-[#fffef7] px-2 rounded-[2px]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MemberAvatar name={payerName} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-display font-bold text-black truncate">
                            {expense.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 font-mono text-xs text-neutral-600">
                            <span className="font-bold text-black">{groupName}</span>
                            <span>·</span>
                            <span>Paid by {payerName}</span>
                            <span>·</span>
                            <span>{formatDate(expense.date || expense.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-base font-mono font-bold text-black">
                          {formatCurrency(expense.amount)}
                        </p>
                        <span className="inline-block px-1.5 py-0.2 bg-[#ccff00] border border-black text-[9px] font-mono font-bold uppercase rounded-[2px] mt-0.5">
                          {expense.category || 'general'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center font-mono text-neutral-500 text-xs uppercase">
                No recent transactions recorded yet.
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t-2 border-black text-right">
            <Link to="/expenses/new">
              <Button size="sm" variant="yellow" icon={Plus}>
                Record New Expense
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Active Groups (4 cols) */}
        <div className="lg:col-span-4 bg-[#faf7ee] border-3 border-black rounded-[4px] p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
              <div>
                <h2 className="text-2xl font-display font-black text-black uppercase">
                  Active Desks
                </h2>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">
                  Your shared group ledgers
                </p>
              </div>
              <Link
                to="/groups"
                className="font-mono text-xs font-bold uppercase text-black hover:text-[#00f0ff] underline"
              >
                All Groups
              </Link>
            </div>

            <div className="space-y-3">
              {groups.map((group, idx) => {
                const colors = ['bg-[#ccff00]', 'bg-[#ff529a]', 'bg-[#00f0ff]', 'bg-[#ffb703]'];
                const cardColor = colors[idx % colors.length];

                return (
                  <Link
                    key={group._id}
                    to={`/groups/${group._id}`}
                    className="block p-3.5 bg-white border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-sm text-black uppercase">
                        {group.name}
                      </h4>
                      <span className={`px-1.5 py-0.2 ${cardColor} border border-black font-mono text-[9px] font-bold uppercase rounded-[2px]`}>
                        {group.memberCount || group.members?.length || 0} members
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-xs text-neutral-600">
                      <span>Inspect Ledger</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t-2 border-black">
            <Link to="/groups/new" className="block">
              <Button variant="white" className="w-full text-xs">
                + Create New Group
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Monthly Spending Trend Recharts */}
      {monthlyChartData.length > 0 && (
        <div className="bg-white border-3 border-black rounded-[4px] p-6 shadow-[6px_6px_0px_#000000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="text-2xl font-display font-black text-black uppercase">
                Monthly Spending Trajectory
              </h2>
              <p className="text-xs font-mono text-neutral-600 mt-0.5">
                Aggregate billing volume across recent cycles (₹ INR)
              </p>
            </div>
            <span className="px-3 py-1 bg-[#ccff00] border-2 border-black font-mono text-xs font-bold uppercase rounded-[3px] shadow-[2px_2px_0px_#000]">
              PAISE-PRECISION DATA
            </span>
          </div>

          <div className="h-[260px] w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} barSize={36}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#000000" strokeOpacity={0.15} />
                <XAxis
                  dataKey="month"
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
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Expenditure']}
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
      )}
    </div>
  );
}
