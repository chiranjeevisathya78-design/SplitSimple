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
  Calendar,
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'expenses' | 'members' | 'balances'

  // Edit / Delete states
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
        <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-20 text-[#777b86]">
        <p>Group not found.</p>
        <Link to="/groups" className="text-xs font-semibold text-[#17191c] underline mt-2 block">
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
          className="text-xs font-semibold text-[#777b86] hover:text-[#17191c] flex items-center gap-1.5 mb-3 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Groups</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#f2f2f3]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
              Group Workspace
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] mt-1">
              {group.name}
            </h1>
            {group.description && (
              <p className="text-sm text-[#777b86] mt-1 max-w-xl">
                {group.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/expenses/new">
              <Button variant="primary" icon={Plus}>
                Add Expense
              </Button>
            </Link>
            <Link to={`/settlements?groupId=${group._id}`}>
              <Button variant="peach" icon={Handshake}>
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
                  className="p-2.5 text-[#a3a6af] hover:text-red-600 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form (if toggled) */}
      {editing && (
        <form
          onSubmit={handleSaveEdit}
          className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-semibold text-[#17191c]">Edit Group Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Group name"
              required
              className="bg-[#fafafb] text-sm text-[#17191c] rounded-[16px] border border-[#f2f2f3] px-3.5 py-2.5 focus:outline-none focus:border-[#17191c]"
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="bg-[#fafafb] text-sm text-[#17191c] rounded-[16px] border border-[#f2f2f3] px-3.5 py-2.5 focus:outline-none focus:border-[#17191c]"
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

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#f2f2f3] pb-3 text-xs font-semibold">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'expenses', label: `Expenses (${expenses.length})` },
          { key: 'members', label: `Members (${group.members?.length || 0})` },
          { key: 'balances', label: 'Balances' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === tab.key
                ? 'bg-[#17191c] text-white'
                : 'text-[#777b86] hover:text-[#17191c] hover:bg-[#fafafb]'
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
                Total Group Spending
              </span>
              <p className="font-editorial text-3xl font-semibold text-[#17191c] mt-2">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-[#777b86] mt-1">{expenses.length} expenses recorded</p>
            </div>

            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
                Participants
              </span>
              <p className="font-editorial text-3xl font-semibold text-[#17191c] mt-2">
                {group.members?.length || 0} Members
              </p>
              <p className="text-xs text-[#777b86] mt-1">Shared evenly or by custom rules</p>
            </div>

            <div className="bg-[#fbe1d1]/30 rounded-[24px] border border-[#f6d0bb] p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5d2a1a]">
                Settlement Shortcut
              </span>
              <p className="font-editorial text-3xl font-semibold text-[#5d2a1a] mt-2">
                Greedy Plan
              </p>
              <Link
                to={`/settlements?groupId=${group._id}`}
                className="text-xs font-semibold text-[#5d2a1a] underline mt-1 block"
              >
                Inspect Optimized Repayments ➔
              </Link>
            </div>
          </div>

          {/* Member Balance Overview Table */}
          <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
            <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mb-4">
              Member Net Positions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {balances.map((b, i) => (
                <div
                  key={i}
                  className="p-4 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={b.user?.name || 'Member'} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-[#17191c]">
                        {b.user?.name || 'Member'}
                      </p>
                      <p className="text-[11px] text-[#777b86]">
                        {b.balance > 0 ? 'Receives' : b.balance < 0 ? 'Owes' : 'Settled'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-editorial font-semibold ${
                      b.balance > 0
                        ? 'text-[#17191c]'
                        : b.balance < 0
                        ? 'text-[#5d2a1a]'
                        : 'text-[#777b86]'
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
        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          {expenses.length > 0 ? (
            <div className="divide-y divide-[#f2f2f3]">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <MemberAvatar name={expense.paidBy?.name || 'User'} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#17191c] truncate">
                        {expense.title}
                      </p>
                      <p className="text-xs text-[#777b86] mt-0.5">
                        Paid by {expense.paidBy?.name} · {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-editorial text-lg font-semibold text-[#17191c]">
                      {formatCurrency(expense.amount)}
                    </p>
                    <span className="text-[11px] text-[#777b86] uppercase font-semibold">
                      {expense.splitType || 'Equal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#777b86] py-12 text-center">
              No expenses in this group yet.
            </p>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(group.members || []).map((m) => (
              <div
                key={m._id}
                className="p-4 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] flex items-center gap-3"
              >
                <MemberAvatar name={m.name} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#17191c] truncate">{m.name}</p>
                  <p className="text-xs text-[#777b86] truncate">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'balances' && (
        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
          <div className="space-y-4">
            {balances.map((b, i) => (
              <div
                key={i}
                className="p-4 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <MemberAvatar name={b.user?.name || 'Member'} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-[#17191c]">
                      {b.user?.name || 'Member'}
                    </p>
                    <p className="text-xs text-[#777b86]">{b.user?.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-editorial text-xl font-semibold ${
                      b.balance > 0
                        ? 'text-[#17191c]'
                        : b.balance < 0
                        ? 'text-[#5d2a1a]'
                        : 'text-[#777b86]'
                    }`}
                  >
                    {b.balance > 0 ? '+' : ''}
                    {formatCurrency(b.balance)}
                  </p>
                  <span className="text-[11px] text-[#777b86]">
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
