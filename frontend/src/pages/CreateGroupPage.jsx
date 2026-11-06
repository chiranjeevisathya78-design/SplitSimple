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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div>
        <Link
          to="/groups"
          className="font-mono text-xs font-bold uppercase text-black hover:text-[#ff529a] flex items-center gap-1.5 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Groups</span>
        </Link>
        <span className="px-2 py-0.5 bg-[#ccff00] border-2 border-black font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#000] inline-block mb-1">
          NEW WORKSPACE
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-black tracking-tight uppercase leading-none">
          Create New Group
        </h1>
        <p className="text-sm font-display text-neutral-700 mt-1">
          Set up a shared expense space for your flatmates or travel companions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-3 border-black rounded-[4px] p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#000000]"
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
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black">
            Invite Members by Email or Name
          </label>

          <div className="relative font-mono">
            <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search registered members (e.g. gagan@example.com)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white text-xs sm:text-sm text-black placeholder-neutral-400 border-2 border-black rounded-[4px] pl-10 pr-4 py-2.5 shadow-[2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#000] focus:bg-[#fffef7] font-mono"
            />
            {searching && (
              <Loader2 className="w-4 h-4 animate-spin text-black absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-white border-2 border-black rounded-[4px] shadow-[4px_4px_0px_#000] divide-y-2 divide-black">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => addMember(user)}
                  className="w-full text-left p-3 hover:bg-[#ccff00] flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MemberAvatar name={user.name} size="sm" />
                    <div>
                      <p className="font-display font-bold text-sm text-black">{user.name}</p>
                      <p className="font-mono text-xs text-neutral-600">{user.email}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 bg-black text-white rounded-[2px]">
                    + ADD
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Added Members Pills */}
          {members.length > 0 && (
            <div className="pt-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-600 block mb-2">
                Members to invite ({members.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <div
                    key={m.email}
                    className="flex items-center gap-2 bg-[#ccff00] border-2 border-black rounded-[3px] pl-2.5 pr-1.5 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_#000]"
                  >
                    <span>{m.name}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(m.email)}
                      className="p-0.5 hover:bg-black hover:text-white rounded text-black cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t-2 border-black flex items-center justify-end gap-3">
          <Link to="/groups">
            <SecondaryButton>Cancel</SecondaryButton>
          </Link>
          <Button
            type="submit"
            variant="yellow"
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
