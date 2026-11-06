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
  Folder,
  Sparkles,
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
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-sm font-bold">
        <Loader2 className="w-6 h-6 animate-spin text-black mr-2" />
        <span>LOADING GROUP LEDGER...</span>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-20 font-mono">
        <p className="font-bold text-base">GROUP NOT FOUND.</p>
        <Link to="/groups" className="text-xs text-black underline mt-2 block font-bold">
          ← BACK TO GROUPS
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
          className="font-mono text-xs font-bold uppercase text-black hover:text-[#ff529a] flex items-center gap-1.5 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Groups</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-3 border-black">
          <div>
            <span className="px-2.5 py-0.5 bg-[#ccff00] text-black border-2 border-black rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-[2px_2px_0px_#000]">
              GROUP DESK
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none mt-1">
              {group.name}
            </h1>
            {group.description && (
              <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
                {group.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/expenses/new">
              <Button variant="yellow" icon={Plus}>
                Add Expense
              </Button>
            </Link>
            <Link to={`/settlements?groupId=${group._id}`}>
              <Button variant="cyan" icon={Handshake}>
                Settlement
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
                  className="p-2.5 bg-white text-black hover:bg-[#ff3b30] hover:text-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] transition cursor-pointer"
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
          className="bg-white border-3 border-black rounded-[4px] p-5 sm:p-6 space-y-4 shadow-[5px_5px_0px_#000]"
        >
          <h3 className="font-display font-black text-lg text-black uppercase">Edit Group Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Group name"
              required
              className="bg-white text-sm text-black border-2 border-black rounded-[4px] px-3.5 py-2.5 shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#000]"
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="bg-white text-sm text-black border-2 border-black rounded-[4px] px-3.5 py-2.5 shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#000]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <SecondaryButton size="sm" onClick={() => setEditing(false)}>
              Cancel
            </SecondaryButton>
            <Button size="sm" variant="yellow" type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-black pb-3">
        {[
          { key: 'overview', label: 'OVERVIEW', color: 'bg-[#ccff00]' },
          { key: 'expenses', label: `EXPENSES (${expenses.length})`, color: 'bg-[#ff529a]' },
          { key: 'members', label: `MEMBERS (${group.members?.length || 0})`, color: 'bg-[#00f0ff]' },
          { key: 'balances', label: 'BALANCES', color: 'bg-[#ff8800]' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 border-2 border-black font-mono text-xs font-bold uppercase rounded-[4px] transition-all cursor-pointer ${
              activeTab === tab.key
                ? `${tab.color} text-black shadow-[3px_3px_0px_#000] -translate-y-0.5`
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#ccff00] border-3 border-black p-5 rounded-[4px] shadow-[5px_5px_0px_#000]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                TOTAL GROUP SPENT
              </span>
              <p className="text-3xl font-display font-black text-black mt-1">
                {formatCurrency(totalSpent)}
              </p>
              <p className="font-mono text-xs text-neutral-800 mt-2">
                Across {expenses.length} recorded bills
              </p>
            </div>

            <div className="bg-[#00f0ff] border-3 border-black p-5 rounded-[4px] shadow-[5px_5px_0px_#000]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                WORKSPACE PARTICIPANTS
              </span>
              <p className="text-3xl font-display font-black text-black mt-1">
                {group.members?.length || 0} Members
              </p>
              <p className="font-mono text-xs text-neutral-800 mt-2">
                All accounts tracked in paise
              </p>
            </div>

            <div className="bg-white border-3 border-black p-5 rounded-[4px] shadow-[5px_5px_0px_#000]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                SETTLEMENT STATUS
              </span>
              <p className="text-3xl font-display font-black text-black mt-1">
                {balances.every((b) => b.balance === 0) ? 'Settled ✓' : 'Active Tab'}
              </p>
              <Link
                to={`/settlements?groupId=${group._id}`}
                className="font-mono text-xs font-bold text-black hover:text-[#ff529a] underline mt-2 block"
              >
                Inspect Settlement Plan →
              </Link>
            </div>
          </div>

          {/* Members Strip */}
          <div className="bg-white border-3 border-black rounded-[4px] p-6 shadow-[6px_6px_0px_#000]">
            <h3 className="font-display font-black text-xl text-black uppercase mb-4">
              Registered Group Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.members?.map((m) => {
                const memberUser = m.user || m;
                return (
                  <div
                    key={memberUser._id}
                    className="p-3 bg-[#faf7ee] border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000] flex items-center gap-3"
                  >
                    <MemberAvatar name={memberUser.name} size="md" />
                    <div className="min-w-0">
                      <p className="font-display font-bold text-sm text-black truncate">
                        {memberUser.name}
                      </p>
                      <p className="font-mono text-[11px] text-neutral-600 truncate">
                        {memberUser.email}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Expenses List */}
      {activeTab === 'expenses' && (
        <div className="bg-white border-3 border-black rounded-[4px] p-6 shadow-[6px_6px_0px_#000]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
            <h3 className="font-display font-black text-xl text-black uppercase">
              Group Expenses ({expenses.length})
            </h3>
            <Link to="/expenses/new">
              <Button size="sm" variant="yellow" icon={Plus}>
                Add Expense
              </Button>
            </Link>
          </div>

          {expenses.length > 0 ? (
            <div className="divide-y-2 divide-black">
              {expenses.map((expense) => {
                const payerName = expense.paidBy?.name || 'Member';
                return (
                  <div
                    key={expense._id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#fffef7] px-2 rounded-[2px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MemberAvatar name={payerName} size="md" />
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm text-black truncate">
                          {expense.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5 font-mono text-xs text-neutral-600">
                          <span>Paid by {payerName}</span>
                          <span>·</span>
                          <span>{formatDate(expense.date || expense.createdAt)}</span>
                          <span>·</span>
                          <span className="uppercase">{expense.category || 'general'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono text-base font-bold text-black">
                        {formatCurrency(expense.amount)}
                      </p>
                      <span className="font-mono text-[10px] uppercase text-neutral-600">
                        {expense.splitType || 'Equal'} ({expense.participants?.length || 0})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center font-mono text-xs uppercase text-neutral-500">
              No expenses recorded in this group yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Members Detail */}
      {activeTab === 'members' && (
        <div className="bg-white border-3 border-black rounded-[4px] p-6 shadow-[6px_6px_0px_#000]">
          <h3 className="font-display font-black text-xl text-black uppercase mb-4">
            Members & Roles
          </h3>
          <div className="divide-y-2 divide-black">
            {group.members?.map((m) => {
              const memberUser = m.user || m;
              const isLead = memberUser._id === group.createdBy || memberUser._id === group.createdBy?._id;
              return (
                <div key={memberUser._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={memberUser.name} size="md" />
                    <div>
                      <p className="font-display font-bold text-sm text-black">
                        {memberUser.name}
                      </p>
                      <p className="font-mono text-xs text-neutral-600">{memberUser.email}</p>
                    </div>
                  </div>
                  {isLead && (
                    <span className="px-2 py-0.5 bg-[#ccff00] border-2 border-black font-mono text-[10px] font-bold uppercase rounded-[2px] shadow-[2px_2px_0px_#000]">
                      WORKSPACE CREATOR
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Balances */}
      {activeTab === 'balances' && (
        <div className="bg-white border-3 border-black rounded-[4px] p-6 shadow-[6px_6px_0px_#000]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black">
            <h3 className="font-display font-black text-xl text-black uppercase">
              Member Net Positions
            </h3>
            <Link to={`/settlements?groupId=${group._id}`}>
              <Button size="sm" variant="cyan" icon={Handshake}>
                Execute Settlement
              </Button>
            </Link>
          </div>

          <div className="divide-y-2 divide-black">
            {balances.map((b) => {
              const isPositive = b.balance > 0;
              const isNegative = b.balance < 0;
              return (
                <div key={b.user?._id || b.userId} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={b.user?.name || b.name} size="md" />
                    <span className="font-display font-bold text-sm text-black">
                      {b.user?.name || b.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono text-base font-bold ${
                        isPositive ? 'text-[#00c853]' : isNegative ? 'text-[#ff3b30]' : 'text-black'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(b.balance)}
                    </span>
                    <p className="font-mono text-[10px] uppercase text-neutral-500">
                      {isPositive ? 'Owed to member' : isNegative ? 'Owes group' : 'Settled'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
