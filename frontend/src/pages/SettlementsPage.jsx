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
  Zap,
  Sparkles,
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

      const newSettlement =
        createRes.data?.data?.settlement || createRes.data?.settlement || createRes.data;

      if (newSettlement && newSettlement._id) {
        await settlementService.markPaid(newSettlement._id);
      }

      toast.success('Repayment marked as SETTLED via UPI!', {
        icon: '✓',
        style: {
          border: '2px solid black',
          borderRadius: '4px',
          boxShadow: '4px 4px 0px #000',
          background: '#00f0ff',
          color: '#000',
          fontWeight: 'bold',
          fontFamily: 'Space Grotesk, sans-serif',
        },
      });
      fetchSettlementData(selectedGroup);
    } catch {
      toast.error('Failed to record settlement');
    } finally {
      setProcessingId(null);
    }
  };

  const currentGroupName =
    groups.find((g) => g._id === selectedGroup)?.name || 'Selected Group';

  const transactions = optimized?.transactions || [];

  return (
    <div className="space-y-8">
      {/* Header and Group Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-3 border-black">
        <div>
          <span className="px-2.5 py-0.5 bg-[#ccff00] text-black border-2 border-black rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-[2px_2px_0px_#000]">
            GREEDY SIMPLIFICATION ENGINE
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
            SMART SETTLEMENT
          </h1>
          <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
            Calculates minimal payments to completely clear all group debts with zero balance drift.
          </p>
        </div>

        {/* Group Selector Dropdown */}
        <div className="w-full md:w-72 font-mono">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-black mb-1.5">
            ACTIVE WORKSPACE
          </label>
          <select
            value={selectedGroup}
            onChange={handleGroupSelect}
            disabled={loadingGroups}
            className="w-full bg-white/85 backdrop-blur-md text-xs sm:text-sm font-bold uppercase text-black border-[2.5px] border-black rounded-[8px] p-2.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),3px_3px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#000] cursor-pointer"
          >
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 font-mono text-sm font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-black mr-2" />
          <span>RUNNING GREEDY FLOW SOLVER...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Optimized Repayments (7 cols) */}
          <div className="lg:col-span-7 glass-brutal-dark p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Top Specular Sheen */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[12px]" />
            
            {/* Neon Accent */}
            <div className="absolute -top-1 left-8 px-3 py-0.5 bg-gradient-to-r from-[#ccff00] to-[#a8ff00] text-black font-mono text-[9px] font-black uppercase tracking-wider rounded-b-[4px] border-x border-b border-black shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              MIN-FLOW ENGINE
            </div>

            <div className="relative z-10 pt-2">
              <div className="flex items-center justify-between pb-4 border-b-2 border-white/20 mb-6">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ccff00]">
                    OPTIMIZED REPAYMENTS
                  </span>
                  <h3 className="text-2xl font-display font-black text-white uppercase">
                    {currentGroupName}
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white font-mono text-xs font-bold uppercase border-2 border-black rounded-[6px] shadow-[2px_2px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.6)]">
                  GREEDY FLOW
                </span>
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
                        className="p-4 sm:p-5 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-[#ccff00] rounded-[10px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),4px_4px_0px_#ccff00] transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <MemberAvatar name={fromName} size="md" />
                            <div className="font-mono text-xs">
                              <span className="font-bold text-white text-sm">{fromName}</span>
                              <span className="mx-2 text-[#ccff00] font-bold">→ PAYS →</span>
                              <span className="font-bold text-white text-sm">{toName}</span>
                            </div>
                          </div>

                          <div className="text-right sm:text-right">
                            <span className="text-xl font-display font-black text-[#ccff00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                              {formatCurrency(tx.amount)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-300">
                            Send via GPay / PhonePe / Paytm / UPI
                          </span>
                          <button
                            onClick={() => handleSettleTransaction(tx)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-[#e0ff40] to-[#b8f000] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 text-black font-mono text-xs font-bold uppercase border-2 border-black rounded-[6px] shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)] cursor-pointer transition-all"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Recording...</span>
                              </>
                            ) : (
                              <>
                                <span>Mark Settled</span>
                                <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center font-mono">
                  <div className="w-12 h-12 bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] border-2 border-black rounded-[10px] shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mx-auto mb-3 font-bold text-xl">
                    ✓
                  </div>
                  <h4 className="font-display font-black text-2xl text-white uppercase">
                    All Settled Up!
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Every member in {currentGroupName} has a zero net balance. No pending repayments!
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Algorithm Guarantee */}
            <div className="relative z-10 pt-6 mt-8 border-t-2 border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
              <span className="text-neutral-400">Greedy Transfer Guarantee:</span>
              <span className="text-[#00f0ff] font-bold">
                COLLAPSED INTO AT MOST N − 1 PAYMENTS
              </span>
            </div>
          </div>

          {/* Right Column: Settlement History (5 cols) */}
          <div className="lg:col-span-5 glass-brutal-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-black mb-4">
                <div>
                  <h3 className="font-display font-black text-xl text-black uppercase">
                    Recorded History
                  </h3>
                  <p className="font-mono text-xs text-neutral-600">
                    Past payments confirmed in this workspace
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-[#00f0ff] border-2 border-black font-mono text-[10px] font-bold uppercase rounded-[2px] shadow-[2px_2px_0px_#000]">
                  {history.length} CLEARED
                </span>
              </div>

              {history.length > 0 ? (
                <div className="divide-y-2 divide-black">
                  {history.map((item) => {
                    const fromName = item.from?.name || 'Member';
                    const toName = item.to?.name || 'Member';

                    return (
                      <div key={item._id} className="py-3.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-mono text-xs font-bold text-black flex items-center gap-1">
                            <span>{fromName}</span>
                            <span className="text-[#00c853]">→ PAID →</span>
                            <span>{toName}</span>
                          </div>
                          <span className="font-mono text-[10px] text-neutral-500 mt-0.5 block">
                            {formatDate(item.createdAt)} · VIA UPI
                          </span>
                        </div>

                        <div className="text-right font-mono">
                          <span className="font-bold text-sm text-black">
                            {formatCurrency(item.amount)}
                          </span>
                          <span className="block text-[9px] font-bold text-[#00c853] uppercase">
                            [SETTLED ✓]
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center font-mono text-xs uppercase text-neutral-500">
                  No cleared settlements logged yet.
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t-2 border-black font-mono text-xs text-neutral-600 flex items-center justify-between">
              <span>Automatic Ledger Credit</span>
              <span className="font-bold text-black">PAISE RECONCILED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
