import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Loader2, Search, ArrowRight } from 'lucide-react';
import { groupService } from '../services';
import { getInitials } from '../utils/helpers';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await groupService.getAll();
        setGroups(res.data.groups || res.data || []);
      } catch (err) {
        console.error('Failed to load groups:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-500 mt-1">Manage your expense groups</p>
        </div>
        <Link
          to="/groups/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Link>
      </div>

      {/* Search */}
      {groups.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Groups Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((group) => {
            const members = group.members || [];
            const memberCount = group.memberCount || members.length || 0;
            return (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-indigo-50 p-2.5 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{group.name}</h3>
                {group.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  {/* Member Avatars */}
                  <div className="flex -space-x-2">
                    {members.slice(0, 4).map((member, i) => (
                      <div
                        key={member._id || i}
                        className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                        title={member.name || member.email}
                      >
                        <span className="text-xs font-medium text-indigo-700">
                          {getInitials(member.name || member.email || '?')}
                        </span>
                      </div>
                    ))}
                    {memberCount > 4 && (
                      <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">+{memberCount - 4}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {search ? 'No groups found' : 'No groups yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {search
              ? 'Try adjusting your search term'
              : 'Create your first group to start splitting expenses'}
          </p>
          {!search && (
            <Link
              to="/groups/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Group
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
