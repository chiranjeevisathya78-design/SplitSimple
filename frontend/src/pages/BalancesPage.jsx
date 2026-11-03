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
import { MemberAvatar } from '../components/StatCard';
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
        <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
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
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#f2f2f3]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Multi-Group Ledger
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c]">
            Balances
          </h1>
          <p className="text-sm text-[#777b86] mt-1 max-w-xl">
            Real-time balance breakdown across every active group and individual member.
          </p>
        </div>

        <Link to="/settlements">
          <Button variant="peach" icon={Handshake}>
            Launch Smart Settlement
          </Button>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Total Amount You Are Owed
          </span>
          <p className="font-editorial text-3xl font-semibold text-[#17191c] mt-2">
            {formatCurrency(totalYouAreOwed)}
          </p>
          <p className="text-xs text-[#777b86] mt-1">Pending receivables from group mates</p>
        </div>

        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Total Amount You Owe
          </span>
          <p className="font-editorial text-3xl font-semibold text-[#5d2a1a] mt-2">
            {formatCurrency(totalYouOwe)}
          </p>
          <p className="text-xs text-[#777b86] mt-1">Your pending repayment share</p>
        </div>

        <div className="bg-[#fafafb] rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Net Combined Balance
          </span>
          <p
            className={`font-editorial text-3xl font-semibold mt-2 ${
              netOverall >= 0 ? 'text-[#17191c]' : 'text-[#5d2a1a]'
            }`}
          >
            {netOverall >= 0 ? '+' : ''}
            {formatCurrency(Math.abs(netOverall))}
          </p>
          <p className="text-xs text-[#777b86] mt-1">
            {netOverall >= 0 ? 'Net positive position' : 'Net negative position'}
          </p>
        </div>
      </div>

      {/* Group-by-Group Balances */}
      <div className="space-y-6">
        {groups.map((group) => {
          const balances = groupBalances[group._id] || [];
          return (
            <div
              key={group._id}
              className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-[#f2f2f3] gap-4">
                <div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
                    {group.name}
                  </h3>
                  <p className="text-xs text-[#777b86] mt-0.5">
                    {group.description || `${group.members?.length || 0} participants`}
                  </p>
                </div>
                <Link
                  to={`/settlements?groupId=${group._id}`}
                  className="text-xs font-semibold text-[#17191c] hover:underline flex items-center gap-1.5"
                >
                  <span>Settle Group Debts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {balances.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {balances.map((b, idx) => {
                    const name = b.user?.name || 'Member';
                    const bal = b.balance;
                    const isCreditor = bal > 0;
                    const isDebtor = bal < 0;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <MemberAvatar name={name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-[#17191c]">{name}</p>
                            <p className="text-[11px] text-[#777b86]">
                              {isCreditor ? 'Receives' : isDebtor ? 'Owes' : 'Settled'}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`font-editorial text-base font-semibold ${
                            isCreditor
                              ? 'text-[#17191c]'
                              : isDebtor
                              ? 'text-[#5d2a1a]'
                              : 'text-[#777b86]'
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
                <p className="text-xs text-[#777b86] py-4">
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
