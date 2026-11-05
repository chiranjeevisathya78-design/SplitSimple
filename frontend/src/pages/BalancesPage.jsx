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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e5e7eb]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
            Multi-Group Ledger
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] text-[#0c0a08] font-normal tracking-tight leading-tight">
            Balances
          </h1>
          <p className="text-sm text-[#6d6c6b] mt-1 max-w-xl font-normal">
            Real-time balance breakdown across every active group and individual member.
          </p>
        </div>

        <Link to="/settlements">
          <Button variant="primary" icon={Handshake}>
            Launch Smart Settlement
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Featured Net Card in Inverted Obsidian */}
        <StatCard
          variant="dark"
          label="Your Combined Net Balance"
          value={`${netOverall >= 0 ? '+' : ''}${formatCurrency(Math.abs(netOverall))}`}
          subtext={
            netOverall > 0
              ? 'You are net positive across all groups'
              : netOverall < 0
              ? 'You have pending repayment obligations'
              : 'All groups completely balanced at ₹0.00'
          }
          badge={
            netOverall > 0
              ? 'Net Receivable'
              : netOverall < 0
              ? 'Net Payable'
              : 'Settled'
          }
        />

        {/* Paper White: Total You Are Owed */}
        <StatCard
          variant="white"
          label="Total You Are Owed"
          value={formatCurrency(totalYouAreOwed)}
          subtext="Pending receivables from group mates"
          icon={TrendingUp}
        />

        {/* Paper White: Total You Owe */}
        <StatCard
          variant="wash"
          label="Total You Owe"
          value={formatCurrency(totalYouOwe)}
          subtext="Your pending repayment share across groups"
          icon={TrendingDown}
        />
      </div>

      {/* Group-by-Group Balances */}
      <div className="space-y-6">
        {groups.map((group) => {
          const balances = groupBalances[group._id] || [];
          return (
            <div
              key={group._id}
              className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 transition-colors hover:border-[#0c0a08]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#e5e7eb] gap-3">
                <div>
                  <h3 className="text-xl font-normal text-[#0c0a08] tracking-tight">
                    {group.name}
                  </h3>
                  <p className="text-xs text-[#6d6c6b] mt-0.5 font-normal">
                    {group.description || `${group.members?.length || 0} participants`}
                  </p>
                </div>
                <Link
                  to={`/settlements?groupId=${group._id}`}
                  className="text-xs text-[#0c0a08] hover:underline flex items-center gap-1.5 font-normal"
                >
                  <span>Settle Group Debts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {balances.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {balances.map((b, idx) => {
                    const name = b.user?.name || 'Member';
                    const bal = b.balance;
                    const isCreditor = bal > 0;
                    const isDebtor = bal < 0;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-[10px] border flex items-center justify-between transition-colors ${
                          isDebtor
                            ? 'bg-[#f4f2f0] border-[#e5e7eb]'
                            : isCreditor
                            ? 'bg-white border-[#e5e7eb]'
                            : 'bg-white border-[#e5e7eb]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MemberAvatar name={name} size="sm" />
                          <div>
                            <p className="text-sm font-normal text-[#0c0a08]">{name}</p>
                            <span
                              className={`inline-block text-[10px] uppercase tracking-[0.018em] font-normal ${
                                isCreditor
                                  ? 'text-[#0c0a08]'
                                  : isDebtor
                                  ? 'text-[#b91c1c]'
                                  : 'text-[#6d6c6b]'
                              }`}
                            >
                              {isCreditor ? 'Receives' : isDebtor ? 'Owes' : 'Settled'}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`text-sm font-normal ${
                            isCreditor
                              ? 'text-[#0c0a08]'
                              : isDebtor
                              ? 'text-[#b91c1c]'
                              : 'text-[#6d6c6b]'
                          }`}
                        >
                          {bal > 0 ? '+' : ''}
                          {formatCurrency(bal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#6d6c6b] py-3 font-normal">
                  No active expenses recorded in this group yet.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
