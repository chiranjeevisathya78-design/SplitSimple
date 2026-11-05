import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Loader2,
  Search,
  ArrowRight,
  Receipt,
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e5e7eb]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
            Shared Spaces
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] text-[#0c0a08] font-normal tracking-tight leading-tight">
            Groups
          </h1>
          <p className="text-sm text-[#6d6c6b] mt-1 max-w-xl font-normal">
            Manage your roommates, travel groups, and shared expense desks.
          </p>
        </div>

        <Link to="/groups/new">
          <Button variant="primary" icon={Plus}>
            Create Group
          </Button>
        </Link>
      </div>

      {/* Search Bar (10px Radius Input) */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-[#6d6c6b] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter groups by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-sm text-[#0c0a08] placeholder-[#6d6c6b]/60 rounded-[10px] border border-[#e5e7eb] pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#0c0a08] font-normal"
        />
      </div>

      {/* Groups Grid (16px Radius Content Cards, Hairline Borders) */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#0c0a08]" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((group) => {
            const memberCount = group.members?.length || 0;
            return (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 flex flex-col justify-between transition-colors hover:border-[#0c0a08]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-normal text-[#0c0a08] tracking-tight">
                      {group.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.018em] px-2 py-0.5 rounded-[6px] bg-[#f4f2f0] text-[#6d6c6b] border border-[#e5e7eb] font-normal shrink-0">
                      {memberCount} member{memberCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  {group.description && (
                    <p className="text-xs text-[#6d6c6b] line-clamp-2 mb-4 font-normal">
                      {group.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 my-4">
                    {group.members?.slice(0, 5).map((m) => (
                      <MemberAvatar
                        key={m.user?._id || m._id}
                        name={m.user?.name || m.name}
                        size="sm"
                      />
                    ))}
                    {memberCount > 5 && (
                      <span className="text-[10px] text-[#6d6c6b] pl-1 font-normal">
                        +{memberCount - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-between text-xs text-[#6d6c6b] font-normal">
                  <span>Open Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0c0a08]" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-[16px] border border-[#e5e7eb] p-8">
          <Users className="w-8 h-8 text-[#6d6c6b] mx-auto mb-3" />
          <h3 className="text-lg font-normal text-[#0c0a08]">
            No groups found
          </h3>
          <p className="text-xs text-[#6d6c6b] mt-1 mb-5">
            {search
              ? 'Try adjusting your search criteria.'
              : 'Create your first group to start splitting shared expenses.'}
          </p>
          <Link to="/groups/new">
            <Button variant="primary" icon={Plus}>
              Create New Group
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
