import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, X, Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService, authService } from '../services';
import { getInitials } from '../utils/helpers';

export default function CreateGroupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
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
      // Filter out already-added members
      const addedEmails = new Set(members.map((m) => m.email));
      setSearchResults(users.filter((u) => !addedEmails.has(u.email)));
    } catch (err) {
      console.error('Search failed:', err);
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
      const newGroupId = res.data?.data?.group?._id || res.data?.group?._id || res.data?._id;
      toast.success('Group created successfully!');
      navigate(`/groups/${newGroupId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-50 p-2.5 rounded-lg">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create Group</h1>
            <p className="text-sm text-gray-500">Set up a new expense group</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekend Trip, Roommates"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group for?"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Add Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Members</label>

            {/* Added members chips */}
            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {members.map((member) => (
                  <div
                    key={member.email}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-medium">
                      {getInitials(member.name || member.email)}
                    </span>
                    <span>{member.name || member.email}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.email)}
                      className="ml-0.5 hover:text-indigo-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                {searchResults.map((result) => (
                  <button
                    key={result.email}
                    type="button"
                    onClick={() => addMember(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-700">
                        {getInitials(result.name || result.email)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.name || result.email}</p>
                      {result.name && <p className="text-xs text-gray-500">{result.email}</p>}
                    </div>
                    <UserPlus className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
            )}

            {searchQuery.trim().length >= 2 && !searching && searchResults.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">No users found</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Create Group
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
