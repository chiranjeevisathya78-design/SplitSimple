import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Receipt,
  ArrowLeft,
  Loader2,
  Trash2,
  Pencil,
  Plus,
  Check,
  X,
  MoreHorizontal,
  Utensils,
  ShoppingCart,
  Car,
  Film,
  Home,
  Heart,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService, expenseService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getInitials } from '../utils/helpers';

const categoryIcons = {
  food: Utensils,
  transport: Car,
  entertainment: Film,
  shopping: ShoppingCart,
  utilities: Zap,
  rent: Home,
  health: Heart,
  other: MoreHorizontal,
};

const TABS = ['Overview', 'Expenses', 'Members', 'Balances'];

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [groupRes, expensesRes, balancesRes] = await Promise.all([
        groupService.getById(id),
        expenseService.getAll({ groupId: id }),
        groupService.getBalances(id),
      ]);
      const g = groupRes.data.data?.group || groupRes.data.group || groupRes.data;
      setGroup(g);
      const expList = expensesRes.data.data?.expenses || expensesRes.data.expenses || [];
      setExpenses(Array.isArray(expList) ? expList : []);
      const balList = balancesRes.data.data?.balances || balancesRes.data.balances || [];
      setBalances(Array.isArray(balList) ? balList : []);
      setEditName(g.name || '');
      setEditDescription(g.description || '');
    } catch (err) {
      console.error('Failed to load group:', err);
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

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      toast.error('Group name is required');
      return;
    }
    setSaving(true);
    try {
      await groupService.update(id, { name: editName.trim(), description: editDescription.trim() });
      setGroup((prev) => ({ ...prev, name: editName.trim(), description: editDescription.trim() }));
      setEditing(false);
      toast.success('Group updated');
    } catch (err) {
      toast.error('Failed to update group');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await groupService.delete(id);
      toast.success('Group deleted');
      navigate('/groups');
    } catch (err) {
      toast.error('Failed to delete group');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Group not found</p>
        <Link to="/groups" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to Groups
        </Link>
      </div>
    );
  }

  const members = group.members || [];
  const totalSpending = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/groups"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Groups
      </Link>

      {/* Group Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        {editing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Group name"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditName(group.name);
                  setEditDescription(group.description || '');
                }}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              {group.description && <p className="text-gray-500 mt-1">{group.description}</p>}
              <p className="text-sm text-gray-400 mt-2">
                {members.length} member{members.length !== 1 ? 's' : ''} · Created{' '}
                {formatDate(group.createdAt)}
              </p>
            </div>
            {isCreator && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3">
              Are you sure you want to delete this group? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Total Spending</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalSpending)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-xl font-semibold text-gray-900">{expenses.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Members</p>
              <p className="text-xl font-semibold text-gray-900">{members.length}</p>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            {expenses.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {expenses.slice(0, 5).map((expense) => {
                  const catKey = (expense.category || 'other').toLowerCase();
                  const CatIcon = categoryIcons[catKey] || MoreHorizontal;
                  return (
                    <div key={expense._id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <CatIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{expense.title || expense.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(expense.date || expense.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">No expenses yet</p>
            )}
          </div>

          {/* Balance Summary */}
          {balances.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Balance Summary</h3>
              <div className="space-y-2">
                {balances.slice(0, 5).map((b, i) => (
                  <div key={b.userId || i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-700">
                          {getInitials(b.name || b.userName || '?')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{b.name || b.userName}</span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        b.balance > 0 ? 'text-green-600' : b.balance < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      {b.balance > 0 ? '+' : ''}
                      {formatCurrency(b.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Expenses' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">All Expenses</h3>
            <Link
              to={`/expenses/new?groupId=${id}`}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </Link>
          </div>
          {expenses.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {expenses.map((expense) => {
                const catKey = (expense.category || 'other').toLowerCase();
                const CatIcon = categoryIcons[catKey] || MoreHorizontal;
                const paidBy = expense.paidBy?.name || expense.paidBy?.email || 'Unknown';
                return (
                  <div key={expense._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <CatIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.title || expense.description}</p>
                        <p className="text-xs text-gray-500">
                          Paid by {paidBy} · {formatDate(expense.date || expense.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No expenses yet</p>
              <Link
                to={`/expenses/new?groupId=${id}`}
                className="text-indigo-600 hover:underline text-sm mt-1 inline-block"
              >
                Add the first expense
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Members' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Members ({members.length})</h3>
          <div className="divide-y divide-gray-100">
            {members.map((member, i) => (
              <div key={member._id || i} className="flex items-center gap-3 py-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-700">
                    {getInitials(member.name || member.email || '?')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                {(member._id === group.createdBy || member._id === group.createdBy?._id) && (
                  <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                    Creator
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Balances' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Balances</h3>
            <Link
              to="/settlements"
              className="text-indigo-600 hover:underline text-sm"
            >
              Settle up →
            </Link>
          </div>
          {balances.length > 0 ? (
            <div className="space-y-3">
              {balances.map((b, i) => (
                <div
                  key={b.userId || i}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-700">
                        {getInitials(b.name || b.userName || '?')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{b.name || b.userName}</p>
                      <p className="text-xs text-gray-500">
                        {b.balance > 0
                          ? 'gets back'
                          : b.balance < 0
                          ? 'owes'
                          : 'settled up'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-lg font-semibold ${
                      b.balance > 0 ? 'text-green-600' : b.balance < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}
                  >
                    {b.balance > 0 ? '+' : ''}
                    {formatCurrency(b.balance)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">No balance data available</p>
          )}
        </div>
      )}
    </div>
  );
}
