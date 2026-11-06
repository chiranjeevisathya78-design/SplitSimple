import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ArrowRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  Handshake,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import { MemberAvatar, StatCard } from '../components/StatCard';
import { Button } from '../components/Button';

export default function BalancesPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [groupBalances, setGroupBalances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const res = await groupService.getAll();
      const rawGroups =
        res.data?.data?.groups || res.data?.groups || res.data?.data || [];
      const groupList = Array.isArray(rawGroups) ? rawGroups : [];
      setGroups(groupList);

      const balMap = {};
      await Promise.all(
        groupList.map(async (g) => {
          try {
            const bRes = await groupService.getBalances(g._id);
            balMap[g._id] =
              bRes.data?.data?.balances || bRes.data?.balances || [];
          } catch {
            balMap[g._id] = [];
          }
        })
      );
      setGroupBalances(balMap);
    } catch {
      toast.error('Failed to load group balances');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono font-bold">
        <Loader2 className="w-6 h-6 animate-spin text-black mr-2" />
        <span>CALCULATING NET BALANCES...</span>
      </div>
    );
  }

  // Calculate user overall totals across all groups
  let totalYouAreOwed = 0;
  let totalYouOwe = 0;

  Object.values(groupBalances).forEach((balances) => {
    balances.forEach((b) => {
      const uid = b.user?._id || b.userId;
      if (uid && user && uid.toString() === user._id.toString()) {
        if (b.balance > 0) totalYouAreOwed += b.balance;
        if (b.balance < 0) totalYouOwe += Math.abs(b.balance);
      }
    });
  });

  const netOverall = totalYouAreOwed - totalYouOwe;

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-3 border-black">
        <div>
          <span className="px-2.5 py-0.5 bg-[#ccff00] text-black border-2 border-black rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-[2px_2px_0px_#000]">
            NET ACCOUNTING
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
            MEMBER BALANCES
          </h1>
          <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
            Real-time net standing across all your registered roommate & trip ledgers.
          </p>
        </div>

        <Link to="/settlements">
          <Button variant="cyan" icon={Handshake}>
            Launch Settlement Desk
          </Button>
        </Link>
      </div>

      {/* Top Net Position Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          variant={netOverall >= 0 ? 'yellow' : 'pink'}
          label="Your Net Portfolio Standing"
          value={`${netOverall >= 0 ? '+' : '−'}${formatCurrency(Math.abs(netOverall))}`}
          subtext={
            netOverall > 0
              ? 'You are owed money across all workspaces'
              : netOverall < 0
              ? 'You have unsettled debts to flatmates'
              : 'All accounts settled at zero'
          }
          icon={Scale}
        />

        <StatCard
          variant="white"
          label="Incoming to You"
          value={formatCurrency(totalYouAreOwed)}
          subtext="Total amount others owe to your account"
          icon={TrendingUp}
        />

        <StatCard
          variant="white"
          label="Outgoing to Others"
          value={formatCurrency(totalYouOwe)}
          subtext="Total amount you owe across groups"
          icon={TrendingDown}
        />
      </div>

      {/* Individual Group Breakdowns */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-black text-black uppercase">
            Ledger By Workspace
          </h2>
          <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 bg-black text-[#ccff00] rounded-[3px]">
            {groups.length} ACTIVE GROUPS
          </span>
        </div>

        {groups.map((group, idx) => {
          const balances = groupBalances[group._id] || [];
          const colors = ['bg-[#ccff00]', 'bg-[#ff529a]', 'bg-[#00f0ff]', 'bg-[#ff8800]'];
          const headerColor = colors[idx % colors.length];

          return (
            <div
              key={group._id}
              className="bg-white border-3 border-black rounded-[4px] shadow-[6px_6px_0px_#000] overflow-hidden"
            >
              {/* Group Header Strip */}
              <div className={`p-4 sm:p-5 ${headerColor} border-b-3 border-black flex flex-wrap items-center justify-between gap-3`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[3px] bg-black text-white flex items-center justify-center font-display font-black text-sm">
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg sm:text-xl text-black uppercase">
                      {group.name}
                    </h3>
                    <p className="font-mono text-xs text-neutral-800">
                      {group.description || `${group.members?.length || 0} participants`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/settlements?groupId=${group._id}`}>
                    <Button size="sm" variant="white" icon={Handshake}>
                      Settle Group
                    </Button>
                  </Link>
                  <Link to={`/groups/${group._id}`}>
                    <Button size="sm" variant="black" icon={ArrowRight}>
                      View Ledger
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Members Balances List */}
              <div className="p-5 sm:p-6 bg-[#fffdf8]">
                {balances.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {balances.map((b) => {
                      const memberName = b.user?.name || b.name || 'Member';
                      const isCurrentUser =
                        user &&
                        (b.user?._id?.toString() === user._id?.toString() ||
                          b.userId?.toString() === user._id?.toString());
                      const isPositive = b.balance > 0;
                      const isNegative = b.balance < 0;

                      return (
                        <div
                          key={b.user?._id || b.userId || memberName}
                          className={`p-4 border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3 ${
                            isCurrentUser ? 'bg-[#faf7ee]' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MemberAvatar name={memberName} size="md" />
                            <div className="min-w-0">
                              <p className="font-display font-bold text-sm text-black truncate uppercase">
                                {memberName} {isCurrentUser && '(YOU)'}
                              </p>
                              <span
                                className={`inline-block font-mono text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-[2px] border border-black ${
                                  isPositive
                                    ? 'bg-[#00c853] text-black'
                                    : isNegative
                                    ? 'bg-[#ff3b30] text-white'
                                    : 'bg-neutral-200 text-black'
                                }`}
                              >
                                {isPositive
                                  ? 'CREDITOR'
                                  : isNegative
                                  ? 'DEBTOR'
                                  : 'SETTLED'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0 font-mono">
                            <span
                              className={`text-base font-bold ${
                                isPositive
                                  ? 'text-[#00c853]'
                                  : isNegative
                                  ? 'text-[#ff3b30]'
                                  : 'text-black'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {formatCurrency(b.balance)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center font-mono text-xs uppercase text-neutral-500">
                    No active balances recorded for this workspace.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
