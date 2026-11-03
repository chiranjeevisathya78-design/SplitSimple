import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  Tag,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { expenseService, groupService } from '../services';
import { formatCurrency, formatDate, CATEGORIES } from '../utils/helpers';
import { MemberAvatar } from '../components/StatCard';
import { Button, SecondaryButton } from '../components/Button';

export default function ExpensesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const groupParam = searchParams.get('groupId') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');

  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [searchInput, setSearchInput] = useState(searchParam);

  // Load groups for dropdown filter
  useEffect(() => {
    groupService
      .getAll()
      .then((res) => {
        const raw = res.data?.data?.groups || res.data?.groups || [];
        setGroups(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {});
  }, []);

  // Fetch expenses on filter change
  useEffect(() => {
    fetchExpenses();
  }, [categoryParam, searchParam, groupParam, pageParam]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryParam) params.category = categoryParam;
      if (searchParam) params.search = searchParam;
      if (groupParam) params.groupId = groupParam;
      if (pageParam) params.page = pageParam;

      const res = await expenseService.getAll(params);
      const data = res.data?.data || res.data || {};
      const expList = data.expenses || (Array.isArray(data) ? data : []);
      setExpenses(expList);
      setTotalPages(data.pagination?.pages || data.totalPages || 1);
    } catch {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense? Ledger balances will update automatically.')) {
      return;
    }
    setDeletingId(id);
    try {
      await expenseService.delete(id);
      toast.success('Expense removed');
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch {
      toast.error('Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#f2f2f3]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Transaction Records
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c]">
            Expense History
          </h1>
          <p className="text-sm text-[#777b86] mt-1 max-w-xl">
            Detailed ledger of all shared costs, categories, and participant shares.
          </p>
        </div>

        <Link to="/expenses/new">
          <Button variant="primary" icon={Plus}>
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[20px] border border-[#f2f2f3] p-4 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#777b86] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#fafafb] text-sm text-[#17191c] placeholder-[#a3a6af] rounded-full border border-[#f2f2f3] pl-10 pr-4 py-2 focus:outline-none focus:border-[#17191c]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Group Filter */}
          <select
            value={groupParam}
            onChange={(e) => updateFilter('groupId', e.target.value)}
            className="bg-[#fafafb] text-xs font-medium text-[#17191c] rounded-full border border-[#f2f2f3] px-3.5 py-2 focus:outline-none focus:border-[#17191c]"
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryParam}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="bg-[#fafafb] text-xs font-medium text-[#17191c] rounded-full border border-[#f2f2f3] px-3.5 py-2 focus:outline-none focus:border-[#17191c]"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>

          {(categoryParam || searchParam || groupParam) && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchParams({});
              }}
              className="text-xs text-[#777b86] hover:text-[#17191c] underline px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Expense List Card */}
      <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
          </div>
        ) : expenses.length > 0 ? (
          <div className="divide-y divide-[#f2f2f3]">
            {expenses.map((expense) => {
              const groupName =
                expense.groupId?.name || expense.group?.name || 'Group';
              const payerName = expense.paidBy?.name || 'Member';
              const isDeleting = deletingId === expense._id;

              return (
                <div
                  key={expense._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#fafafb] px-3 rounded-[16px]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <MemberAvatar name={payerName} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#17191c] truncate">
                        {expense.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#777b86]">
                        <span className="font-medium text-[#17191c]">{groupName}</span>
                        <span>·</span>
                        <span>Paid by {payerName}</span>
                        <span>·</span>
                        <span>{formatDate(expense.date || expense.createdAt)}</span>
                        <span>·</span>
                        <span className="capitalize">{expense.category || 'other'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    <div className="text-right">
                      <p className="font-editorial text-xl font-semibold text-[#17191c]">
                        {formatCurrency(expense.amount)}
                      </p>
                      <span className="text-[11px] uppercase tracking-wider text-[#777b86] font-semibold">
                        {expense.splitType || 'Equal'} ({expense.participants?.length || 0})
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      disabled={isDeleting}
                      title="Delete expense"
                      className="p-2 text-[#a3a6af] hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-[#777b86]">
            <Receipt className="w-8 h-8 mx-auto mb-3 text-[#a3a6af]" />
            <p className="font-editorial text-2xl font-semibold text-[#17191c]">
              No expenses found
            </p>
            <p className="text-xs text-[#777b86] mt-1 max-w-sm mx-auto">
              {searchParam || categoryParam || groupParam
                ? 'Try adjusting your search or filters to see more results.'
                : 'Get started by creating your first group expense.'}
            </p>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="pt-6 mt-6 border-t border-[#f2f2f3] flex items-center justify-between text-xs text-[#777b86]">
            <span>
              Page {pageParam} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pageParam <= 1}
                onClick={() => updateFilter('page', (pageParam - 1).toString())}
                className="p-1.5 rounded-full border border-[#f2f2f3] hover:bg-[#fafafb] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pageParam >= totalPages}
                onClick={() => updateFilter('page', (pageParam + 1).toString())}
                className="p-1.5 rounded-full border border-[#f2f2f3] hover:bg-[#fafafb] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
