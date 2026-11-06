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
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-3 border-black">
        <div>
          <span className="px-2.5 py-0.5 bg-[#00f0ff] text-black border-2 border-black rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-[2px_2px_0px_#000]">
            TRANSACTION LOG
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
            EXPENSE LEDGER
          </h1>
          <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
            Detailed record of all shared costs, categories, and participant shares.
          </p>
        </div>

        <Link to="/expenses/new">
          <Button variant="yellow" icon={Plus}>
            Record Expense
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-brutal-card p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative font-mono">
          <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="SEARCH BY TITLE..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-white/85 backdrop-blur-md text-xs sm:text-sm text-black placeholder-neutral-500 rounded-[8px] border-2 border-black pl-10 pr-4 py-2.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),2px_2px_0px_#000] focus:outline-none focus:shadow-[3px_3px_0px_#000] focus:bg-white uppercase font-bold"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
          {/* Group Filter */}
          <select
            value={groupParam}
            onChange={(e) => updateFilter('groupId', e.target.value)}
            className="bg-white/85 backdrop-blur-md text-xs font-bold uppercase text-black rounded-[8px] border-2 border-black px-3.5 py-2.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),2px_2px_0px_#000] focus:outline-none focus:shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            <option value="">ALL GROUPS</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryParam}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="bg-white/85 backdrop-blur-md text-xs font-bold uppercase text-black rounded-[8px] border-2 border-black px-3.5 py-2.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),2px_2px_0px_#000] focus:outline-none focus:shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            <option value="">ALL CATEGORIES</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label.toUpperCase()}
              </option>
            ))}
          </select>

          {(categoryParam || searchParam || groupParam) && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchParams({});
              }}
              className="text-xs font-mono font-bold uppercase text-[#ff3377] hover:underline px-2 cursor-pointer"
            >
              [CLEAR FILTERS]
            </button>
          )}
        </div>
      </div>

      {/* Expense List Card */}
      <div className="glass-brutal-card p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 font-mono text-sm font-bold">
            <Loader2 className="w-6 h-6 animate-spin text-black mr-2" />
            <span>LOADING EXPENSES...</span>
          </div>
        ) : expenses.length > 0 ? (
          <div className="divide-y-2 divide-black/15">
            {expenses.map((expense) => {
              const groupName =
                expense.groupId?.name || expense.group?.name || 'Group';
              const payerName = expense.paidBy?.name || 'Member';
              const isDeleting = deletingId === expense._id;

              return (
                <div
                  key={expense._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/60 px-3 rounded-[8px] transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <MemberAvatar name={payerName} size="md" />
                    <div className="min-w-0">
                      <p className="text-base font-display font-bold text-black truncate uppercase">
                        {expense.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 font-mono text-xs text-neutral-600">
                        <span className="font-bold text-black">{groupName}</span>
                        <span>·</span>
                        <span>Paid by {payerName}</span>
                        <span>·</span>
                        <span>{formatDate(expense.date || expense.createdAt)}</span>
                        <span>·</span>
                        <span className="px-2 py-0.5 bg-gradient-to-r from-[#ccff00] to-[#b8f000] border border-black font-bold text-[9px] uppercase rounded-[4px] shadow-[1px_1px_0px_#000]">
                          {expense.category || 'general'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    <div className="text-right">
                      <p className="font-mono text-lg font-bold text-black">
                        {formatCurrency(expense.amount)}
                      </p>
                      <span className="font-mono text-[10px] font-bold uppercase text-neutral-500">
                        {expense.splitType || 'Equal'} ({expense.participants?.length || 0})
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      disabled={isDeleting}
                      title="Delete expense"
                      className="p-2 bg-white/80 hover:bg-[#ff3377] hover:text-white text-black border-2 border-black rounded-[6px] shadow-[2px_2px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.8)] hover:shadow-[3px_3px_0px_#000] transition-all cursor-pointer"
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
          <div className="py-16 text-center font-mono">
            <Receipt className="w-10 h-10 mx-auto mb-3 text-neutral-400" />
            <p className="text-xl font-display font-black text-black uppercase">
              No Expenses Recorded
            </p>
            <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto mb-6">
              {searchParam || categoryParam || groupParam
                ? 'Try adjusting your search or filters to see more results.'
                : 'Get started by creating your first group expense.'}
            </p>
            <Link to="/expenses/new">
              <Button variant="yellow" icon={Plus}>
                Record First Expense
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="pt-6 mt-6 border-t-2 border-black flex items-center justify-between font-mono text-xs font-bold uppercase">
            <span>
              Page {pageParam} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pageParam <= 1}
                onClick={() => updateFilter('page', (pageParam - 1).toString())}
                className="p-2 border-2 border-black bg-white hover:bg-[#ccff00] rounded-[4px] shadow-[2px_2px_0px_#000] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pageParam >= totalPages}
                onClick={() => updateFilter('page', (pageParam + 1).toString())}
                className="p-2 border-2 border-black bg-white hover:bg-[#ccff00] rounded-[4px] shadow-[2px_2px_0px_#000] disabled:opacity-40 cursor-pointer"
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
