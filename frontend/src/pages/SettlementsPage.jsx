import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  Handshake,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { settlementService, groupService } from '../services';
import { formatCurrency, formatDate } from '../utils/helpers';
import { MemberAvatar } from '../components/StatCard';
import { Button, SecondaryButton } from '../components/Button';

export default function SettlementsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGroupId = searchParams.get('groupId') || '';

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(initialGroupId);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [loading, setLoading] = useState(false);
  const [optimized, setOptimized] = useState(null);
  const [history, setHistory] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  // Load user groups
  useEffect(() => {
    groupService
      .getAll()
      .then((res) => {
        const raw = res.data?.data?.groups || res.data?.groups || res.data?.data || [];
        const gList = Array.isArray(raw) ? raw : [];
        setGroups(gList);
        if (!selectedGroup && gList.length > 0) {
          setSelectedGroup(gList[0]._id);
        }
      })
      .catch(() => toast.error('Failed to load groups'))
      .finally(() => setLoadingGroups(false));
  }, []);

  // Fetch settlements when selected group changes
  useEffect(() => {
    if (selectedGroup) {
      fetchSettlementData(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchSettlementData = async (groupId) => {
    setLoading(true);
    try {
      const [optRes, histRes] = await Promise.all([
        settlementService.getOptimized(groupId),
        settlementService.getByGroup(groupId),
      ]);
      setOptimized(optRes.data?.data || optRes.data);
      const hist = histRes.data?.data?.settlements || histRes.data?.settlements || [];
      setHistory(Array.isArray(hist) ? hist : []);
    } catch {
      toast.error('Failed to calculate optimized settlements');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSelect = (e) => {
    const gid = e.target.value;
    setSelectedGroup(gid);
    setSearchParams({ groupId: gid });
  };

  // Mark a settlement transaction as paid
  const handleSettleTransaction = async (tx) => {
    const fromId = tx.from._id || tx.from;
    const toId = tx.to._id || tx.to;
    const amountRupees = tx.amount / 100;

    setProcessingId(`${fromId}-${toId}`);
    try {
      // 1. Create settlement record
      const createRes = await settlementService.create({
        groupId: selectedGroup,
        from: fromId,
        to: toId,
        amount: amountRupees,
      });

      const settlementId = createRes.data?.data?.settlement?._id || createRes.data?.settlement?._id;

      // 2. Mark it as paid
      if (settlementId) {
        await settlementService.markPaid(settlementId);
      }

      toast.success(`Settlement of ₹${amountRupees.toFixed(2)} recorded as paid!`);
      // Refresh current settlements and balances
      await fetchSettlementData(selectedGroup);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete settlement');
    } finally {
      setProcessingId(null);
    }
  };

  if (loadingGroups) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
      </div>
    );
  }

  const transactions = optimized?.transactions || [];
  const currentBalances = optimized?.currentBalances || [];
  const totalOutstanding = optimized?.totalOutstanding || 0;

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#f2f2f3]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5d2a1a] px-3 py-1 rounded-full bg-[#fbe1d1] inline-block mb-2">
            Greedy Simplification Engine
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c]">
            Smart Settlement
          </h1>
          <p className="text-sm text-[#777b86] mt-1 max-w-xl">
            Calculates minimal payments to completely clear all group debts with zero balance drift.
          </p>
        </div>

        {/* Group Selector Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#777b86] mb-1.5">
            Active Workspace
          </label>
          <select
            value={selectedGroup}
            onChange={handleGroupSelect}
            className="w-full bg-white text-[#17191c] text-sm rounded-[16px] border border-[#f2f2f3] py-2.5 px-3.5 focus:outline-none focus:border-[#17191c]"
          >
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
        </div>
      ) : (
        <>
          {/* Optimization Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
                Total Outstanding Debt
              </span>
              <p className="font-editorial text-3xl font-semibold text-[#17191c] mt-2">
                {formatCurrency(totalOutstanding)}
              </p>
              <p className="text-xs text-[#777b86] mt-1">Across all debtor members</p>
            </div>

            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
                Optimized Transactions
              </span>
              <p className="font-editorial text-3xl font-semibold text-[#17191c] mt-2">
                {transactions.length} Payment{transactions.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-[#777b86] mt-1">
                {transactions.length === 0
                  ? 'Group is already fully settled'
                  : 'Minimal transfers calculated by greedy algorithm'}
              </p>
            </div>

            <div className="bg-[#fbe1d1]/30 rounded-[24px] border border-[#f6d0bb] p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5d2a1a]">
                Balance Conservation
              </span>
              <p className="font-editorial text-3xl font-semibold text-[#5d2a1a] mt-2">
                Exact Paise
              </p>
              <p className="text-xs text-[#5d2a1a] mt-1">Sum of credits equals sum of debits</p>
            </div>
          </div>

          {/* Optimized Transactions Plan */}
          <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#f2f2f3]">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  Recommended Repayment Plan
                </h2>
                <p className="text-xs text-[#777b86] mt-0.5">
                  Follow these transfers to settle all obligations with the fewest payments possible
                </p>
              </div>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx, idx) => {
                  const fromName = tx.from?.name || 'Member';
                  const toName = tx.to?.name || 'Member';
                  const isProcessing =
                    processingId === `${tx.from?._id || tx.from}-${tx.to?._id || tx.to}`;

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-[20px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#17191c]"
                    >
                      <div className="flex items-center gap-4">
                        <MemberAvatar name={fromName} size="md" />
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#17191c]">
                            <span>{fromName}</span>
                            <span className="text-xs text-[#777b86]">pays</span>
                            <span className="text-[#17191c] font-bold">{toName}</span>
                          </div>
                          <p className="text-xs text-[#777b86] mt-0.5">
                            Direct settlement transfer
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <p className="font-editorial text-2xl font-semibold text-[#17191c]">
                            {formatCurrency(tx.amount)}
                          </p>
                          <span className="text-[11px] text-[#777b86] uppercase font-semibold">
                            Full Settlement
                          </span>
                        </div>

                        <Button
                          variant="peach"
                          size="sm"
                          loading={isProcessing}
                          onClick={() => handleSettleTransaction(tx)}
                          icon={CheckCircle2}
                        >
                          Mark as Paid
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  All Debts Settled
                </h3>
                <p className="text-sm text-[#777b86] mt-1 max-w-sm mx-auto">
                  Every member in this group is currently balanced at ₹0.00. No repayments required!
                </p>
              </div>
            )}
          </div>

          {/* Member Current Net Balances */}
          <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
            <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mb-1">
              Member Ledger Balances
            </h3>
            <p className="text-xs text-[#777b86] mb-6">
              Individual net status in this group (positive = receives money, negative = owes money)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentBalances.map((item, i) => {
                const name = item.user?.name || 'Member';
                const bal = item.balance;
                const isCreditor = bal > 0;
                const isDebtor = bal < 0;

                return (
                  <div
                    key={i}
                    className="p-4 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <MemberAvatar name={name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-[#17191c]">{name}</p>
                        <p className="text-[11px] text-[#777b86]">
                          {isCreditor ? 'Owed to them' : isDebtor ? 'Owes to group' : 'Settled'}
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
          </div>

          {/* Settlement History Log */}
          {history.length > 0 && (
            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
              <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mb-1">
                Completed Settlements
              </h3>
              <p className="text-xs text-[#777b86] mb-6">
                Verified payment receipts recorded in this group ledger
              </p>

              <div className="divide-y divide-[#f2f2f3]">
                {history.map((h) => (
                  <div
                    key={h._id}
                    className="py-3.5 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#fafafb] border border-[#f2f2f3] flex items-center justify-center text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#17191c]">
                          {h.from?.name || 'Member'} paid {h.to?.name || 'Member'}
                        </p>
                        <p className="text-xs text-[#777b86]">
                          {formatDate(h.settledAt || h.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-editorial font-semibold text-base text-[#17191c]">
                        {formatCurrency(h.amount)}
                      </p>
                      <span className="text-[11px] text-green-700 font-medium">
                        Paid & Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
