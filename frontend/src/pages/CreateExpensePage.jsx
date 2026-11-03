import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Receipt,
  IndianRupee,
  Users,
  Tag,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { expenseService, groupService } from '../services';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/helpers';

export default function CreateExpensePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState('equal');

  // Participants for equal split
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  // Custom split shares
  const [customShares, setCustomShares] = useState({});

  useEffect(() => {
    groupService
      .getAll()
      .then((res) => {
        const raw = res.data?.data?.groups || res.data?.groups || [];
        setGroups(Array.isArray(raw) ? raw : []);
      })
      .catch(() => toast.error('Failed to load groups'))
      .finally(() => setLoadingGroups(false));
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      setMembers([]);
      setSelectedParticipants([]);
      setCustomShares({});
      setPaidBy('');
      return;
    }

    setLoadingMembers(true);
    groupService
      .getById(selectedGroup)
      .then((res) => {
        const group = res.data?.data?.group || res.data?.group || res.data?.data || {};
        const m = group.members || [];
        setMembers(m);
        // Select all members by default
        const allIds = m.map((member) => member.user?._id || member.user || member._id);
        setSelectedParticipants(allIds);
        // Default paidBy to current user if they are a member
        const currentUserMember = allIds.find((id) => id === user?._id);
        setPaidBy(currentUserMember || allIds[0] || '');
        // Init custom shares
        const shares = {};
        allIds.forEach((id) => (shares[id] = ''));
        setCustomShares(shares);
      })
      .catch(() => toast.error('Failed to load group members'))
      .finally(() => setLoadingMembers(false));
  }, [selectedGroup, user]);

  const getMemberName = (memberId) => {
    const m = members.find(
      (member) => (member.user?._id || member.user || member._id) === memberId
    );
    return m?.user?.name || m?.name || 'Unknown';
  };

  const toggleParticipant = (id) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const equalShareAmount =
    selectedParticipants.length > 0 && amount
      ? (parseFloat(amount) / selectedParticipants.length).toFixed(2)
      : '0.00';

  const customTotal = Object.entries(customShares)
    .filter(([id]) => selectedParticipants.includes(id))
    .reduce((sum, [, val]) => sum + (parseFloat(val) || 0), 0);

  const customDiff = amount ? parseFloat(amount) - customTotal : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error('Title is required');
    if (!amount || parseFloat(amount) <= 0) return toast.error('Enter a valid amount');
    if (!selectedGroup) return toast.error('Select a group');
    if (!paidBy) return toast.error('Select who paid');
    if (selectedParticipants.length === 0)
      return toast.error('Select at least one participant');

    if (splitType === 'custom' && Math.abs(customDiff) > 0.01) {
      return toast.error('Custom split amounts must equal the total');
    }

    setSubmitting(true);
    try {
      let participants;
      if (splitType === 'equal') {
        participants = selectedParticipants.map((id) => id);
      } else {
        participants = selectedParticipants.map((id) => ({
          user: id,
          share: parseFloat(customShares[id]) || 0,
        }));
      }

      await expenseService.create({
        groupId: selectedGroup,
        title: title.trim(),
        amount: parseFloat(amount),
        paidBy,
        participants,
        splitType,
        category,
        description: description.trim(),
        date,
      });

      toast.success('Expense created successfully!');
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
          <p className="text-gray-500 mt-0.5">Split an expense with your group</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Amount */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Receipt className="w-4 h-4 inline mr-1.5" />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dinner at restaurant"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <IndianRupee className="w-4 h-4 inline mr-1.5" />
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Tag className="w-4 h-4 inline mr-1.5" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Calendar className="w-4 h-4 inline mr-1.5" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FileText className="w-4 h-4 inline mr-1.5" />
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Group & Paid By */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Users className="w-4 h-4 inline mr-1.5" />
              Group
            </label>
            {loadingGroups ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading groups...
              </div>
            ) : (
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a group</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedGroup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Paid By
              </label>
              {loadingMembers ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading members...
                </div>
              ) : (
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select who paid</option>
                  {members.map((m) => {
                    const id = m.user?._id || m.user || m._id;
                    return (
                      <option key={id} value={id}>
                        {m.user?.name || m.name}
                        {id === user?._id ? ' (You)' : ''}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Split */}
        {selectedGroup && members.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Split Type
              </label>
              <div className="flex gap-3">
                <label
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                    splitType === 'equal'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="splitType"
                    value="equal"
                    checked={splitType === 'equal'}
                    onChange={() => setSplitType('equal')}
                    className="sr-only"
                  />
                  <Users className="w-4 h-4" />
                  Equal Split
                </label>
                <label
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                    splitType === 'custom'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="splitType"
                    value="custom"
                    checked={splitType === 'custom'}
                    onChange={() => setSplitType('custom')}
                    className="sr-only"
                  />
                  <IndianRupee className="w-4 h-4" />
                  Custom Split
                </label>
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants
              </label>
              <div className="space-y-2">
                {members.map((m) => {
                  const id = m.user?._id || m.user || m._id;
                  const name = m.user?.name || m.name;
                  const isSelected = selectedParticipants.includes(id);

                  return (
                    <div
                      key={id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-200 bg-indigo-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleParticipant(id)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {name}
                          {id === user?._id ? ' (You)' : ''}
                        </span>
                      </label>

                      {isSelected && splitType === 'equal' && amount && (
                        <span className="text-sm text-indigo-600 font-medium">
                          ₹{equalShareAmount}
                        </span>
                      )}

                      {isSelected && splitType === 'custom' && (
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                            ₹
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={customShares[id] || ''}
                            onChange={(e) =>
                              setCustomShares((prev) => ({
                                ...prev,
                                [id]: e.target.value,
                              }))
                            }
                            placeholder="0.00"
                            className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom split validation */}
            {splitType === 'custom' && amount && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  Math.abs(customDiff) <= 0.01
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {Math.abs(customDiff) <= 0.01 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>
                  Total: ₹{customTotal.toFixed(2)} / ₹{parseFloat(amount).toFixed(2)}
                  {Math.abs(customDiff) > 0.01 && (
                    <span className="ml-2 font-medium">
                      ({customDiff > 0 ? `₹${customDiff.toFixed(2)} remaining` : `₹${Math.abs(customDiff).toFixed(2)} over`})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Receipt className="w-4 h-4" />
              Create Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
}
