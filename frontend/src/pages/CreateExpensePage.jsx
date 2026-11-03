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

      toast.success('Expense recorded successfully!');
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#f2f2f3]">
        <div>
          <Link
            to="/expenses"
            className="text-xs font-semibold text-[#777b86] hover:text-[#17191c] flex items-center gap-1.5 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Expenses</span>
          </Link>
          <h1 className="font-editorial text-4xl font-normal text-[#17191c]">
            Record Shared Expense
          </h1>
        </div>
      </div>

      {/* Main Expense Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[24px] border border-[#f2f2f3] p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)] space-y-6"
      >
        {/* Title and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <label className="block text-xs font-semibold tracking-wider uppercase text-[#777b86] mb-2">
              Amount (₹ INR) <span className="text-[#5d2a1a]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#777b86] text-sm font-semibold">
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
                className="w-full bg-white text-[#17191c] placeholder-[#a3a6af] text-sm rounded-[16px] border border-[#f2f2f3] py-2.5 pl-8 pr-3.5 focus:outline-none focus:border-[#17191c]"
              />
            </div>
          </div>
        </div>

        {/* Group and Paid By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="pt-4 border-t border-[#f2f2f3]">
          <span className="block text-xs font-semibold tracking-wider uppercase text-[#777b86] mb-3">
            Splitting Method
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSplitType('equal')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                splitType === 'equal'
                  ? 'bg-[#17191c] text-white shadow-xs'
                  : 'bg-[#fafafb] text-[#777b86] border border-[#f2f2f3] hover:text-[#17191c]'
              }`}
            >
              Equal Split
            </button>
            <button
              type="button"
              onClick={() => setSplitType('custom')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                splitType === 'custom'
                  ? 'bg-[#17191c] text-white shadow-xs'
                  : 'bg-[#fafafb] text-[#777b86] border border-[#f2f2f3] hover:text-[#17191c]'
              }`}
            >
              Custom Amounts
            </button>
          </div>
        </div>

        {/* Participants Selection & Breakdown */}
        <div className="bg-[#fafafb] rounded-[20px] border border-[#f2f2f3] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
              Participants ({selectedParticipants.length} selected)
            </span>
            {splitType === 'equal' && parsedAmount > 0 && selectedParticipants.length > 0 && (
              <span className="text-xs font-semibold text-[#17191c]">
                ₹{(parsedAmount / selectedParticipants.length).toFixed(2)} per person
              </span>
            )}
          </div>

          <div className="divide-y divide-[#f2f2f3]">
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
                      className="w-4 h-4 rounded text-[#17191c] focus:ring-[#17191c]"
                    />
                    <MemberAvatar name={member.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-[#17191c]">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-[#777b86]">{member.email}</p>
                    </div>
                  </label>

                  {splitType === 'custom' && isSelected && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#777b86]">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={customVal}
                        onChange={(e) =>
                          handleCustomShareChange(member._id, e.target.value)
                        }
                        className="w-24 bg-white text-right text-sm rounded-[12px] border border-[#f2f2f3] py-1.5 px-2.5 focus:outline-none focus:border-[#17191c]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom sum validation banner */}
          {splitType === 'custom' && (
            <div className="pt-3 border-t border-[#f2f2f3] flex items-center justify-between text-xs">
              <span className="text-[#777b86]">
                Total Allocated: ₹{customSum.toFixed(2)} / ₹{parsedAmount.toFixed(2)}
              </span>
              <span
                className={`font-semibold ${
                  Math.abs(customDifference) <= 0.01
                    ? 'text-green-700'
                    : 'text-[#5d2a1a]'
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
          <label className="block text-xs font-semibold tracking-wider uppercase text-[#777b86] mb-2">
            Notes / Description (Optional)
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any extra notes or receipt items..."
            className="w-full bg-white text-[#17191c] placeholder-[#a3a6af] text-sm rounded-[16px] border border-[#f2f2f3] p-3.5 focus:outline-none focus:border-[#17191c]"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link to="/expenses">
            <SecondaryButton>Cancel</SecondaryButton>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            icon={Receipt}
          >
            Save Expense
          </Button>
        </div>
      </form>
    </div>
  );
}
