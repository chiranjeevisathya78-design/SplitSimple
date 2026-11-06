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
  Zap,
  Sparkles,
  Plus,
  FolderPlus,
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
  const [joiningDemo, setJoiningDemo] = useState(false);

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
  const loadGroups = () => {
    setLoadingGroups(true);
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
  };

  useEffect(() => {
    loadGroups();
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

  const handleJoinDemo = async () => {
    setJoiningDemo(true);
    try {
      await groupService.joinDemo();
      toast.success('★ Linked to Bangalore & Goa sample workspaces!', { icon: '⚡' });
      loadGroups();
    } catch {
      toast.error('Failed to join sample workspaces');
    } finally {
      setJoiningDemo(false);
    }
  };

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

    if (!selectedGroup) {
      toast.error('Please create or select a group first');
      return;
    }
    if (!title.trim()) {
      toast.error('Expense title is required');
      return;
    }
    if (parsedAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
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
        paidBy: paidBy || user?._id,
        category,
        date,
        description: description.trim(),
        splitType,
        participants: payloadParticipants,
      });

      toast.success('★ Expense recorded with zero balance drift!', {
        icon: '⚡',
        style: {
          border: '2px solid black',
          borderRadius: '8px',
          boxShadow: '4px 4px 0px #000',
          background: 'linear-gradient(180deg, #d8ff26 0%, #b8f000 100%)',
          color: '#000',
          fontWeight: 'bold',
          fontFamily: 'Space Grotesk, sans-serif',
        },
      });
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Header with Maximalist Stickers */}
      <div>
        <Link
          to="/expenses"
          className="font-mono text-xs font-bold uppercase text-black hover:text-[#ff3377] inline-flex items-center gap-1.5 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Expense Ledger</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#d8ff26] to-[#b8f000] border-2 border-black font-mono text-[10px] font-black uppercase rounded-[4px] shadow-[2px_2px_0px_#000]">
            ⚡ NEW TRANSACTION
          </span>
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#00f0ff] to-[#00d9e6] border-2 border-black font-mono text-[10px] font-black uppercase rounded-[4px] shadow-[2px_2px_0px_#000]">
            ★ PAISE-PERFECT
          </span>
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#ff3377] to-[#e62266] text-white border-2 border-black font-mono text-[10px] font-black uppercase rounded-[4px] shadow-[2px_2px_0px_#000]">
            ✦ 0.00% LEAKAGE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
          RECORD SHARED EXPENSE
        </h1>
        <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
          Enter receipt total, select who paid, choose participants, and update net group balances.
        </p>
      </div>

      {/* Empty State Banner if user has 0 groups */}
      {!loadingGroups && groups.length === 0 ? (
        <div className="glass-brutal-card p-8 text-center space-y-4 bg-gradient-to-br from-amber-50/90 to-white/90">
          <div className="w-16 h-16 rounded-[12px] bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white border-3 border-black mx-auto flex items-center justify-center font-black text-2xl shadow-[4px_5px_0px_#000]">
            !
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-black text-black uppercase">
              No Group Workspace Found
            </h3>
            <p className="text-xs font-mono text-neutral-600 max-w-md mx-auto">
              You are logged in as a new account with no shared groups yet. To record shared expenses, either create a new group or link to the sample workspaces.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/groups/new">
              <Button variant="yellow" icon={Plus}>
                Create New Group Desk
              </Button>
            </Link>
            <button
              type="button"
              onClick={handleJoinDemo}
              disabled={joiningDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 text-black border-2 border-black rounded-[8px] font-mono text-xs font-bold uppercase shadow-[3px_4px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)] cursor-pointer transition-all"
            >
              <Zap size={14} />
              <span>{joiningDemo ? 'Linking…' : '⚡ 1-Click Link Sample Groups'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. Main Expense Form Card */
        <form
          onSubmit={handleSubmit}
          className="glass-brutal-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
        >
          {/* Top gloss specular line */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[12px]" />

          <div className="relative z-10 space-y-5">
            {/* Title and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Expense Title *"
                  id="title"
                  placeholder="e.g. Nature Basket Groceries, Beachfront Villa, Third Wave Coffee"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Amount (₹ INR) *
                </label>
                <div className="relative font-mono">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-black font-black text-sm">
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
                    className="w-full bg-white/85 backdrop-blur-md text-black placeholder-neutral-400 font-bold text-sm border-2 border-black rounded-[8px] py-2.5 pl-8 pr-3.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),2px_2px_0px_#000] focus:outline-none focus:shadow-[3px_3px_0px_#000] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Group Workspace and Paid By */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Group Workspace *"
                id="group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                options={groups.map((g) => ({
                  value: g._id,
                  label: `${g.name.toUpperCase()} (${g.members?.length || 0} MEMBERS)`,
                }))}
                required
              />

              <Select
                label="Paid By *"
                id="paidBy"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                options={groupMembers.map((m) => ({
                  value: m._id,
                  label: `${m.name.toUpperCase()} ${user && m._id === user._id ? '(YOU)' : ''}`,
                }))}
                required
              />
            </div>

            {/* If selected group has only 1 member, show warning */}
            {groupMembers.length === 1 && (
              <div className="p-3 bg-amber-100 border-2 border-black rounded-[8px] flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-900">
                  ⚠️ This group currently only has 1 member (you). Add flatmates to split!
                </span>
                <Link
                  to={`/groups/${selectedGroup}`}
                  className="font-bold text-black underline uppercase"
                >
                  + Add Members →
                </Link>
              </div>
            )}

            {/* Category and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Category *"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={Object.entries(CATEGORIES).map(([key, cat]) => ({
                  value: key,
                  label: cat.label.toUpperCase(),
                }))}
                required
              />

              <Input
                label="Billing Date *"
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Split Type Selector */}
            <div className="pt-4 border-t-2 border-black/15">
              <span className="block font-mono text-xs font-bold uppercase tracking-wider text-black mb-2">
                Splitting Algorithm
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSplitType('equal')}
                  className={`px-4 py-2 border-2 border-black rounded-[8px] font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    splitType === 'equal'
                      ? 'bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)] -translate-y-0.5'
                      : 'bg-white/70 backdrop-blur-md text-black hover:bg-white shadow-[1px_2px_0px_#000]'
                  }`}
                >
                  Equal Split (1/N)
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('custom')}
                  className={`px-4 py-2 border-2 border-black rounded-[8px] font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    splitType === 'custom'
                      ? 'bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.6)] -translate-y-0.5'
                      : 'bg-white/70 backdrop-blur-md text-black hover:bg-white shadow-[1px_2px_0px_#000]'
                  }`}
                >
                  Custom Exact Shares
                </button>
              </div>
            </div>

            {/* Participants Selection & Breakdown */}
            <div className="bg-white/60 backdrop-blur-md border-2 border-black rounded-[10px] p-5 space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),3px_3px_0px_#000]">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold uppercase text-black">
                  Participants ({selectedParticipants.length} of {groupMembers.length} selected)
                </span>
                {splitType === 'equal' && parsedAmount > 0 && selectedParticipants.length > 0 && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-[#d8ff26] to-[#b8f000] border-2 border-black font-mono font-black text-xs text-black rounded-[6px] shadow-[2px_2px_0px_#000]">
                    ₹{(parsedAmount / selectedParticipants.length).toFixed(2)} / PERSON
                  </span>
                )}
              </div>

              <div className="divide-y-2 divide-black/15 bg-white/85 border-2 border-black rounded-[8px] px-3 shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]">
                {groupMembers.map((member) => {
                  const isSelected = selectedParticipants.includes(member._id);
                  const customVal = customShares[member._id] || '';

                  return (
                    <div
                      key={member._id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleParticipant(member._id)}
                          className="w-4 h-4 rounded-[4px] border-2 border-black text-black focus:ring-0 cursor-pointer"
                        />
                        <MemberAvatar name={member.name} size="sm" />
                        <div>
                          <p className="font-display font-bold text-sm text-black">
                            {member.name} {user && member._id === user._id ? '(YOU)' : ''}
                          </p>
                          <p className="font-mono text-[10px] text-neutral-600">{member.email}</p>
                        </div>
                      </label>

                      {splitType === 'custom' && isSelected && (
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-xs">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={customVal}
                            onChange={(e) =>
                              handleCustomShareChange(member._id, e.target.value)
                            }
                            className="w-24 bg-white text-right font-mono font-bold text-xs rounded-[6px] border-2 border-black py-1 px-2 focus:outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Custom sum validation banner */}
              {splitType === 'custom' && (
                <div className="pt-2 flex items-center justify-between font-mono text-xs font-bold">
                  <span>
                    ALLOCATED: ₹{customSum.toFixed(2)} / ₹{parsedAmount.toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-0.5 border border-black rounded-[4px] shadow-[1px_1px_0px_#000] ${
                      Math.abs(customDifference) <= 0.01
                        ? 'bg-[#33f5ff] text-black'
                        : 'bg-[#ff3377] text-white'
                    }`}
                  >
                    {Math.abs(customDifference) <= 0.01
                      ? '✓ EXACT MATCH'
                      : `DIFF: ₹${customDifference.toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Description textarea */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                Notes / Itemized Breakdown (Optional)
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add receipt items, notes, or payment details..."
                className="w-full bg-white/85 backdrop-blur-md text-black placeholder-neutral-400 font-mono text-xs sm:text-sm rounded-[8px] border-2 border-black p-3 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),2px_2px_0px_#000] focus:outline-none focus:shadow-[3px_3px_0px_#000] focus:bg-white transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-black/15">
              <Link to="/expenses">
                <SecondaryButton>Cancel</SecondaryButton>
              </Link>
              <Button
                type="submit"
                variant="yellow"
                loading={submitting}
                icon={Receipt}
              >
                Record Expense
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
