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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#f2f2f3] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-full hover:bg-[#f2f2f3] text-[#17191c]"
        >
          <Menu size={20} />
        </button>
        <span className="font-editorial text-xl font-semibold text-[#17191c]">
          SplitSimple
        </span>
        <div className="w-8" />
      </div>

      {/* Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Editorial Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-68 bg-white border-r border-[#f2f2f3] flex flex-col justify-between transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 flex items-center justify-between border-b border-[#f2f2f3]">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#17191c] text-white flex items-center justify-center font-bold text-xs tracking-tight">
                S
              </div>
              <span className="font-editorial text-xl font-semibold text-[#17191c]">
                SplitSimple
              </span>
            </NavLink>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#777b86] hover:text-[#17191c]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-[16px] text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#17191c] text-white shadow-xs'
                      : 'text-[#777b86] hover:bg-[#fafafb] hover:text-[#17191c]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} />
                    <span>{label}</span>
                  </div>
                  {active && <ChevronRight size={14} className="text-white/60" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Demo Controller & User Footer */}
        <div className="p-4 border-t border-[#f2f2f3] space-y-4">
          {/* Quick Demo Re-seed Helper */}
          <div className="bg-[#fafafb] rounded-[16px] border border-[#f2f2f3] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5d2a1a]" />
              <span className="text-xs font-semibold text-[#5d2a1a]">Demo Mode</span>
            </div>
            <button
              onClick={handleResetDemo}
              disabled={resettingDemo}
              title="Reset sample data"
              className="text-xs text-[#777b86] hover:text-[#17191c] flex items-center gap-1 transition"
            >
              <RotateCcw size={12} className={resettingDemo ? 'animate-spin' : ''} />
              <span>{resettingDemo ? 'Resetting…' : 'Reset'}</span>
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#f2f2f3] text-[#17191c] flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#17191c] truncate">
                  {user?.name || 'Chiranjeevi'}
                </p>
                <p className="text-[11px] text-[#777b86] truncate">
                  {user?.email || 'chiranjeevi@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-[#777b86] hover:text-red-600 rounded-full hover:bg-red-50 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Max 1200px centered) */}
      <main className="lg:ml-68 min-h-screen pt-16 lg:pt-0">
        <div className="max-w-[1200px] mx-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
