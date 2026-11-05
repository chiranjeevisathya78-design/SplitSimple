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
    <div className="min-h-screen bg-[#f4f2f0] text-[#0c0a08]">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#1a1919] text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-[6px] hover:bg-white/10 text-white transition"
        >
          <Menu size={20} />
        </button>
        <span className="text-lg tracking-tight text-white font-normal">
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

      {/* Ramp Obsidian Sidebar (#1a1919) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1a1919] text-white border-r border-white/10 flex flex-col justify-between transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-white/10">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              {/* Single neon highlighter mark */}
              <div className="w-6 h-6 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center font-normal text-xs tracking-tight">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-base text-white tracking-tight leading-none font-normal">
                  SplitSimple
                </span>
                <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mt-1 leading-none font-normal">
                  Editorial Desk
                </span>
              </div>
            </NavLink>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#6d6c6b] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active =
                location.pathname === to ||
                (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-[6px] text-sm font-normal transition-colors duration-150 ${
                    active
                      ? 'bg-[#e4f222] text-[#0c0a08]'
                      : 'text-[#6d6c6b] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? 'text-[#0c0a08]' : 'text-[#6d6c6b]'} />
                    <span>{label}</span>
                  </div>
                  {active && <ChevronRight size={14} className="text-[#0c0a08]" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Demo Controller & User Profile */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Demo Mode Strip */}
          <div className="bg-white/5 rounded-[6px] border border-white/10 p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]" />
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">Demo Desk</span>
            </div>
            <button
              onClick={handleResetDemo}
              disabled={resettingDemo}
              title="Reset sample data"
              className="text-[10px] uppercase tracking-[0.018em] text-[#e4f222] hover:underline flex items-center gap-1 transition disabled:opacity-50"
            >
              <RotateCcw size={10} className={resettingDemo ? 'animate-spin' : ''} />
              <span>{resettingDemo ? 'Resetting…' : 'Reset'}</span>
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="bg-white/5 rounded-[6px] border border-white/10 p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center text-xs font-normal shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white truncate font-normal leading-tight">
                  {user?.name || 'Chiranjeevi S'}
                </p>
                <p className="text-[10px] text-[#6d6c6b] truncate leading-tight mt-0.5">
                  {user?.email || 'chiranjeevi@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-[#6d6c6b] hover:text-white rounded-[6px] hover:bg-white/10 transition"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (1200px max width editorial canvas) */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="max-w-[1200px] mx-auto p-5 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
