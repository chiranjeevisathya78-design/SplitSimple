import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Receipt,
  Scale,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Users,
  PieChart,
  ArrowUpRight,
  Wallet,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Handshake,
  TrendingDown,
  Repeat,
  DollarSign,
  Smartphone,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

// Sample preview groups for the interactive showcase
const PREVIEW_DATA = {
  bangalore: {
    id: 'bangalore',
    name: 'Bangalore Roommates',
    badge: 'Indiranagar 3BHK',
    desc: 'Monthly rent, cook, utilities, and daily provisions',
    members: [
      { name: 'Chiranjeevi S', role: 'Primary Payer', paid: 4000000 },
      { name: 'Gagan K', role: 'Groceries', paid: 480000 },
      { name: 'Pranav M', role: 'Electricity', paid: 220000 },
      { name: 'Chandan R', role: 'Fiber Net', paid: 141500 },
    ],
    totalSpent: 4841500,
    expenses: [
      { title: 'Monthly House Rent', amount: 4000000, paidBy: 'Chiranjeevi S', category: 'Rent', date: 'Nov 1' },
      { title: 'Nature Basket Groceries', amount: 480000, paidBy: 'Gagan K', category: 'Groceries', date: 'Nov 2' },
      { title: 'BESCOM Electricity Bill', amount: 220000, paidBy: 'Pranav M', category: 'Utilities', date: 'Nov 3' },
      { title: 'Airtel Xstream Fiber', amount: 141500, paidBy: 'Chandan R', category: 'Utilities', date: 'Nov 4' },
    ],
    settlementPlan: [
      { from: 'Chandan R', to: 'Chiranjeevi S', amount: 1068875 },
      { from: 'Pranav M', to: 'Chiranjeevi S', amount: 990375 },
      { from: 'Gagan K', to: 'Chiranjeevi S', amount: 730375 },
    ],
    iouCount: 6,
    optimizedCount: 3,
    reductionPercent: '50%',
  },
  goa: {
    id: 'goa',
    name: 'Goa Trip 2026',
    badge: 'Vacation Tab',
    desc: 'Beach villa, scooter rentals, dining, and scuba expeditions',
    members: [
      { name: 'Chiranjeevi S', role: 'Dining', paid: 980000 },
      { name: 'Gagan K', role: 'Villa Booking', paid: 4500000 },
      { name: 'Pranav M', role: 'Beverages', paid: 450000 },
      { name: 'Chandan R', role: 'Scooters', paid: 750000 },
      { name: 'Rahul V', role: 'Scuba Diving', paid: 1500000 },
    ],
    totalSpent: 8180000,
    expenses: [
      { title: 'Beachfront Villa (3 Nights)', amount: 4500000, paidBy: 'Gagan K', category: 'Stay', date: 'Oct 28' },
      { title: 'Activa Rentals (5 Scooters)', amount: 750000, paidBy: 'Chandan R', category: 'Transport', date: 'Oct 29' },
      { title: 'Scuba Diving Expeditions', amount: 1500000, paidBy: 'Rahul V', category: 'Activity', date: 'Oct 30' },
      { title: 'Fisherman’s Wharf Feast', amount: 980000, paidBy: 'Chiranjeevi S', category: 'Dining', date: 'Oct 31' },
    ],
    settlementPlan: [
      { from: 'Pranav M', to: 'Gagan K', amount: 1186000 },
      { from: 'Chandan R', to: 'Gagan K', amount: 886000 },
      { from: 'Chiranjeevi S', to: 'Gagan K', amount: 656000 },
      { from: 'Rahul V', to: 'Gagan K', amount: 136000 },
    ],
    iouCount: 10,
    optimizedCount: 4,
    reductionPercent: '60%',
  },
  college: {
    id: 'college',
    name: 'College Friends',
    badge: 'Weekend Group',
    desc: 'IMAX movies, burgers, turf football, and cafe catchups',
    members: [
      { name: 'Chiranjeevi S', role: 'Third Wave', paid: 180000 },
      { name: 'Pranav M', role: 'IMAX Tickets', paid: 280000 },
      { name: 'Chandan R', role: 'Truffles Burgers', paid: 360000 },
      { name: 'Rahul V', role: 'Turf Football', paid: 240000 },
    ],
    totalSpent: 1060000,
    expenses: [
      { title: 'Dune IMAX 3D Recliner', amount: 280000, paidBy: 'Pranav M', category: 'Entertainment', date: 'Nov 2' },
      { title: 'Truffles Burgers & Shakes', amount: 360000, paidBy: 'Chandan R', category: 'Food', date: 'Nov 3' },
      { title: 'Play Arena Night Turf', amount: 240000, paidBy: 'Rahul V', category: 'Sports', date: 'Nov 3' },
      { title: 'Third Wave Coffee Catchup', amount: 180000, paidBy: 'Chiranjeevi S', category: 'Cafe', date: 'Nov 4' },
    ],
    settlementPlan: [
      { from: 'Chiranjeevi S', to: 'Chandan R', amount: 85000 },
      { from: 'Rahul V', to: 'Chandan R', amount: 10000 },
      { from: 'Rahul V', to: 'Pranav M', amount: 15000 },
    ],
    iouCount: 6,
    optimizedCount: 3,
    reductionPercent: '50%',
  },
};

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('bangalore');
  const [settledRows, setSettledRows] = useState({});
  const [activeFaq, setActiveFaq] = useState(null);

  // 1-Click Demo Explorer
  const handleExploreDemo = async () => {
    setLoadingDemo(true);
    try {
      await login('chiranjeevi@example.com', 'password123');
      toast.success('Signed in to SplitSimple Demo Workspace');
      navigate('/dashboard');
    } catch {
      toast.error('Directing to login desk...');
      navigate('/login');
    } finally {
      setLoadingDemo(false);
    }
  };

  const preview = PREVIEW_DATA[activeTab];

  const handleToggleSettle = (idx) => {
    setSettledRows((prev) => {
      const current = prev[`${activeTab}-${idx}`];
      if (!current) {
        toast.success('Repayment marked as settled via UPI', {
          icon: '⚡',
          style: {
            borderRadius: '6px',
            background: '#0c0a08',
            color: '#fff',
            fontSize: '12px',
          },
        });
      }
      return {
        ...prev,
        [`${activeTab}-${idx}`]: !current,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f2f0] text-[#0c0a08] overflow-x-hidden selection:bg-[#e4f222] selection:text-[#0c0a08]">
      {/* 1. Top Announcement Bar */}
      <div className="h-9 bg-[#0c0a08] text-white px-4 flex items-center justify-between text-xs font-normal">
        <div className="max-w-[1240px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e4f222] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e4f222]" />
            </span>
            <span className="text-[11px] sm:text-xs text-white/90">
              Greedy Settlement Algorithm eliminates up to 75% of circular group transfers
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <a
              href="#algorithm"
              className="text-[#e4f222] hover:underline hidden sm:inline text-xs transition-colors"
            >
              See how it works →
            </a>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/50 hidden md:inline">
            Paise-Precision Ledger v2.4
          </span>
        </div>
      </div>

      {/* 2. Sticky Glass Header */}
      <header className="sticky top-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e5e7eb] transition-all">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center font-semibold text-sm shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-[#0c0a08] leading-none">
                SplitSimple
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#6d6c6b] mt-0.5">
                Expense Desk
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#6d6c6b]">
            <a href="#simulator" className="hover:text-[#0c0a08] transition-colors">
              Interactive Demo
            </a>
            <a href="#algorithm" className="hover:text-[#0c0a08] transition-colors">
              Debt Engine
            </a>
            <a href="#features" className="hover:text-[#0c0a08] transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-[#0c0a08] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-[#0c0a08] rounded-[6px] hover:bg-[#f4f2f0] transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={handleExploreDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#e4f222] text-[#0c0a08] rounded-[6px] hover:bg-[#d6e41b] active:scale-[0.98] transition-all shadow-sm"
            >
              {loadingDemo ? (
                <>Connecting...</>
              ) : (
                <>
                  Explore Demo <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-[6px] text-[#0c0a08] hover:bg-[#f4f2f0]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-[#e5e7eb] px-6 py-4 space-y-3"
            >
              <a
                href="#simulator"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[#6d6c6b] hover:text-[#0c0a08]"
              >
                Interactive Demo
              </a>
              <a
                href="#algorithm"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[#6d6c6b] hover:text-[#0c0a08]"
              >
                Debt Engine
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-[#6d6c6b] hover:text-[#0c0a08]"
              >
                Features
              </a>
              <div className="pt-3 border-t border-[#e5e7eb] flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleExploreDemo();
                  }}
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#e4f222] text-[#0c0a08] rounded-[6px] text-center"
                >
                  Explore Demo Workspace
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-xs font-medium text-center text-[#0c0a08] border border-[#e5e7eb] rounded-[6px] hover:bg-[#f4f2f0]"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. Hero Section (Centered, Commanding, High-Impact) */}
      <section className="relative pt-16 pb-16 sm:pt-24 sm:pb-24 px-6 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#0c0a08 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-[960px] mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-white border border-[#e5e7eb] text-xs text-[#0c0a08] shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#e4f222]" />
            <span className="text-[11px] uppercase tracking-wider font-medium text-[#6d6c6b]">
              Editorial Group Expense Desk
            </span>
            <span className="text-xs text-[#e5e7eb]">|</span>
            <span className="text-[11px] font-medium text-[#0c0a08] flex items-center gap-1">
              Zero paise rounding error <Sparkles className="w-3 h-3 text-[#0c0a08]" />
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-[70px] font-medium tracking-tight text-[#0c0a08] leading-[1.08]"
          >
            Shared expenses. <br />
            <span className="relative inline-block mt-1">
              <span className="relative z-10">Zero awkward math.</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 sm:h-4 bg-[#e4f222] -z-0 rounded-sm" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-[#6d6c6b] max-w-2xl mx-auto leading-relaxed"
          >
            Track roommates, travel tabs, and group dinners with integer precision.
            Our greedy settlement engine calculates global net balances and collapses
            circular debt into minimal single-hop payments.
          </motion.p>

          {/* Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <button
              onClick={handleExploreDemo}
              disabled={loadingDemo}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#e4f222] hover:bg-[#d9e81b] active:scale-[0.98] text-[#0c0a08] font-semibold text-sm uppercase tracking-wider rounded-[6px] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loadingDemo ? (
                <>Opening Workspace...</>
              ) : (
                <>
                  Explore Live Demo Workspace <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-6 py-3.5 bg-white hover:bg-[#f9f8f6] text-[#0c0a08] border border-[#e5e7eb] font-medium text-sm rounded-[6px] transition-all flex items-center justify-center gap-2 shadow-sm">
                Create Free Account
              </button>
            </Link>
          </motion.div>

          {/* Trust points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#6d6c6b]"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0c0a08]" /> Preloaded with 3 demo groups
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0c0a08]" /> 22 realistic expenses
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0c0a08]" /> Instant UPI mark & settle
            </span>
          </motion.div>
        </div>

        {/* 4. Interactive Live Simulator Mockup */}
        <motion.div
          id="simulator"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-[1200px] mx-auto mt-14"
        >
          {/* Main Card with Subtle Hairline Border */}
          <div className="bg-white rounded-[16px] border border-[#e5e7eb] shadow-sm overflow-hidden">
            {/* Top Chrome Header */}
            <div className="bg-[#ffffff] border-b border-[#e5e7eb] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                <span className="text-[11px] font-mono text-[#6d6c6b] ml-2">
                  splitsimple.app/workspace/{activeTab}
                </span>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-[#f4f2f0] p-1 rounded-[6px]">
                {Object.values(PREVIEW_DATA).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 py-1.5 text-xs rounded-[5px] transition-all font-medium ${
                      activeTab === tab.id
                        ? 'bg-white text-[#0c0a08] shadow-xs'
                        : 'text-[#6d6c6b] hover:text-[#0c0a08]'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Workspace Body */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  {/* Left Column: Group Expenses Ledger (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-medium text-[#0c0a08] tracking-tight">
                          {preview.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-[4px] bg-[#e4f222] text-[#0c0a08] text-[10px] font-semibold uppercase tracking-wider">
                          Active Ledger
                        </span>
                      </div>
                      <p className="text-xs text-[#6d6c6b] mt-1">{preview.desc}</p>
                    </div>

                    {/* Member chips */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#6d6c6b] block mb-2 font-medium">
                        Active Members ({preview.members.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {preview.members.map((m) => (
                          <div
                            key={m.name}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#f4f2f0] border border-[#e5e7eb] text-xs text-[#0c0a08]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0c0a08]" />
                            <span className="font-medium">{m.name}</span>
                            <span className="text-[10px] text-[#6d6c6b]">({m.role})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Expense Entries */}
                    <div className="border border-[#e5e7eb] rounded-[10px] overflow-hidden bg-white">
                      <div className="bg-[#fafaf9] px-4 py-2 border-b border-[#e5e7eb] flex items-center justify-between text-[11px] text-[#6d6c6b] font-medium">
                        <span>Recent Group Transactions</span>
                        <span>Total: {formatCurrency(preview.totalSpent)}</span>
                      </div>
                      <div className="divide-y divide-[#e5e7eb]">
                        {preview.expenses.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 hover:bg-[#fafaf9] transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-[6px] bg-[#f4f2f0] text-[#0c0a08] flex items-center justify-center">
                                <Receipt className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-[#0c0a08]">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-[#6d6c6b]">
                                  Paid by <strong className="font-medium text-[#0c0a08]">{item.paidBy}</strong> · {item.category} · {item.date}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-[#0c0a08]">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Greedy Settlement Engine (5 cols) */}
                  <div className="lg:col-span-5 bg-[#1a1919] text-white rounded-[14px] p-6 flex flex-col justify-between border border-white/10 shadow-lg">
                    <div>
                      {/* Box Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#e4f222] font-semibold">
                            Greedy Debt Engine
                          </span>
                          <h3 className="text-lg font-medium text-white tracking-tight">
                            Optimized Repayments
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 rounded-[4px] bg-[#e4f222] text-[#0c0a08] text-[10px] font-bold uppercase tracking-wider">
                            -{preview.reductionPercent} Transfers
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs text-white/70 mt-3 mb-5 leading-relaxed">
                        Instead of <strong className="text-white font-medium">{preview.iouCount} messy peer-to-peer IOUs</strong>, 
                        the greedy algorithm finds maximum debtors and creditors to settle all balances in just{' '}
                        <strong className="text-[#e4f222] font-medium">{preview.optimizedCount} direct transfers</strong>.
                      </p>

                      {/* Repayment Action List */}
                      <div className="space-y-2.5">
                        {preview.settlementPlan.map((step, idx) => {
                          const isSettled = settledRows[`${activeTab}-${idx}`];
                          return (
                            <motion.div
                              key={idx}
                              layout
                              className={`p-3.5 rounded-[8px] border transition-all ${
                                isSettled
                                  ? 'bg-white/5 border-emerald-500/40 opacity-75'
                                  : 'bg-white/10 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-medium text-white">{step.from}</span>
                                  <span className="text-[#e4f222] font-bold">→ pays →</span>
                                  <span className="font-medium text-white">{step.to}</span>
                                </div>
                                <span className="font-semibold text-[#e4f222] text-sm ml-2">
                                  {formatCurrency(step.amount)}
                                </span>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                                <span className="text-[10px] text-white/50">
                                  {isSettled ? '✓ Confirmed on UPI' : 'Pending repayment'}
                                </span>
                                <button
                                  onClick={() => handleToggleSettle(idx)}
                                  className={`text-[11px] px-2.5 py-1 rounded-[4px] transition-colors font-medium flex items-center gap-1 ${
                                    isSettled
                                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                      : 'bg-white/15 hover:bg-white/25 text-white'
                                  }`}
                                >
                                  {isSettled ? (
                                    <>
                                      <Check className="w-3 h-3" /> Settled
                                    </>
                                  ) : (
                                    <>
                                      Mark Settled <ArrowRight className="w-3 h-3" />
                                    </>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom CTA in Preview */}
                    <div className="pt-6 mt-6 border-t border-white/10">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="text-white/60">Net Group Volume:</span>
                        <span className="text-base font-semibold text-white">
                          {formatCurrency(preview.totalSpent)}
                        </span>
                      </div>
                      <button
                        onClick={handleExploreDemo}
                        disabled={loadingDemo}
                        className="w-full py-2.5 bg-[#e4f222] hover:bg-[#d9e81b] text-[#0c0a08] font-semibold text-xs uppercase tracking-wider rounded-[6px] transition-all flex items-center justify-center gap-1.5"
                      >
                        Launch Interactive Workspace <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. Live Stats Strip (#1a1919 Obsidian Band) */}
      <section className="bg-[#1a1919] text-white py-14 px-6 border-y border-white/10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] uppercase tracking-wider text-[#6d6c6b] mb-1 font-medium">
              Transactions Settled
            </p>
            <p className="text-3xl sm:text-4xl font-semibold text-white">
              ₹1.53 Lakh+
            </p>
            <p className="text-xs text-white/50 mt-1">Across demo and active flats</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-[10px] uppercase tracking-wider text-[#6d6c6b] mb-1 font-medium">
              Debt Step Reduction
            </p>
            <p className="text-3xl sm:text-4xl font-semibold text-[#e4f222]">
              -75% Transfers
            </p>
            <p className="text-xs text-white/50 mt-1">No circular payment loops</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-[10px] uppercase tracking-wider text-[#6d6c6b] mb-1 font-medium">
              Accounting Precision
            </p>
            <p className="text-3xl sm:text-4xl font-semibold text-white">
              0.00% Drift
            </p>
            <p className="text-xs text-white/50 mt-1">Strict integer paise ledger</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-[10px] uppercase tracking-wider text-[#6d6c6b] mb-1 font-medium">
              Settlement Speed
            </p>
            <p className="text-3xl sm:text-4xl font-semibold text-white">
              Instant UPI
            </p>
            <p className="text-xs text-white/50 mt-1">1-click ledger clearance</p>
          </motion.div>
        </div>
      </section>

      {/* 6. Settlement Algorithm Deep-Dive */}
      <section id="algorithm" className="py-20 md:py-28 px-6 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#f4f2f0] border border-[#e5e7eb] text-[11px] uppercase tracking-wider text-[#0c0a08] font-medium">
                <Scale className="w-3.5 h-3.5 text-[#0c0a08]" /> The Greedy Debt Engine
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#0c0a08] tracking-tight leading-[1.15]">
                How we turn 10 tangled IOUs <br />
                into 2 direct transfers.
              </h2>

              <p className="text-sm sm:text-base text-[#6d6c6b] leading-relaxed">
                When 5 friends travel or share an apartment, everyone pays for different bills.
                Normal apps force person A to pay person B, who then pays person C.
                SplitSimple calculates each participant's global net balance (Total Paid − Total Owed)
                and repeatedly matches the largest net debtor with the largest net creditor.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0c0a08]">
                      Global Net Balance Calculation
                    </h4>
                    <p className="text-xs text-[#6d6c6b] mt-0.5">
                      Sum all transactions in integer paise. Net creditors have positive balances, net debtors have negative balances.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0c0a08]">
                      Greedy Flow Minimization
                    </h4>
                    <p className="text-xs text-[#6d6c6b] mt-0.5">
                      Transfer min(|max_debtor|, max_creditor) in a single direct step until all balances equal zero. Guaranteed at most N - 1 transactions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0c0a08]">
                      Zero Rounding Drift Guarantee
                    </h4>
                    <p className="text-xs text-[#6d6c6b] mt-0.5">
                      No floating point Javascript IEEE-754 bugs. 100 paise = 1 INR strictly tracked throughout the database.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Comparison Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 bg-[#f4f2f0] rounded-[16px] border border-[#e5e7eb] p-6 sm:p-8"
            >
              <h3 className="text-base font-semibold text-[#0c0a08] mb-4">
                Real-World Debt Comparison
              </h3>

              {/* Before: Chaotic */}
              <div className="bg-white rounded-[10px] border border-[#e5e7eb] p-4 mb-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5" /> Without SplitSimple (6 Circular IOUs)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 rounded font-medium">
                    High Friction
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#6d6c6b]">
                  <p className="flex justify-between">
                    <span>• Chandan owes Pranav</span> <span>₹2,400.00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>• Pranav owes Chiranjeevi</span> <span>₹5,800.00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>• Gagan owes Chandan</span> <span>₹1,200.00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>• Rahul owes Gagan</span> <span>₹3,500.00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>• Chandan owes Chiranjeevi</span> <span>₹4,100.00</span>
                  </p>
                </div>
              </div>

              {/* After: Clean */}
              <div className="bg-[#1a1919] text-white rounded-[10px] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#e4f222] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> With SplitSimple Greedy Engine
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#e4f222] text-[#0c0a08] rounded font-bold uppercase">
                    2 Direct Payments
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-white/10 rounded-[6px] flex items-center justify-between">
                    <span className="text-white">Chandan R pays Chiranjeevi S</span>
                    <span className="font-semibold text-[#e4f222]">₹8,550.00</span>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-[6px] flex items-center justify-between">
                    <span className="text-white">Gagan K pays Chiranjeevi S</span>
                    <span className="font-semibold text-[#e4f222]">₹4,200.00</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-white/70 flex items-center justify-between">
                  <span>Result: Everyone settled to 0</span>
                  <span className="text-[#e4f222]">✓ 4 payments eliminated</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Key Features Grid */}
      <section id="features" className="py-20 md:py-28 px-6 bg-[#f4f2f0]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-wider text-[#6d6c6b] font-medium">
              Enterprise Ledger Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#0c0a08] tracking-tight mt-1">
              Engineered like an editorial trading desk.
            </h2>
            <p className="text-sm text-[#6d6c6b] mt-2">
              Clean separation between ledgers, member contributions, and settlement executions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[14px] border border-[#e5e7eb] p-6 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#f4f2f0] flex items-center justify-center text-[#0c0a08] mb-5">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#0c0a08]">
                  Integer Paise Accounting
                </h3>
                <p className="text-xs text-[#6d6c6b] mt-2 leading-relaxed">
                  Every split, custom share, and reimbursement is handled in integer paise.
                  Never worry about fractions of a rupee drifting across months of house tabs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-[10px] uppercase tracking-wider text-[#6d6c6b]">
                Standard Banking Math
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[14px] border border-[#e5e7eb] p-6 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#e4f222] flex items-center justify-center text-[#0c0a08] mb-5">
                  <Handshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#0c0a08]">
                  Greedy Debt Minimization
                </h3>
                <p className="text-xs text-[#6d6c6b] mt-2 leading-relaxed">
                  Instantly collapses multi-person circular debts into the minimum possible transfers.
                  Save your group from sending 15 confused UPI payments after a vacation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-[10px] uppercase tracking-wider text-[#0c0a08] font-medium">
                Minimal Transfers
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[14px] border border-[#e5e7eb] p-6 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#f4f2f0] flex items-center justify-center text-[#0c0a08] mb-5">
                  <PieChart className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#0c0a08]">
                  Category Analytics & Trends
                </h3>
                <p className="text-xs text-[#6d6c6b] mt-2 leading-relaxed">
                  Visualize group spending across Rent, Groceries, Dining, Travel, and Utilities.
                  Export transparent ledger summaries whenever a roommate moves out.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-[10px] uppercase tracking-wider text-[#6d6c6b]">
                Interactive Breakdown
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions (Accordion) */}
      <section id="faq" className="py-20 px-6 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-wider text-[#6d6c6b] font-medium">
              Questions & Answers
            </span>
            <h2 className="text-3xl font-medium text-[#0c0a08] tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does the Greedy Debt Minimization work?',
                a: 'The engine calculates each member’s net balance (Total Paid minus Total Share). It sorts participants by balance and repeatedly transfers funds from the largest debtor to the largest creditor until all balances are zero. This cuts transfers by up to 75%.',
              },
              {
                q: 'What is integer paise precision?',
                a: 'Instead of storing ₹100.50 as a float (which causes IEEE-754 precision errors in Javascript), SplitSimple stores 10,050 paise as an integer. This ensures zero rounding discrepancy across thousands of splits.',
              },
              {
                q: 'Can I try the app without creating an account or paying?',
                a: 'Yes! Click "Explore Demo Workspace" at the top of the page. You will immediately be logged in as Chiranjeevi with 3 pre-populated groups (Bangalore Roommates, Goa Trip, College Friends) and 22 expenses.',
              },
              {
                q: 'Can I settle payments via UPI?',
                a: 'Yes. Once a member sends money through any UPI app (GPay, PhonePe, Paytm), you can tap "Mark as Settled" on SplitSimple to instantly credit the ledger.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#e5e7eb] rounded-[8px] overflow-hidden bg-white"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-medium text-[#0c0a08] hover:bg-[#fafaf9] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-[#6d6c6b] transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 text-xs text-[#6d6c6b] leading-relaxed border-t border-[#e5e7eb] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final High-Contrast CTA Banner */}
      <section className="py-20 px-6 bg-[#0c0a08] text-white">
        <div className="max-w-[960px] mx-auto text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-[4px] bg-[#e4f222] text-[#0c0a08] text-xs font-semibold uppercase tracking-wider">
            Ready to simplify group tabs?
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            Stop arguing over shared bills. <br />
            Start settling with mathematical precision.
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto">
            Try the demo workspace in 5 seconds or create a new flat ledger for your roommates.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleExploreDemo}
              disabled={loadingDemo}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#e4f222] hover:bg-[#d9e81b] text-[#0c0a08] font-semibold text-xs uppercase tracking-wider rounded-[6px] transition-all flex items-center justify-center gap-2"
            >
              Explore Live Demo <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-7 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/20 font-medium text-xs uppercase tracking-wider rounded-[6px] transition-all">
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-[#1a1919] text-white py-12 px-6 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-xs text-[#6d6c6b]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[5px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center font-bold text-xs">
              S
            </div>
            <div>
              <span className="font-semibold text-white">SplitSimple</span>
              <p className="text-[10px] text-[#6d6c6b] uppercase tracking-wider mt-0.5">
                Editorial Expense Desk
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#simulator" className="hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#algorithm" className="hover:text-white transition-colors">
              Debt Engine
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Register
            </Link>
          </div>

          <div className="text-[11px] text-white/50">
            © {new Date().getFullYear()} SplitSimple · Built for roommates & group trips
          </div>
        </div>
      </footer>
    </div>
  );
}
