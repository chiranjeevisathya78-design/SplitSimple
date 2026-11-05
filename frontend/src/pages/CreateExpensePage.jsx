import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Receipt,
  Users,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  Tag,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { expenseService, groupService } from '../services';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, formatCurrency } from '../utils/helpers';
import { Button, SecondaryButton } from '../components/Button';
import { Input, Select } from '../components/Input';
import { MemberAvatar } from '../components/StatCard';

export default function CreateExpensePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);

  // Form inputs
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('groceries');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState('equal'); // 'equal' | 'custom'

  // Participants & custom shares
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [customShares, setCustomShares] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load groups
  useEffect(() => {
    groupService
      .getAll()
      .then((res) => {
        const raw = res.data?.data?.groups || res.data?.groups || [];
        const gList = Array.isArray(raw) ? raw : [];
        setGroups(gList);
        if (gList.length > 0) {
          setSelectedGroup(gList[0]._id);
        }
      })
      .catch(() => toast.error('Failed to load groups'))
      .finally(() => setLoadingGroups(false));
  }, []);

  // Update members when group changes
  useEffect(() => {
    if (!selectedGroup) return;
    const g = groups.find((item) => item._id === selectedGroup);
    if (g && g.members) {
      setGroupMembers(g.members);
      const allIds = g.members.map((m) => m._id);
      setSelectedParticipants(allIds);

      // Default paidBy to current user if member, otherwise first member
      if (user && allIds.includes(user._id)) {
        setPaidBy(user._id);
      } else if (allIds.length > 0) {
        setPaidBy(allIds[0]);
      }
    }
  }, [selectedGroup, groups, user]);

  const toggleParticipant = (memberId) => {
    if (selectedParticipants.includes(memberId)) {
      if (selectedParticipants.length <= 1) {
        toast.error('At least one participant must be included');
        return;
      }
      setSelectedParticipants(selectedParticipants.filter((id) => id !== memberId));
    } else {
      setSelectedParticipants([...selectedParticipants, memberId]);
    }
  };

  const handleCustomShareChange = (memberId, val) => {
    setCustomShares({
      ...customShares,
      [memberId]: val,
    });
  };

  // Calculate totals and validation
  const parsedAmount = parseFloat(amount) || 0;
  const customSum = Object.entries(customShares).reduce((sum, [id, val]) => {
    if (selectedParticipants.includes(id)) {
      return sum + (parseFloat(val) || 0);
    }
    return sum;
  }, 0);

  const customDifference = Math.round((parsedAmount - customSum) * 100) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Expense title is required');
      return;
    }
    if (parsedAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }
    if (!selectedGroup) {
      toast.error('Please select a group');
      return;
    }
    if (selectedParticipants.length === 0) {
      toast.error('Select at least one participant');
      return;
    }

    let payloadParticipants = [];

    if (splitType === 'equal') {
      payloadParticipants = selectedParticipants;
    } else {
      // Custom split validation
      if (Math.abs(customDifference) > 0.01) {
        toast.error(
          `Custom shares must equal total amount. Remaining: ₹${customDifference.toFixed(2)}`
        );
        return;
      }

      payloadParticipants = selectedParticipants.map((id) => ({
        user: id,
        share: parseFloat(customShares[id]) || 0,
      }));
    }

    setSubmitting(true);
    try {
      await expenseService.create({
        groupId: selectedGroup,
        title: title.trim(),
        amount: parsedAmount,
        paidBy,
        category,
        date,
        description: description.trim(),
        splitType,
        participants: payloadParticipants,
      });

      toast.success('Expense recorded successfully in ledger!');
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-[#e5e7eb]">
        <Link
          to="/expenses"
          className="text-xs text-[#6d6c6b] hover:text-[#0c0a08] inline-flex items-center gap-1.5 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Expenses</span>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] block mb-1">
          New Entry
        </span>
        <h1 className="text-3xl font-normal text-[#0c0a08] tracking-tight">
          Record Shared Expense
        </h1>
      </div>

      {/* Main Expense Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 sm:p-8 space-y-6"
      >
        {/* Title and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <Input
              label="Expense Title"
              id="title"
              placeholder="e.g. Weekly Groceries, Beach Resort, Dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1.5 font-normal">
              Amount (₹ INR) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6d6c6b] text-sm">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-[#ffffff] text-[#0c0a08] placeholder-[#6d6c6b] text-sm rounded-[10px] border border-[#e5e7eb] py-2.5 pl-8 pr-3.5 focus:outline-none focus:border-[#0c0a08]"
              />
            </div>
          </div>
        </div>

        {/* Group and Paid By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Group Workspace"
            id="group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            options={groups.map((g) => ({ value: g._id, label: g.name }))}
            required
          />

          <Select
            label="Paid By"
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            options={groupMembers.map((m) => ({ value: m._id, label: m.name }))}
            required
          />
        </div>

        {/* Category and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={Object.entries(CATEGORIES).map(([key, cat]) => ({
              value: key,
              label: cat.label,
            }))}
            required
          />

          <Input
            label="Date"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Split Type Selector */}
        <div className="pt-4 border-t border-[#e5e7eb]">
          <span className="block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-2 font-normal">
            Splitting Method
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSplitType('equal')}
              className={`px-4 py-2 rounded-[6px] text-xs font-normal transition-all ${
                splitType === 'equal'
                  ? 'bg-[#0c0a08] text-white'
                  : 'bg-[#f4f2f0] text-[#6d6c6b] border border-[#e5e7eb] hover:text-[#0c0a08]'
              }`}
            >
              Equal Split
            </button>
            <button
              type="button"
              onClick={() => setSplitType('custom')}
              className={`px-4 py-2 rounded-[6px] text-xs font-normal transition-all ${
                splitType === 'custom'
                  ? 'bg-[#0c0a08] text-white'
                  : 'bg-[#f4f2f0] text-[#6d6c6b] border border-[#e5e7eb] hover:text-[#0c0a08]'
              }`}
            >
              Custom Amounts
            </button>
          </div>
        </div>

        {/* Participants Selection & Breakdown */}
        <div className="bg-[#f4f2f0] rounded-[12px] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
              Participants ({selectedParticipants.length} selected)
            </span>
            {splitType === 'equal' && parsedAmount > 0 && selectedParticipants.length > 0 && (
              <span className="text-xs text-[#0c0a08]">
                ₹{(parsedAmount / selectedParticipants.length).toFixed(2)} per person
              </span>
            )}
          </div>

          <div className="divide-y divide-[#e5e7eb] bg-white rounded-[10px] border border-[#e5e7eb] px-3">
            {groupMembers.map((member) => {
              const isSelected = selectedParticipants.includes(member._id);
              const customVal = customShares[member._id] || '';

              return (
                <div
                  key={member._id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleParticipant(member._id)}
                      className="w-4 h-4 rounded-[4px] text-[#0c0a08] focus:ring-0"
                    />
                    <MemberAvatar name={member.name} size="sm" />
                    <div>
                      <p className="text-xs sm:text-sm font-normal text-[#0c0a08]">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-[#6d6c6b]">{member.email}</p>
                    </div>
                  </label>

                  {splitType === 'custom' && isSelected && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#6d6c6b]">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={customVal}
                        onChange={(e) =>
                          handleCustomShareChange(member._id, e.target.value)
                        }
                        className="w-24 bg-[#f4f2f0] text-right text-xs rounded-[6px] border border-[#e5e7eb] py-1.5 px-2.5 focus:outline-none focus:border-[#0c0a08]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom sum validation banner */}
          {splitType === 'custom' && (
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-[#6d6c6b]">
                Total Allocated: ₹{customSum.toFixed(2)} / ₹{parsedAmount.toFixed(2)}
              </span>
              <span
                className={`font-normal ${
                  Math.abs(customDifference) <= 0.01
                    ? 'text-emerald-700'
                    : 'text-rose-600'
                }`}
              >
                {Math.abs(customDifference) <= 0.01
                  ? '✓ Exact match'
                  : `Difference: ₹${customDifference.toFixed(2)}`}
              </span>
            </div>
          )}
        </div>

        {/* Description textarea */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1.5 font-normal">
            Notes / Description (Optional)
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any extra notes or itemized details..."
            className="w-full bg-white text-[#0c0a08] placeholder-[#6d6c6b] text-xs rounded-[10px] border border-[#e5e7eb] p-3 focus:outline-none focus:border-[#0c0a08]"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e5e7eb]">
          <Link to="/expenses">
            <SecondaryButton>Cancel</SecondaryButton>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            icon={Receipt}
          >
            Record Expense
          </Button>
        </div>
      </form>
    </div>
  );
}
