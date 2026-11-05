import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  Handshake,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
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
      const createRes = await settlementService.create({
        groupId: selectedGroup,
        from: fromId,
        to: toId,
        amount: amountRupees,
      });

      const settlementId = createRes.data?.data?.settlement?._id || createRes.data?.settlement?._id;

      if (settlementId) {
        await settlementService.markPaid(settlementId);
      }

      toast.success(`Settlement of ₹${amountRupees.toFixed(2)} recorded as paid!`);
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
        <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
      </div>
    );
  }

  const transactions = optimized?.transactions || [];
  const currentBalances = optimized?.currentBalances || [];
  const totalOutstanding = optimized?.totalOutstanding || 0;

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e5e7eb]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.018em] text-[#0c0a08] px-2 py-0.5 rounded-[6px] bg-[#e4f222] inline-block mb-1 font-normal">
            Greedy Simplification Engine
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] text-[#0c0a08] font-normal tracking-tight leading-tight">
            Smart Settlement
          </h1>
          <p className="text-sm text-[#6d6c6b] mt-1 max-w-xl font-normal">
            Calculates minimal payments to completely clear all group debts with zero balance drift.
          </p>
        </div>

        {/* Group Selector Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1 font-normal">
            Active Workspace
          </label>
          <select
            value={selectedGroup}
            onChange={handleGroupSelect}
            className="w-full bg-white text-[#0c0a08] text-sm rounded-[10px] border border-[#e5e7eb] py-2.5 px-3.5 focus:outline-none focus:border-[#0c0a08] font-normal"
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
        </div>
      ) : (
        <>
          {/* Optimization Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#1a1919] text-white rounded-[16px] border border-white/10 p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                Total Outstanding Debt
              </span>
              <p className="text-3xl sm:text-4xl font-normal text-white mt-1 leading-none">
                {formatCurrency(totalOutstanding)}
              </p>
              <p className="text-xs text-[#6d6c6b] mt-2 font-normal">Across all debtor members in this group</p>
            </div>

            <div className="bg-white text-[#0c0a08] rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                Optimized Transactions
              </span>
              <p className="text-3xl sm:text-4xl font-normal text-[#0c0a08] mt-1 leading-none">
                {transactions.length} Payment{transactions.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-[#6d6c6b] mt-2 font-normal">
                {transactions.length === 0
                  ? 'All accounts are balanced'
                  : 'Minimal transfers calculated by greedy algorithm'}
              </p>
            </div>

            <div className="bg-[#f4f2f0] rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                Balance Conservation
              </span>
              <p className="text-3xl sm:text-4xl font-normal text-[#0c0a08] mt-1 leading-none">
                Exact Paise
              </p>
              <p className="text-xs text-[#6d6c6b] mt-2 font-normal">Zero floating-point arithmetic drift</p>
            </div>
          </div>

          {/* Recommended Repayment Plan */}
          <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e7eb]">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal text-[#0c0a08] tracking-tight">
                  Recommended Repayment Plan
                </h2>
                <p className="text-xs text-[#6d6c6b] mt-0.5 font-normal">
                  Follow these transfers to settle all obligations with the fewest payments possible
                </p>
              </div>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((tx, idx) => {
                  const fromName = tx.from?.name || 'Member';
                  const toName = tx.to?.name || 'Member';
                  const isProcessing =
                    processingId === `${tx.from?._id || tx.from}-${tx.to?._id || tx.to}`;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-[10px] bg-[#f4f2f0] border border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#0c0a08]"
                    >
                      <div className="flex items-center gap-3">
                        <MemberAvatar name={fromName} size="md" />
                        <div>
                          <div className="flex items-center gap-2 text-sm font-normal text-[#0c0a08]">
                            <span>{fromName}</span>
                            <span className="text-xs text-[#6d6c6b]">pays</span>
                            <span className="text-[#0c0a08] underline underline-offset-4">{toName}</span>
                          </div>
                          <p className="text-xs text-[#6d6c6b] mt-0.5 font-normal">
                            Direct settlement transfer
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        <div className="text-right">
                          <p className="text-xl sm:text-2xl font-normal text-[#0c0a08]">
                            {formatCurrency(tx.amount)}
                          </p>
                          <span className="text-[10px] text-[#6d6c6b] uppercase tracking-[0.018em]">
                            Full Settlement
                          </span>
                        </div>

                        <Button
                          variant="primary"
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
              <div className="py-10 text-center">
                <div className="w-10 h-10 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-normal text-[#0c0a08] tracking-tight">
                  All Debts Settled
                </h3>
                <p className="text-xs text-[#6d6c6b] mt-1 max-w-sm mx-auto font-normal">
                  Every member in this group is currently balanced at ₹0.00. No repayments required!
                </p>
              </div>
            )}
          </div>

          {/* Member Current Net Balances */}
          <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-normal text-[#0c0a08] tracking-tight mb-1">
              Member Ledger Balances
            </h3>
            <p className="text-xs text-[#6d6c6b] mb-4 font-normal">
              Individual net status in this group (positive = receives money, negative = owes money)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentBalances.map((item, i) => {
                const name = item.user?.name || 'Member';
                const bal = item.balance;
                const isCreditor = bal > 0;
                const isDebtor = bal < 0;

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-[10px] bg-[#f4f2f0] border border-[#e5e7eb] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <MemberAvatar name={name} size="sm" />
                      <div>
                        <p className="text-sm font-normal text-[#0c0a08]">{name}</p>
                        <p className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                          {isCreditor ? 'Owed' : isDebtor ? 'Owes' : 'Balanced'}
                        </p>
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
          </div>

          {/* Settlement History Log */}
          {history.length > 0 && (
            <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-normal text-[#0c0a08] tracking-tight mb-1">
                Completed Settlements
              </h3>
              <p className="text-xs text-[#6d6c6b] mb-4 font-normal">
                Verified payment receipts recorded in this group ledger
              </p>

              <div className="divide-y divide-[#e5e7eb]">
                {history.map((h) => (
                  <div
                    key={h._id}
                    className="py-3 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[6px] bg-[#f4f2f0] border border-[#e5e7eb] flex items-center justify-center text-[#0c0a08]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-[#0c0a08]">
                          {h.from?.name || 'Member'} paid {h.to?.name || 'Member'}
                        </p>
                        <p className="text-xs text-[#6d6c6b]">
                          {formatDate(h.settledAt || h.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-normal text-[#0c0a08]">
                        {formatCurrency(h.amount)}
                      </p>
                      <span className="text-[10px] text-[#0c0a08] uppercase tracking-[0.018em]">
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
