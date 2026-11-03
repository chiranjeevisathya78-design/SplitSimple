import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  ChevronDown,
  ChevronUp,
  Receipt,
  Calendar,
  Users,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { expenseService, groupService } from '../services';
import { formatCurrency, formatDate, CATEGORIES } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function ExpensesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Filters from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const groupId = searchParams.get('groupId') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    groupService
      .getAll()
      .then((res) => setGroups(res.data.data.groups || res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [category, search, groupId, page]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      if (groupId) params.groupId = groupId;
      if (page) params.page = page;
      const res = await expenseService.getAll(params);
      const data = res.data.data;
      setExpenses(data.expenses || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await expenseService.delete(id);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const getCategoryBadge = (cat) => {
    const info = CATEGORIES[cat] || CATEGORIES.other;
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: info.color }}
      >
        {info.label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">Track and manage your shared expenses</p>
        </div>
        <Link
          to="/expenses/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search expenses..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Category filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* Group filter */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={groupId}
              onChange={(e) => updateFilter('groupId', e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Groups</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
          <p className="text-gray-500 mb-6">
            {search || category || groupId
              ? 'Try adjusting your filters'
              : 'Start by adding your first expense'}
          </p>
          {!search && !category && !groupId && (
            <Link
              to="/expenses/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => {
            const isExpanded = expandedId === expense._id;
            return (
              <div
                key={expense._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : expense._id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor:
                          (CATEGORIES[expense.category] || CATEGORIES.other).color + '20',
                      }}
                    >
                      <Receipt
                        className="w-5 h-5"
                        style={{
                          color: (CATEGORIES[expense.category] || CATEGORIES.other).color,
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{expense.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-500">
                        <span>Paid by {expense.paidBy?.name || 'Unknown'}</span>
                        <span>·</span>
                        <span>{formatDate(expense.date || expense.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {getCategoryBadge(expense.category)}
                    <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrency(expense.amount)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      {expense.group && (
                        <div>
                          <span className="text-gray-500">Group:</span>{' '}
                          <Link
                            to={`/groups/${expense.group._id || expense.group}`}
                            className="text-indigo-600 hover:underline"
                          >
                            {expense.group.name || expense.group}
                          </Link>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Split Type:</span>{' '}
                        <span className="text-gray-900 capitalize">
                          {expense.splitType || 'equal'}
                        </span>
                      </div>
                      {expense.description && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Description:</span>{' '}
                          <span className="text-gray-900">{expense.description}</span>
                        </div>
                      )}
                    </div>
                    {expense.participants && expense.participants.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 block mb-2">
                          Split between:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {expense.participants.map((p, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-gray-200 text-sm"
                            >
                              <span>{p.user?.name || 'Member'}</span>
                              <span className="text-gray-400">·</span>
                              <span className="font-medium">
                                {formatCurrency(p.share || 0)}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(expense._id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => updateFilter('page', String(page - 1))}
            disabled={page <= 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => updateFilter('page', String(page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
