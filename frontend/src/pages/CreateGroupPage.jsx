import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Plus, X, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService, authService } from '../services';
import { MemberAvatar } from '../components/StatCard';
import { Button, SecondaryButton } from '../components/Button';
import { Input } from '../components/Input';

export default function CreateGroupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [members, setMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await authService.searchUsers(query.trim());
      const users = res.data?.data?.users || res.data?.users || [];
      const addedEmails = new Set(members.map((m) => m.email));
      setSearchResults(users.filter((u) => !addedEmails.has(u.email)));
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addMember = (user) => {
    if (members.find((m) => m.email === user.email)) return;
    setMembers((prev) => [...prev, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMember = (email) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Group name is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await groupService.create({
        name: name.trim(),
        description: description.trim(),
        memberEmails: members.map((m) => m.email),
      });
      const newGroupId =
        res.data?.data?.group?._id || res.data?.group?._id || res.data?._id;
      toast.success('Group created successfully!');
      navigate(`/groups/${newGroupId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div>
        <Link
          to="/groups"
          className="text-xs text-[#6d6c6b] hover:text-[#0c0a08] flex items-center gap-1.5 mb-2 transition font-normal"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Groups</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-normal text-[#0c0a08] tracking-tight">
          Create New Group
        </h1>
        <p className="text-sm text-[#6d6c6b] mt-1 font-normal">
          Set up a shared expense space for your roommates or travel companions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 sm:p-8 space-y-6"
      >
        <Input
          label="Group Name"
          id="name"
          type="text"
          required
          placeholder="e.g. Indiranagar Apartment 402"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Description (Optional)"
          id="description"
          type="text"
          placeholder="e.g. Shared rent, utilities, and daily groceries"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Member Invitation Search */}
        <div className="space-y-3 pt-2">
          <label className="block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
            Invite Members by Email or Name
          </label>

          <div className="relative">
            <Search className="w-4 h-4 text-[#6d6c6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search registered members (e.g. gagan@example.com)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white text-sm text-[#0c0a08] placeholder-[#6d6c6b]/60 rounded-[10px] border border-[#e5e7eb] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#0c0a08] font-normal"
            />
            {searching && (
              <Loader2 className="w-4 h-4 animate-spin text-[#6d6c6b] absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-white border border-[#e5e7eb] rounded-[10px] divide-y divide-[#e5e7eb]">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => addMember(user)}
                  className="w-full text-left p-3 hover:bg-[#f4f2f0] flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MemberAvatar name={user.name} size="sm" />
                    <div>
                      <p className="text-sm font-normal text-[#0c0a08]">{user.name}</p>
                      <p className="text-xs text-[#6d6c6b]">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#0c0a08] font-normal">+ Add</span>
                </button>
              ))}
            </div>
          )}

          {/* Added Members Pills */}
          {members.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] block mb-2 font-normal">
                Members to invite ({members.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <div
                    key={m.email}
                    className="flex items-center gap-2 bg-[#f4f2f0] border border-[#e5e7eb] rounded-[6px] pl-2.5 pr-1.5 py-1 text-xs text-[#0c0a08]"
                  >
                    <span>{m.name}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(m.email)}
                      className="p-0.5 hover:bg-white rounded text-[#6d6c6b] hover:text-[#0c0a08]"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-end gap-3">
          <Link to="/groups">
            <SecondaryButton>Cancel</SecondaryButton>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            icon={Plus}
          >
            Create Group
          </Button>
        </div>
      </form>
    </div>
  );
}
