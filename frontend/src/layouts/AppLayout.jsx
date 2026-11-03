import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Scale,
  Handshake,
  BarChart3,
  LogOut,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { demoService } from '../services';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/balances', label: 'Balances', icon: Scale },
  { to: '/settlements', label: 'Smart Settlement', icon: Handshake },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resettingDemo, setResettingDemo] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all demo groups, expenses, and settlements to default sample state?')) {
      return;
    }
    setResettingDemo(true);
    try {
      await demoService.reset();
      toast.success('Demo environment reset to initial standard state!');
      window.location.reload();
    } catch {
      toast.error('Failed to reset demo data');
    } finally {
      setResettingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-[#17191c]">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#17191c] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-full hover:bg-white/10 text-white transition"
        >
          <Menu size={20} />
        </button>
        <span className="font-editorial text-xl font-semibold tracking-tight text-white">
          SplitSimple
        </span>
        <div className="w-8" />
      </div>

      {/* Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sophisticated Dark Charcoal Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-70 bg-[#17191c] text-white border-r border-[#26282d] flex flex-col justify-between transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center font-bold text-sm tracking-tight shadow-sm transition-transform group-hover:scale-105">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-xl font-semibold text-white tracking-tight">
                  SplitSimple
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-[#a3a6af]">
                  Financial SaaS
                </span>
              </div>
            </NavLink>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#a3a6af] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active =
                location.pathname === to ||
                (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-[16px] text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-[#fbe1d1] text-[#5d2a1a] font-semibold shadow-sm'
                      : 'text-[#979799] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={active ? 'text-[#5d2a1a]' : 'text-[#777b86]'} />
                    <span>{label}</span>
                  </div>
                  {active && <ChevronRight size={14} className="text-[#5d2a1a]" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Demo Controller & User Footer */}
        <div className="p-4 border-t border-white/10 space-y-3.5">
          {/* Quick Demo Re-seed Helper */}
          <div className="bg-[#202327] rounded-[16px] border border-white/10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fbe1d1] animate-pulse" />
              <span className="text-xs font-semibold text-[#fbe1d1]">Demo Mode</span>
            </div>
            <button
              onClick={handleResetDemo}
              disabled={resettingDemo}
              title="Reset sample data"
              className="text-[11px] text-[#a3a6af] hover:text-white flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RotateCcw size={12} className={resettingDemo ? 'animate-spin' : ''} />
              <span>{resettingDemo ? 'Resetting…' : 'Reset'}</span>
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="bg-[#202327] rounded-[16px] border border-white/10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Chiranjeevi S'}
                </p>
                <p className="text-[11px] text-[#979799] truncate">
                  {user?.email || 'chiranjeevi@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-[#979799] hover:text-white rounded-full hover:bg-white/10 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (offset by sidebar width, max 1200px centered) */}
      <main className="lg:ml-70 min-h-screen pt-16 lg:pt-0">
        <div className="max-w-[1200px] mx-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
