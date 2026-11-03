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
          className="text-xs font-semibold text-[#777b86] hover:text-[#17191c] flex items-center gap-1.5 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Groups</span>
        </Link>
        <h1 className="font-editorial text-4xl font-normal text-[#17191c]">
          Create New Group
        </h1>
        <p className="text-sm text-[#777b86] mt-1">
          Set up a shared expense space for your roommates or travel companions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[24px] border border-[#f2f2f3] p-8 shadow-[0_1px_3px_rgba(23,25,28,0.03)] space-y-6"
      >
        <Input
          label="Group Name"
          id="name"
          placeholder="e.g. Bangalore Roommates, Ladakh Expedition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label className="block text-xs font-semibold tracking-wider uppercase text-[#777b86] mb-2">
            Description (Optional)
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Flat 402 rent and utilities, food, and road trip costs..."
            className="w-full bg-white text-[#17191c] placeholder-[#a3a6af] text-sm rounded-[16px] border border-[#f2f2f3] p-3.5 focus:outline-none focus:border-[#17191c]"
          />
        </div>

        {/* Member Search & Invitation */}
        <div className="pt-4 border-t border-[#f2f2f3] space-y-4">
          <label className="block text-xs font-semibold tracking-wider uppercase text-[#777b86]">
            Invite Group Members (by Email)
          </label>

          <div className="relative">
            <Search className="w-4 h-4 text-[#777b86] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by registered email (e.g. gagan, pranav, chandan)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#fafafb] text-sm text-[#17191c] placeholder-[#a3a6af] rounded-[16px] border border-[#f2f2f3] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#17191c]"
            />
            {searching && (
              <Loader2 className="w-4 h-4 animate-spin text-[#777b86] absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-[16px] border border-[#f2f2f3] shadow-md divide-y divide-[#f2f2f3] max-h-48 overflow-y-auto">
              {searchResults.map((u) => (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => addMember(u)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-[#fafafb] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <MemberAvatar name={u.name} size="sm" />
                    <div>
                      <p className="text-xs font-semibold text-[#17191c]">{u.name}</p>
                      <p className="text-[11px] text-[#777b86]">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#17191c]">+ Add</span>
                </button>
              ))}
            </div>
          )}

          {/* Selected Member Chips */}
          {members.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {members.map((m) => (
                <span
                  key={m.email}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fafafb] border border-[#f2f2f3] text-xs font-medium text-[#17191c]"
                >
                  <MemberAvatar name={m.name} size="sm" />
                  <span>{m.name}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(m.email)}
                    className="text-[#777b86] hover:text-red-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#f2f2f3]">
          <Link to="/groups">
            <SecondaryButton>Cancel</SecondaryButton>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            icon={Users}
          >
            Create Group
          </Button>
        </div>
      </form>
    </div>
  );
}
