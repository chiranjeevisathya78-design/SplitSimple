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
    <div className="min-h-screen bg-[#faf7ee] text-black flex flex-col antialiased">
      {/* 
        SURREAL BRUTALIST RUNNING TICKER
        Black band with neon highlights, animated marquee
      */}
      <div className="bg-black text-white border-b-2 border-black py-1 overflow-hidden select-none">
        <div className="flex items-center gap-6 text-[11px] font-mono font-bold tracking-wider animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[#ccff00]">
            <Sparkles className="w-3.5 h-3.5" /> BRUTALIST FINANCIAL DESK
          </span>
          <span className="text-white/40">★</span>
          <span className="text-[#00f0ff]">INTEGER PAISE ACCURACY (0.00% DRIFT)</span>
          <span className="text-white/40">★</span>
          <span className="text-[#ff529a]">GREEDY MIN-FLOW SETTLEMENT: -75% HOPS</span>
          <span className="text-white/40">★</span>
          <span className="text-[#ff8800]">SURREAL EXPENSE LEDGER 2026</span>
          <span className="text-white/40">★</span>
          <span className="text-[#ccff00]">ROOMMATES & GROUP TABS SIMPLIFIED</span>
          <span className="text-white/40">★</span>
          <span className="text-[#00f0ff]">NO CIRCULAR DEBT LOOPS</span>
        </div>
      </div>

      {/* 
        NEO-BRUTALIST TOP NAVIGATION BAR 
        Creamy paper background, 3px solid black border, hard tactile tabs
      */}
      <header className="sticky top-0 z-50 bg-[#fffdf8] border-b-3 border-black shadow-[0_4px_0_#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: Brand Logo + Horizontal Nav Links */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-[4px] bg-[#ccff00] text-black border-2 border-black flex items-center justify-center font-display font-black text-base shadow-[2px_2px_0px_#000000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_#000000] transition-all">
                  S
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-display font-extrabold tracking-tight text-black leading-none">
                      SplitSimple
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#ff529a] text-white text-[9px] font-mono font-bold uppercase rounded-[2px] border border-black shadow-[1px_1px_0px_#000000]">
                      DESK
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-600 mt-0.5 leading-none">
                    Neo-Brutalist Ledger
                  </span>
                </div>
              </NavLink>

              {/* Desktop Horizontal Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1.5">
                {navItems.map(({ to, label, icon: Icon }) => {
                  const active =
                    location.pathname === to ||
                    (to !== '/dashboard' && location.pathname.startsWith(to));
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono font-bold uppercase tracking-wide border-2 transition-all ${
                        active
                          ? 'bg-[#ccff00] text-black border-black shadow-[2px_2px_0px_#000000] translate-x-0'
                          : 'border-transparent text-neutral-800 hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_#000000]'
                      }`}
                    >
                      <Icon size={14} className={active ? 'text-black' : 'text-neutral-600'} />
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Right: Demo Reset & Profile Controls */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {/* Reset Demo State Button */}
              <button
                onClick={handleResetDemo}
                disabled={resettingDemo}
                title="Reset sample data to initial state"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff] hover:bg-[#00d9e6] active:translate-x-0.5 active:translate-y-0.5 text-black border-2 border-black rounded-[4px] font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] transition-all disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw size={12} className={resettingDemo ? 'animate-spin' : ''} />
                <span>{resettingDemo ? 'Resetting…' : 'Reset Demo'}</span>
              </button>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-3 border-l-2 border-black">
                <div className="w-8 h-8 rounded-[4px] bg-[#ff8800] text-black border-2 border-black flex items-center justify-center text-xs font-display font-black shadow-[2px_2px_0px_#000000] shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-display font-bold text-black leading-tight truncate max-w-[110px]">
                    {user?.name || 'Chiranjeevi S'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-600 leading-tight truncate max-w-[110px]">
                    {user?.email || 'chiranjeevi@example.com'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 bg-white text-black hover:bg-[#ff3b30] hover:text-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] transition-all cursor-pointer ml-1"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-[#ccff00] text-black border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#fffdf8] border-t-2 border-black px-4 py-4 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active =
                location.pathname === to ||
                (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-[4px] border-2 font-mono text-xs font-bold uppercase transition-all ${
                    active
                      ? 'bg-[#ccff00] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'border-transparent text-black hover:border-black hover:bg-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 border-t-2 border-black flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleResetDemo();
                }}
                disabled={resettingDemo}
                className="text-xs font-mono font-bold uppercase px-3 py-1.5 bg-[#00f0ff] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000000] flex items-center gap-1.5"
              >
                <RotateCcw size={12} className={resettingDemo ? 'animate-spin' : ''} />
                <span>Reset Demo State</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-mono font-bold uppercase px-3 py-1.5 bg-[#ff3b30] text-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000000] flex items-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 
        MAIN CONTENT CONTAINER
        Clean max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
      */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
