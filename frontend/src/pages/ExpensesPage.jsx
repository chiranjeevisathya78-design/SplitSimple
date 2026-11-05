import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { expenseService, groupService } from '../services';
import { formatCurrency, formatDate, CATEGORIES } from '../utils/helpers';
import { MemberAvatar } from '../components/StatCard';
import { Button } from '../components/Button';

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
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#e5e7eb]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] block mb-1">
            Transaction Ledger
          </span>
          <h1 className="text-3xl sm:text-4xl font-normal text-[#0c0a08] tracking-tight">
            Expense Records
          </h1>
          <p className="text-xs sm:text-sm text-[#6d6c6b] mt-1 max-w-xl">
            Detailed ledger of all shared costs, categories, and participant shares.
          </p>
        </div>

        <Link to="/expenses/new">
          <Button variant="primary" size="md" icon={Plus}>
            Record Expense
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#6d6c6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#f4f2f0] text-xs text-[#0c0a08] placeholder-[#6d6c6b] rounded-[10px] border border-[#e5e7eb] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#0c0a08]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Group Filter */}
          <select
            value={groupParam}
            onChange={(e) => updateFilter('groupId', e.target.value)}
            className="bg-[#f4f2f0] text-xs text-[#0c0a08] rounded-[6px] border border-[#e5e7eb] px-3 py-2 focus:outline-none focus:border-[#0c0a08]"
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
            className="bg-[#f4f2f0] text-xs text-[#0c0a08] rounded-[6px] border border-[#e5e7eb] px-3 py-2 focus:outline-none focus:border-[#0c0a08]"
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
              className="text-xs text-[#6d6c6b] hover:text-[#0c0a08] underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Expense List Card */}
      <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
          </div>
        ) : expenses.length > 0 ? (
          <div className="divide-y divide-[#e5e7eb]">
            {expenses.map((expense) => {
              const groupName =
                expense.groupId?.name || expense.group?.name || 'Group';
              const payerName = expense.paidBy?.name || 'Member';
              const isDeleting = deletingId === expense._id;

              return (
                <div
                  key={expense._id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#f4f2f0]/60 px-3 rounded-[10px]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <MemberAvatar name={payerName} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-normal text-[#0c0a08] truncate">
                        {expense.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#6d6c6b]">
                        <span className="text-[#0c0a08]">{groupName}</span>
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
                      <p className="text-base sm:text-lg font-normal text-[#0c0a08]">
                        {formatCurrency(expense.amount)}
                      </p>
                      <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                        {expense.splitType || 'Equal'} ({expense.participants?.length || 0})
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      disabled={isDeleting}
                      title="Delete expense"
                      className="p-2 text-[#6d6c6b] hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition"
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
          <div className="py-16 text-center text-[#6d6c6b]">
            <Receipt className="w-8 h-8 mx-auto mb-3 text-[#6d6c6b]" />
            <p className="text-xl font-normal text-[#0c0a08]">
              No expenses recorded
            </p>
            <p className="text-xs text-[#6d6c6b] mt-1 max-w-sm mx-auto">
              {searchParam || categoryParam || groupParam
                ? 'Try adjusting your search or filters to see more results.'
                : 'Get started by creating your first group expense.'}
            </p>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="pt-5 mt-5 border-t border-[#e5e7eb] flex items-center justify-between text-xs text-[#6d6c6b]">
            <span>
              Page {pageParam} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={pageParam <= 1}
                onClick={() => updateFilter('page', (pageParam - 1).toString())}
                className="p-1.5 rounded-[6px] border border-[#e5e7eb] hover:bg-[#f4f2f0] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pageParam >= totalPages}
                onClick={() => updateFilter('page', (pageParam + 1).toString())}
                className="p-1.5 rounded-[6px] border border-[#e5e7eb] hover:bg-[#f4f2f0] disabled:opacity-40"
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
