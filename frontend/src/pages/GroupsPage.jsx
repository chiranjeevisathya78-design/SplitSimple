import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Loader2,
  Search,
  ArrowRight,
  Receipt,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { groupService } from '../services';
import { MemberAvatar } from '../components/StatCard';
import { Button } from '../components/Button';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await groupService.getAll();
      const raw = res.data?.data?.groups || res.data?.groups || res.data?.data || [];
      setGroups(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#f2f2f3]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Shared Spaces
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c]">
            Groups
          </h1>
          <p className="text-sm text-[#777b86] mt-1 max-w-xl">
            Manage your roommates, travel groups, and projects.
          </p>
        </div>

        <Link to="/groups/new">
          <Button variant="primary" icon={Plus}>
            Create Group
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-[#777b86] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter groups by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-sm text-[#17191c] placeholder-[#a3a6af] rounded-full border border-[#f2f2f3] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#17191c]"
        />
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-[#17191c]" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((group) => {
            const memberCount = group.members?.length || 0;
            return (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="bg-white rounded-[24px] border border-[#f2f2f3] p-7 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#17191c] hover:shadow-[0_8px_30px_rgba(23,25,28,0.06)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
                      {group.name}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fafafb] border border-[#f2f2f3] text-[#777b86] font-medium shrink-0">
                      {memberCount} member{memberCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  <p className="text-xs text-[#777b86] line-clamp-2 leading-relaxed mb-6">
                    {group.description || 'Shared expense tracking group.'}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#f2f2f3] flex items-center justify-between">
                  {/* Member avatars preview */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {(group.members || []).slice(0, 4).map((m, i) => (
                      <MemberAvatar
                        key={m._id || i}
                        name={m.name || 'User'}
                        size="sm"
                        className="border-2 border-white"
                      />
                    ))}
                    {memberCount > 4 && (
                      <div className="w-7 h-7 rounded-full bg-[#f2f2f3] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#777b86]">
                        +{memberCount - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-[#17191c]">
                    <span>Open Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-12 text-center text-[#777b86]">
          <Users className="w-8 h-8 mx-auto mb-3 text-[#a3a6af]" />
          <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
            No groups found
          </h3>
          <p className="text-xs text-[#777b86] mt-1 max-w-sm mx-auto">
            Create a new group to start tracking shared expenses with roommates or friends.
          </p>
          <div className="mt-6">
            <Link to="/groups/new">
              <Button variant="primary">Create Your First Group</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
