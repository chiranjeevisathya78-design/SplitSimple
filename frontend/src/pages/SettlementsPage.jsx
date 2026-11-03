import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clock,
  Loader2,
  Wallet,
  Users,
  Banknote,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService, settlementService } from '../services';
import { formatCurrency, formatDate, getInitials } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function SettlementsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGroupId = searchParams.get('groupId') || '';

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(initialGroupId);
  const [optimized, setOptimized] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [settlingId, setSettlingId] = useState(null);

  useEffect(() => {
    groupService
      .getAll()
      .then((res) => {
        const raw = res.data?.data?.groups || res.data?.groups || res.data?.data || [];
        const g = Array.isArray(raw) ? raw : [];
        setGroups(g);
        if (!selectedGroup && g.length > 0) {
          // Don't auto-select, let user choose
        }
      })
      .catch(() => toast.error('Failed to load groups'))
      .finally(() => setLoadingGroups(false));
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchSettlements();
    } else {
      setOptimized(null);
      setHistory([]);
    }
  }, [selectedGroup]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const [optRes, histRes] = await Promise.all([
        settlementService.getOptimized(selectedGroup),
        settlementService.getByGroup(selectedGroup),
      ]);
      setOptimized(optRes.data?.data || optRes.data);
      const hist = histRes.data?.data?.settlements || histRes.data?.settlements || [];
      setHistory(Array.isArray(hist) ? hist : []);
    } catch (err) {
      toast.error('Failed to load settlements');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    const params = new URLSearchParams(searchParams);
    if (groupId) params.set('groupId', groupId);
    else params.delete('groupId');
    setSearchParams(params);
  };

  const handleSettle = async (from, to, amount) => {
    const key = `${from}-${to}`;
    setSettlingId(key);
    try {
      // Convert paise to rupees for the API
      const amountInRupees = amount / 100;
      await settlementService.create({
        groupId: selectedGroup,
        from,
        to,
        amount: amountInRupees,
      });
      toast.success('Settlement created!');
      fetchSettlements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create settlement');
    } finally {
      setSettlingId(null);
    }
  };

  const handleMarkPaid = async (settlementId) => {
    setSettlingId(settlementId);
    try {
      await settlementService.markPaid(settlementId);
      toast.success('Settlement marked as paid!');
      fetchSettlements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark as paid');
    } finally {
      setSettlingId(null);
    }
  };

  const transactions = optimized?.transactions || optimized?.settlements || [];
  const currentBalances = optimized?.currentBalances || optimized?.balances || [];
  const totalOutstanding = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>
          <p className="text-gray-500 mt-1">Settle up with optimized payments</p>
        </div>
        {selectedGroup && (
          <button
            onClick={fetchSettlements}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Group Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Group
        </label>
        {loadingGroups ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading groups...
          </div>
        ) : (
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedGroup}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a group...</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!selectedGroup && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Select a group to view settlements
          </h3>
          <p className="text-gray-500">
            Choose a group from the dropdown above to see balances and settle up
          </p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      )}

      {selectedGroup && !loading && (
        <>
          {/* Current Balances */}
          {currentBalances.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Current Balances
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentBalances.map((bal, idx) => {
                  const name = bal.user?.name || bal.name || 'Unknown';
                  const amount = bal.balance || bal.amount || 0;
                  const isPositive = amount > 0;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isPositive
                          ? 'border-green-200 bg-green-50'
                          : amount < 0
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isPositive
                            ? 'bg-green-500'
                            : amount < 0
                            ? 'bg-red-500'
                            : 'bg-gray-400'
                        }`}
                      >
                        {getInitials(name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{name}</p>
                        <p
                          className={`text-sm font-semibold ${
                            isPositive
                              ? 'text-green-600'
                              : amount < 0
                              ? 'text-red-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {amount === 0
                            ? 'Settled'
                            : isPositive
                            ? `+${formatCurrency(amount)}`
                            : `-${formatCurrency(Math.abs(amount))}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optimized Repayment Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Optimized Repayment Plan
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{transactions.length} transaction(s)</span>
                {totalOutstanding > 0 && (
                  <span className="font-medium text-gray-700">
                    Total: {formatCurrency(totalOutstanding)}
                  </span>
                )}
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  All settled up!
                </h3>
                <p className="text-gray-500">
                  No outstanding balances in this group
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((t, idx) => {
                  const fromName = t.from?.name || t.fromUser?.name || 'Someone';
                  const toName = t.to?.name || t.toUser?.name || 'Someone';
                  const fromId = t.from?._id || t.from || t.fromUser?._id;
                  const toId = t.to?._id || t.to || t.toUser?._id;
                  const settleKey = `${fromId}-${toId}`;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(fromName)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {fromName}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(toName)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {toName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(t.amount)}
                        </span>
                        <button
                          onClick={() => handleSettle(fromId, toId, t.amount)}
                          disabled={settlingId === settleKey}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {settlingId === settleKey ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Banknote className="w-3.5 h-3.5" />
                          )}
                          Settle
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settlement History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Settlement History
            </h2>

            {history.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-6">
                No settlement history yet
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((s) => {
                  const fromName =
                    s.from?.name || s.payer?.name || s.fromUser?.name || 'Someone';
                  const toName =
                    s.to?.name || s.payee?.name || s.toUser?.name || 'Someone';
                  const status = s.status || 'pending';
                  const isPaid = status === 'paid' || status === 'completed';

                  return (
                    <div
                      key={s._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800">
                            {fromName}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-800">
                            {toName}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            isPaid
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {isPaid ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(s.amount)}
                          </span>
                          {s.createdAt && (
                            <p className="text-xs text-gray-400">
                              {formatDate(s.createdAt)}
                            </p>
                          )}
                        </div>
                        {!isPaid && (
                          <button
                            onClick={() => handleMarkPaid(s._id)}
                            disabled={settlingId === s._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {settlingId === s._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
