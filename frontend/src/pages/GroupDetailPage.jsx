import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Plus,
  Receipt,
  Scale,
  Handshake,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService, expenseService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { MemberAvatar } from '../components/StatCard';
import { Button, SecondaryButton } from '../components/Button';

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [groupRes, expensesRes, balancesRes] = await Promise.all([
        groupService.getById(id),
        expenseService.getAll({ groupId: id }),
        groupService.getBalances(id),
      ]);
      const g = groupRes.data?.data?.group || groupRes.data?.group || groupRes.data;
      setGroup(g);
      const expList = expensesRes.data?.data?.expenses || expensesRes.data?.expenses || [];
      setExpenses(Array.isArray(expList) ? expList : []);
      const balList = balancesRes.data?.data?.balances || balancesRes.data?.balances || [];
      setBalances(Array.isArray(balList) ? balList : []);
      setEditName(g?.name || '');
      setEditDescription(g?.description || '');
    } catch {
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isCreator =
    user && group && (group.createdBy === user._id || group.createdBy?._id === user._id);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Group name is required');
      return;
    }
    setSaving(true);
    try {
      await groupService.update(id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      toast.success('Group updated');
      setEditing(false);
      fetchData();
    } catch {
      toast.error('Failed to update group');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Delete this group? All related expenses and settlements will be permanently deleted.')) {
      return;
    }
    setDeleting(true);
    try {
      await groupService.delete(id);
      toast.success('Group deleted');
      navigate('/groups');
    } catch {
      toast.error('Failed to delete group');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-20 text-[#6d6c6b]">
        <p className="font-normal">Group not found.</p>
        <Link to="/groups" className="text-xs text-[#0c0a08] underline mt-2 block font-normal">
          Back to Groups
        </Link>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-8">
      {/* Back and Header */}
      <div>
        <Link
          to="/groups"
          className="text-xs text-[#6d6c6b] hover:text-[#0c0a08] flex items-center gap-1.5 mb-2 transition font-normal"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Groups</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e5e7eb]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
              Group Workspace
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#0c0a08] tracking-tight leading-tight mt-1">
              {group.name}
            </h1>
            {group.description && (
              <p className="text-sm text-[#6d6c6b] mt-1 max-w-xl font-normal">
                {group.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/expenses/new">
              <Button variant="primary" icon={Plus}>
                Add Expense
              </Button>
            </Link>
            <Link to={`/settlements?groupId=${group._id}`}>
              <Button variant="secondary" icon={Handshake}>
                Smart Settlement
              </Button>
            </Link>
            {isCreator && (
              <>
                <SecondaryButton
                  size="md"
                  onClick={() => setEditing(!editing)}
                  icon={Edit2}
                >
                  Edit
                </SecondaryButton>
                <button
                  onClick={handleDeleteGroup}
                  disabled={deleting}
                  title="Delete group"
                  className="p-2 text-[#6d6c6b] hover:text-[#b91c1c] hover:bg-[#fef2f2] rounded-[6px] transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <form
          onSubmit={handleSaveEdit}
          className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 space-y-4"
        >
          <h3 className="text-sm font-normal text-[#0c0a08]">Edit Group Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Group name"
              required
              className="bg-white text-sm text-[#0c0a08] rounded-[10px] border border-[#e5e7eb] px-3.5 py-2.5 focus:outline-none focus:border-[#0c0a08] font-normal"
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="bg-white text-sm text-[#0c0a08] rounded-[10px] border border-[#e5e7eb] px-3.5 py-2.5 focus:outline-none focus:border-[#0c0a08] font-normal"
            />
          </div>
          <div className="flex justify-end gap-2">
            <SecondaryButton size="sm" onClick={() => setEditing(false)}>
              Cancel
            </SecondaryButton>
            <Button size="sm" type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* Tab Navigation (6px Radius Ramp Tags/Buttons) */}
      <div className="flex items-center gap-1.5 border-b border-[#e5e7eb] pb-3 text-xs font-normal">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'expenses', label: `Expenses (${expenses.length})` },
          { key: 'members', label: `Members (${group.members?.length || 0})` },
          { key: 'balances', label: 'Balances' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-[6px] transition-colors ${
              activeTab === tab.key
                ? 'bg-[#e4f222] text-[#0c0a08]'
                : 'text-[#6d6c6b] hover:text-[#0c0a08] hover:bg-[#f4f2f0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#1a1919] text-white rounded-[16px] border border-white/10 p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                Total Group Spending
              </span>
              <p className="text-3xl font-normal text-white mt-1 leading-none">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-[#6d6c6b] mt-2 font-normal">{expenses.length} shared receipts logged</p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                Roster Size
              </span>
              <p className="text-3xl font-normal text-[#0c0a08] mt-1 leading-none">
                {group.members?.length || 0} Members
              </p>
              <p className="text-xs text-[#6d6c6b] mt-2 font-normal">Shared evenly or by custom allocation</p>
            </div>

            <div className="bg-[#f4f2f0] rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
                Settlement Engine
              </span>
              <p className="text-3xl font-normal text-[#0c0a08] mt-1 leading-none">
                Greedy Plan
              </p>
              <Link
                to={`/settlements?groupId=${group._id}`}
                className="text-xs text-[#0c0a08] underline mt-2 block font-normal hover:opacity-80"
              >
                Inspect Optimized Repayments →
              </Link>
            </div>
          </div>

          {/* Member Balance Overview */}
          <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
            <h3 className="text-xl font-normal text-[#0c0a08] tracking-tight mb-4">
              Member Net Positions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {balances.map((b, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-[10px] bg-[#f4f2f0] border border-[#e5e7eb] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <MemberAvatar name={b.user?.name || 'Member'} size="sm" />
                    <div>
                      <p className="text-sm font-normal text-[#0c0a08]">
                        {b.user?.name || 'Member'}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                        {b.balance > 0 ? 'Receives' : b.balance < 0 ? 'Owes' : 'Settled'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-normal ${
                      b.balance > 0
                        ? 'text-[#0c0a08]'
                        : b.balance < 0
                        ? 'text-[#b91c1c]'
                        : 'text-[#6d6c6b]'
                    }`}
                  >
                    {b.balance > 0 ? '+' : ''}
                    {formatCurrency(b.balance)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
          {expenses.length > 0 ? (
            <div className="divide-y divide-[#e5e7eb]">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MemberAvatar name={expense.paidBy?.name || 'User'} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-normal text-[#0c0a08] truncate">
                        {expense.title}
                      </p>
                      <p className="text-xs text-[#6d6c6b] mt-0.5 font-normal">
                        Paid by {expense.paidBy?.name} · {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-base font-normal text-[#0c0a08]">
                      {formatCurrency(expense.amount)}
                    </p>
                    <span className="text-[10px] text-[#6d6c6b] uppercase tracking-[0.018em]">
                      {expense.splitType || 'Equal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6d6c6b] py-10 text-center font-normal">
              No expenses in this group yet.
            </p>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(group.members || []).map((m) => (
              <div
                key={m._id}
                className="p-3.5 rounded-[10px] bg-[#f4f2f0] border border-[#e5e7eb] flex items-center gap-2.5"
              >
                <MemberAvatar name={m.name} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-normal text-[#0c0a08] truncate">{m.name}</p>
                  <p className="text-xs text-[#6d6c6b] truncate">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'balances' && (
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
          <div className="space-y-3">
            {balances.map((b, i) => (
              <div
                key={i}
                className="p-3.5 rounded-[10px] bg-[#f4f2f0] border border-[#e5e7eb] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <MemberAvatar name={b.user?.name || 'Member'} size="md" />
                  <div>
                    <p className="text-sm font-normal text-[#0c0a08]">
                      {b.user?.name || 'Member'}
                    </p>
                    <p className="text-xs text-[#6d6c6b]">{b.user?.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-normal ${
                      b.balance > 0
                        ? 'text-[#0c0a08]'
                        : b.balance < 0
                        ? 'text-[#b91c1c]'
                        : 'text-[#6d6c6b]'
                    }`}
                  >
                    {b.balance > 0 ? '+' : ''}
                    {formatCurrency(b.balance)}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                    {b.balance > 0
                      ? 'Should receive'
                      : b.balance < 0
                      ? 'Needs to pay'
                      : 'Zero balance'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
