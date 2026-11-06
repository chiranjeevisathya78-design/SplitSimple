import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Plus,
  X,
  Search,
  Loader2,
  Sparkles,
  Zap,
  Mail,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
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
  const [customEmail, setCustomEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [members, setMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [joiningDemo, setJoiningDemo] = useState(false);

  // Load registered users on mount for 1-click quick add
  useEffect(() => {
    authService
      .searchUsers('')
      .then((res) => {
        const users = res.data?.data?.users || res.data?.users || [];
        setSuggestedUsers(users);
      })
      .catch(() => setSuggestedUsers([]));
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await authService.searchUsers(query.trim());
      const users = res.data?.data?.users || res.data?.users || [];
      const addedEmails = new Set(members.map((m) => m.email.toLowerCase()));
      setSearchResults(
        users.filter((u) => !addedEmails.has((u.email || '').toLowerCase()))
      );
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addMember = (user) => {
    const cleanEmail = (user.email || '').trim().toLowerCase();
    if (!cleanEmail) return;
    if (members.some((m) => m.email.toLowerCase() === cleanEmail)) {
      toast('Member is already added to invitation list');
      return;
    }
    setMembers((prev) => [...prev, { ...user, email: cleanEmail }]);
    setSearchQuery('');
    setSearchResults([]);
    toast.success(`Added ${user.name} to invitation list!`, { icon: '✦' });
  };

  const handleAddCustomEmail = (e) => {
    if (e) e.preventDefault();
    const clean = customEmail.trim().toLowerCase();
    if (!clean) return;
    if (!clean.includes('@') || !clean.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (members.some((m) => m.email.toLowerCase() === clean)) {
      toast('Email already in list');
      return;
    }
    const derivedName = clean.split('@')[0];
    const formatted = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    setMembers((prev) => [...prev, { name: formatted, email: clean }]);
    setCustomEmail('');
    toast.success(`Invited ${clean}!`, { icon: '✉️' });
  };

  const removeMember = (email) => {
    setMembers((prev) =>
      prev.filter((m) => m.email.toLowerCase() !== email.toLowerCase())
    );
  };

  const handleJoinDemo = async () => {
    setJoiningDemo(true);
    try {
      await groupService.joinDemo();
      toast.success('Connected to Bangalore Roommates & Goa Trip workspaces!', {
        icon: '⚡',
      });
      navigate('/groups');
    } catch {
      toast.error('Failed to link demo workspaces');
    } finally {
      setJoiningDemo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Group workspace name is required');
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
      toast.success('★ Group Workspace created with zero balance drift!', {
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
      navigate(`/groups/${newGroupId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Header with Maximalist Stickers */}
      <div className="relative">
        <Link
          to="/groups"
          className="font-mono text-xs font-bold uppercase text-black hover:text-[#ff3377] inline-flex items-center gap-1.5 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Groups Ledger</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#d8ff26] to-[#b8f000] border-2 border-black font-mono text-[10px] font-black uppercase rounded-[4px] shadow-[2px_2px_0px_#000]">
            ⚡ WORKSPACE INITIALIZER
          </span>
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#ff3377] to-[#e62266] text-white border-2 border-black font-mono text-[10px] font-black uppercase rounded-[4px] shadow-[2px_2px_0px_#000]">
            ✦ 0.00% PAISE DRIFT
          </span>
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#00f0ff] to-[#00d9e6] text-black border-2 border-black font-mono text-[10px] font-black uppercase rounded-[4px] shadow-[2px_2px_0px_#000]">
            ★ INSTANT UPI
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
          CREATE GROUP DESK
        </h1>
        <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
          Set up a shared multi-peer expense ledger for your flatmates, vacation tabs, or weekend dinners.
        </p>

        {/* Quick Shortcut Banner to join existing demo groups */}
        <div className="mt-4 p-3 bg-gradient-to-r from-[#d8ff26]/30 via-[#33f5ff]/25 to-[#ff3377]/20 border-2 border-black rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-black">
            <Zap className="w-4 h-4 text-[#ff7700] shrink-0" />
            <span>Want to test with Bangalore & Goa Trip sample ledgers right now?</span>
          </div>
          <button
            type="button"
            onClick={handleJoinDemo}
            disabled={joiningDemo}
            className="px-3 py-1.5 bg-black text-[#ccff00] hover:bg-neutral-800 font-mono text-xs font-bold uppercase rounded-[6px] border border-black shadow-[2px_2px_0px_#000] shrink-0 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            {joiningDemo ? 'Connecting…' : '⚡ 1-Click Join Sample Ledgers'}
          </button>
        </div>
      </div>

      {/* 2. Maximalist Form Container */}
      <form
        onSubmit={handleSubmit}
        className="glass-brutal-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        {/* Specular glass reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[12px]" />

        <div className="relative z-10 space-y-5">
          <Input
            label="Group Workspace Name *"
            id="name"
            type="text"
            required
            placeholder="e.g. Indiranagar Apartment 402, Manali Roadtrip 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Workspace Purpose / Description (Optional)"
            id="description"
            type="text"
            placeholder="e.g. Monthly rent, wifi, maid, groceries, and weekend tabs"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Member Invitation Section */}
          <div className="pt-4 border-t-2 border-black/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-mono text-xs font-bold uppercase tracking-wider text-black">
                  Invite Group Participants
                </span>
                <span className="font-mono text-[11px] text-neutral-600">
                  Add friends by clicking suggestions or typing their email address
                </span>
              </div>
              <span className="px-2 py-0.5 bg-black text-[#ccff00] font-mono text-[10px] font-bold uppercase rounded-[4px] shadow-[1px_1px_0px_#000]">
                {members.length + 1} TOTAL MEMBERS (INCL. YOU)
              </span>
            </div>

            {/* Quick 1-Click Suggestions Pill Strip */}
            {suggestedUsers.length > 0 && (
              <div>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  ★ Quick-Add Registered Flatmates:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedUsers.map((u) => {
                    const isAdded = members.some(
                      (m) => m.email.toLowerCase() === u.email.toLowerCase()
                    );
                    return (
                      <button
                        key={u._id}
                        type="button"
                        onClick={() => addMember(u)}
                        disabled={isAdded}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border-2 border-black font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-neutral-200 text-neutral-500 opacity-60 cursor-default'
                            : 'bg-white hover:bg-[#d8ff26] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                        }`}
                      >
                        <UserPlus size={12} />
                        <span>{u.name}</span>
                        {isAdded && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Manual Email Adder / Search */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-8 relative font-mono">
                <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name or type custom email..."
                  value={searchQuery || customEmail}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCustomEmail(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomEmail();
                    }
                  }}
                  className="w-full bg-white/90 backdrop-blur-md text-xs sm:text-sm text-black placeholder-neutral-500 border-2 border-black rounded-[8px] pl-10 pr-4 py-2.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),2px_2px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#000] font-mono font-bold"
                />
                {searching && (
                  <Loader2 className="w-4 h-4 animate-spin text-black absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>

              <div className="sm:col-span-4">
                <button
                  type="button"
                  onClick={handleAddCustomEmail}
                  className="w-full h-full py-2.5 px-3 bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 text-black border-2 border-black rounded-[8px] font-mono text-xs font-bold uppercase shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus size={14} />
                  <span>Add To Group</span>
                </button>
              </div>
            </div>

            {/* Autocomplete Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-white/95 backdrop-blur-xl border-2 border-black rounded-[8px] shadow-[4px_5px_0px_#000] divide-y-2 divide-black/15 overflow-hidden">
                {searchResults.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => addMember(user)}
                    className="w-full text-left p-3 hover:bg-[#d8ff26]/80 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MemberAvatar name={user.name} size="sm" />
                      <div>
                        <p className="font-display font-bold text-sm text-black">{user.name}</p>
                        <p className="font-mono text-xs text-neutral-600">{user.email}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 bg-black text-[#ccff00] rounded-[4px] border border-black shadow-[1px_1px_0px_#000]">
                      + ADD TO DESK
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Added Members Pills */}
            <div className="p-4 bg-white/70 backdrop-blur-md border-2 border-black rounded-[10px] space-y-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),2px_2px_0px_#000]">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold uppercase text-black">
                  Active Participant Roster:
                </span>
                <span className="text-neutral-600 text-[10px]">
                  (You are automatically added as the group creator)
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {/* Current User Badge */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#d8ff26] to-[#b8f000] border-2 border-black rounded-[6px] px-3 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_#000]">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <span>YOU (CREATOR)</span>
                </div>

                {members.map((m) => (
                  <div
                    key={m.email}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#33f5ff] to-[#00d9e6] border-2 border-black rounded-[6px] pl-3 pr-2 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_#000]"
                  >
                    <span>{m.name || m.email}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(m.email)}
                      title="Remove participant"
                      className="p-1 hover:bg-black hover:text-white rounded text-black transition cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="pt-4 border-t-2 border-black/15 flex items-center justify-end gap-3">
            <Link to="/groups">
              <SecondaryButton>Cancel</SecondaryButton>
            </Link>
            <Button
              type="submit"
              variant="yellow"
              loading={submitting}
              icon={Plus}
            >
              Create Group Desk
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
