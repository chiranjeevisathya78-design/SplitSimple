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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { demoService } from '../services';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/balances', label: 'Balances', icon: Scale },
  { to: '/settlements', label: 'Settlement Engine', icon: Handshake },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resettingDemo, setResettingDemo] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all demo groups, expenses, and settlements to default state?')) {
      return;
    }
    setResettingDemo(true);
    try {
      await demoService.reset();
      toast.success('Demo environment reset to standard state!');
      window.location.reload();
    } catch {
      toast.error('Failed to reset demo data');
    } finally {
      setResettingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2f0] text-[#0c0a08] flex flex-col antialiased">
      {/* 
        TOP NAVIGATION BAR
        Explicit 64px height with perfect flex centering
      */}
      <header className="sticky top-0 z-50 bg-[#1a1919] text-white border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: Brand + Navigation */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center font-bold text-xs tracking-tight shadow-xs group-hover:scale-105 transition-transform">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="text-base text-white font-medium tracking-tight leading-none">
                    SplitSimple
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#6d6c6b] mt-0.5 leading-none font-normal">
                    Expense Desk
                  </span>
                </div>
              </NavLink>

              {/* Desktop Horizontal Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(({ to, label, icon: Icon }) => {
                  const active =
                    location.pathname === to ||
                    (to !== '/dashboard' && location.pathname.startsWith(to));
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
                        active
                          ? 'bg-[#e4f222] text-[#0c0a08] font-semibold shadow-xs'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={14} className={active ? 'text-[#0c0a08]' : 'text-white/60'} />
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Right: Demo Reset & Profile */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {/* Reset Demo Button */}
              <button
                onClick={handleResetDemo}
                disabled={resettingDemo}
                title="Reset sample data to initial state"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-white/5 border border-white/10 text-[11px] text-[#e4f222] hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={12} className={resettingDemo ? 'animate-spin' : ''} />
                <span>{resettingDemo ? 'Resetting…' : 'Reset Demo'}</span>
              </button>

              {/* User Avatar + Logout */}
              <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                <div className="w-7 h-7 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center text-xs font-semibold shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs text-white font-medium leading-tight truncate max-w-[110px]">
                    {user?.name || 'Chiranjeevi S'}
                  </span>
                  <span className="text-[10px] text-[#6d6c6b] leading-tight truncate max-w-[110px]">
                    {user?.email || 'chiranjeevi@example.com'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-[#6d6c6b] hover:text-white rounded-[6px] hover:bg-white/10 transition ml-0.5"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-[6px] transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a1919] border-t border-white/10 px-4 py-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active =
                location.pathname === to ||
                (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#e4f222] text-[#0c0a08] font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleResetDemo();
                }}
                disabled={resettingDemo}
                className="text-xs text-[#e4f222] flex items-center gap-1.5"
              >
                <RotateCcw size={12} className={resettingDemo ? 'animate-spin' : ''} />
                <span>Reset Demo State</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 flex items-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
