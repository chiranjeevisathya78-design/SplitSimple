import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Loader2,
  Search,
  ArrowRight,
  Folder,
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-3 border-black">
        <div>
          <span className="px-2.5 py-0.5 bg-[#ff529a] text-white border-2 border-black rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-[2px_2px_0px_#000]">
            SHARED SPACES
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-none">
            WORKSPACE GROUPS
          </h1>
          <p className="text-sm font-display text-neutral-700 mt-1 max-w-xl">
            Manage your flatmates, vacation tabs, and shared expense ledgers.
          </p>
        </div>

        <Link to="/groups/new">
          <Button variant="yellow" icon={Plus}>
            Create Group
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative font-mono">
        <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="FILTER GROUPS BY NAME..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/85 backdrop-blur-md text-xs sm:text-sm text-black placeholder-neutral-500 border-[2.5px] border-black rounded-[8px] pl-10 pr-4 py-2.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),3px_3px_0px_#000] focus:outline-none focus:shadow-[4px_4px_0px_#000] focus:bg-white uppercase font-bold transition-all"
        />
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 font-mono text-sm font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-black mr-2" />
          <span>LOADING GROUPS...</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((group, idx) => {
            const memberCount = group.members?.length || 0;
            const tapeColors = [
              'bg-gradient-to-r from-[#ccff00] to-[#b8f000]',
              'bg-gradient-to-r from-[#ff3377] to-[#e62266] text-white',
              'bg-gradient-to-r from-[#00f0ff] to-[#00d9e6]',
              'bg-gradient-to-r from-[#ffb703] to-[#ff9900]',
            ];
            const tapeColor = tapeColors[idx % tapeColors.length];

            return (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="glass-brutal-card-hover p-6 flex flex-col justify-between relative group"
              >
                {/* Accent Line */}
                <div className={`absolute top-0 left-6 right-6 h-[3px] rounded-b-[3px] ${tapeColor}`} />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-2 pt-1">
                    <h3 className="text-xl font-display font-black text-black uppercase tracking-tight group-hover:text-[#ff3377] transition-colors">
                      {group.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-black text-[#ccff00] font-mono text-[10px] font-bold uppercase rounded-[4px] border border-black shrink-0 shadow-[1px_1px_0px_#000]">
                      {memberCount} {memberCount === 1 ? 'MEMBER' : 'MEMBERS'}
                    </span>
                  </div>

                  {group.description && (
                    <p className="font-mono text-xs text-neutral-600 line-clamp-2 mb-4">
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
                      <span className="font-mono text-[11px] font-bold text-neutral-600 pl-1">
                        +{memberCount - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-black/15 flex items-center justify-between font-mono text-xs font-bold uppercase text-black">
                  <span>Open Ledger</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 glass-brutal-card p-8 space-y-4">
          <div className="w-16 h-16 rounded-[12px] bg-gradient-to-b from-[#ccff00] to-[#b8f000] border-3 border-black mx-auto flex items-center justify-center font-black text-2xl shadow-[4px_5px_0px_#000]">
            <Folder className="w-8 h-8 text-black" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-black text-black uppercase">
              No Groups Found
            </h3>
            <p className="font-mono text-xs text-neutral-600 max-w-sm mx-auto">
              {search
                ? 'Try adjusting your search criteria.'
                : 'Create your first group workspace or connect to the sample flatmate ledgers.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/groups/new">
              <Button variant="yellow" icon={Plus}>
                Create New Group
              </Button>
            </Link>
            <button
              type="button"
              onClick={async () => {
                try {
                  await groupService.joinDemo();
                  toast.success('★ Linked to Bangalore & Goa sample workspaces!', { icon: '⚡' });
                  fetchGroups();
                } catch {
                  toast.error('Failed to link sample workspaces');
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 text-black border-2 border-black rounded-[8px] font-mono text-xs font-bold uppercase shadow-[3px_4px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)] cursor-pointer transition-all"
            >
              <span>⚡ 1-Click Link Sample Groups</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
