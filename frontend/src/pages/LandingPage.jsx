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
  TrendingUp,
  Wallet,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  DollarSign,
  Repeat,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, SecondaryButton } from '../components/Button';
import { MemberAvatar } from '../components/StatCard';
import { formatCurrency } from '../utils/helpers';

// Sample preview groups for the interactive showcase
const PREVIEW_DATA = {
  bangalore: {
    name: 'Bangalore Roommates',
    desc: 'Flat 402, Indiranagar — Monthly rent, utilities, and daily essentials',
    members: ['Chiranjeevi S', 'Gagan K', 'Pranav M', 'Chandan R'],
    totalSpent: 5401500, // ₹54,015.00
    expenses: [
      { title: 'Monthly House Rent', amount: 4000000, paidBy: 'Chiranjeevi S', category: 'Rent' },
      { title: 'Nature Basket Groceries', amount: 480000, paidBy: 'Gagan K', category: 'Groceries' },
      { title: 'BESCOM Electricity Bill', amount: 220000, paidBy: 'Pranav M', category: 'Utilities' },
      { title: 'Airtel Xstream Fiber', amount: 141500, paidBy: 'Chandan R', category: 'Utilities' },
    ],
    settlementPlan: [
      { from: 'Chandan R', to: 'Chiranjeevi S', amount: 855000 },
      { from: 'Gagan K', to: 'Chiranjeevi S', amount: 420000 },
    ],
    debtReduction: 'Reduced 6 individual IOUs into 2 clean transfers',
  },
  goa: {
    name: 'Goa Trip 2026',
    desc: 'Annual getaway: North Goa beach resort, scooter rentals, and scuba dive',
    members: ['Chiranjeevi S', 'Gagan K', 'Pranav M', 'Chandan R', 'Rahul V'],
    totalSpent: 8870000, // ₹88,700.00
    expenses: [
      { title: 'Beachfront Villa (3 Nights)', amount: 4500000, paidBy: 'Gagan K', category: 'Travel' },
      { title: 'Activa 6G Rentals (5x)', amount: 750000, paidBy: 'Chandan R', category: 'Transport' },
      { title: 'Scuba Diving & Coral Reef', amount: 1500000, paidBy: 'Rahul V', category: 'Activity' },
      { title: 'Fisherman’s Wharf Dinner', amount: 980000, paidBy: 'Chiranjeevi S', category: 'Dining' },
    ],
    settlementPlan: [
      { from: 'Chandan R', to: 'Gagan K', amount: 1250000 },
      { from: 'Pranav M', to: 'Gagan K', amount: 1774000 },
      { from: 'Rahul V', to: 'Chiranjeevi S', amount: 420000 },
    ],
    debtReduction: 'Reduced 10 potential debts into 3 single-hop payments',
  },
  college: {
    name: 'College Friends',
    desc: 'Weekend movies, burger nights, turf football, and cafe catchups',
    members: ['Chiranjeevi S', 'Pranav M', 'Chandan R', 'Rahul V'],
    totalSpent: 1060000, // ₹10,600.00
    expenses: [
      { title: 'Dune IMAX 3D Recliner', amount: 280000, paidBy: 'Pranav M', category: 'Entertainment' },
      { title: 'Truffles Burgers & Shakes', amount: 360000, paidBy: 'Chandan R', category: 'Food' },
      { title: 'Play Arena Night Turf', amount: 240000, paidBy: 'Rahul V', category: 'Sports' },
      { title: 'Third Wave Coffee Catchup', amount: 180000, paidBy: 'Chiranjeevi S', category: 'Cafe' },
    ],
    settlementPlan: [
      { from: 'Chiranjeevi S', to: 'Pranav M', amount: 15000 },
      { from: 'Rahul V', to: 'Chandan R', amount: 95000 },
    ],
    debtReduction: 'Resolved in 2 streamlined transfers with zero balance drift',
  },
};

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('bangalore');
  const [settledSimulated, setSettledSimulated] = useState(false);

  // 1-Click Demo Explorer
  const handleExploreDemo = async () => {
    setLoadingDemo(true);
    try {
      await login('chiranjeevi@example.com', 'password123');
      toast.success('Welcome to SplitSimple Demo Workspace!');
      navigate('/dashboard');
    } catch {
      toast.error('Could not connect to demo workspace. Directing to login.');
      navigate('/login');
    } finally {
      setLoadingDemo(false);
    }
  };

  const preview = PREVIEW_DATA[activePreviewTab];

  return (
    <div className="min-h-screen bg-[#fafafb] text-[#17191c] overflow-x-hidden selection:bg-[#fbe1d1] selection:text-[#5d2a1a]">
      {/* 1. Sophisticated Navigation Bar (Dark Charcoal) */}
      <header className="sticky top-0 z-50 bg-[#17191c]/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center font-bold text-sm tracking-tight shadow-sm transition-transform group-hover:scale-105">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-2xl font-semibold tracking-tight text-white">
                SplitSimple
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#a3a6af]">
            <a href="#preview" className="hover:text-white transition-colors">
              Product Preview
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#settlement" className="hover:text-white transition-colors">
              Smart Settlement
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="peach"
              size="sm"
              loading={loadingDemo}
              onClick={handleExploreDemo}
              className="text-xs"
            >
              Explore Demo
            </Button>
            <Link to="/login">
              <button className="px-4 py-2 rounded-full border border-white/15 hover:border-white/30 text-white text-xs font-semibold hover:bg-white/5 transition">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 rounded-full bg-white text-[#17191c] hover:bg-[#f2f2f3] text-xs font-semibold transition flex items-center gap-1.5">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#17191c] border-b border-white/10 px-6 py-6 space-y-4">
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#a3a6af] hover:text-white"
            >
              Product Preview
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#a3a6af] hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#a3a6af] hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#settlement"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#a3a6af] hover:text-white"
            >
              Smart Settlement
            </a>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <Button
                variant="peach"
                size="md"
                loading={loadingDemo}
                onClick={handleExploreDemo}
                className="w-full justify-center"
              >
                Explore Live Demo
              </Button>
              <Link to="/login" className="w-full">
                <button className="w-full py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/5 transition">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section — Dark Charcoal (#17191c) with Floating Animated Elements */}
      <section className="relative bg-[#17191c] text-white pt-20 pb-28 md:pt-28 md:pb-36 px-6 overflow-hidden">
        {/* Ambient subtle glow lights in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial from-[#5d2a1a]/20 via-[#17191c]/50 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-radial from-[#fbe1d1]/5 via-transparent to-transparent blur-2xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          {/* Staggered Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#fbe1d1] text-xs font-semibold tracking-wide uppercase mb-8 backdrop-blur-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fbe1d1]" />
            <span>FINANCIAL SAAS FOR ROOMMATES & TRAVEL GROUPS</span>
          </motion.div>

          {/* Staggered Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[1.04] tracking-tight text-white max-w-4xl mx-auto font-normal"
          >
            Shared expenses. <br />
            <span className="italic font-normal text-[#fbe1d1]">
              Zero awkward calculations.
            </span>
          </motion.h1>

          {/* Staggered Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="mt-8 text-base sm:text-lg md:text-xl text-[#a3a6af] max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Track shared rent, group vacations, and dinner tabs with integer paise precision, real-time ledgers, and intelligent greedy debt minimization.
          </motion.p>

          {/* Staggered CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="peach"
              loading={loadingDemo}
              onClick={handleExploreDemo}
              icon={ArrowRight}
              className="shadow-[0_4px_24px_rgba(251,225,209,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Explore Live Demo
            </Button>
            <Link to="/register">
              <button className="px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-base hover:bg-white/10 transition backdrop-blur-xs flex items-center gap-2">
                <span>Create Free Account</span>
              </button>
            </Link>
          </motion.div>

          {/* Interactive Floating Hero Preview Container */}
          <div className="relative mt-20 max-w-[1100px] mx-auto">
            {/* Floating Element 1: Top Left Pill */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              className="hidden lg:flex absolute -top-8 -left-10 z-20 items-center gap-3 bg-[#202327]/95 border border-white/15 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold text-white">Gagan K settled ₹500</span>
                <span className="block text-[#a3a6af] text-[10px]">Instant ledger update</span>
              </div>
            </motion.div>

            {/* Floating Element 2: Top Right Pill */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="hidden lg:flex absolute -top-6 -right-8 z-20 items-center gap-3 bg-[#fbe1d1] text-[#5d2a1a] px-4 py-2.5 rounded-full shadow-2xl"
            >
              <Sparkles className="w-4 h-4 text-[#5d2a1a]" />
              <div className="text-left text-xs">
                <span className="font-bold">Greedy Debt Solver</span>
                <span className="block text-[#5d2a1a]/80 text-[10px]">6 debts ➔ 2 transfers</span>
              </div>
            </motion.div>

            {/* Floating Element 3: Bottom Left Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: 1,
              }}
              className="hidden lg:flex absolute -bottom-6 -left-8 z-20 items-center gap-2.5 bg-[#202327]/95 border border-white/15 px-4 py-2 rounded-full shadow-xl backdrop-blur-md"
            >
              <Lock className="w-3.5 h-3.5 text-[#fbe1d1]" />
              <span className="text-xs font-medium text-white">Integer Paise: 0.00% Rounding Drift</span>
            </motion.div>

            {/* Main Hero Card Preview Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
              className="bg-white rounded-[28px] border border-white/20 p-6 sm:p-8 md:p-10 text-[#17191c] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-left"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f2f2f3] gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#17191c] text-white flex items-center justify-center font-bold text-sm">
                    FL
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
                      Flat 402 Roommates
                    </h3>
                    <p className="text-xs text-[#777b86]">
                      Active shared space · Indiranagar, Bangalore
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#f2f2f3] text-xs font-medium text-[#17191c]">
                    4 Roommates
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#fbe1d1] text-xs font-bold text-[#5d2a1a] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Optimal Debt Plan
                  </span>
                </div>
              </div>

              {/* Statistics Row with Visual Hierarchy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-5 rounded-[20px] bg-[#17191c] text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3a6af]">
                    Total Month Outlay
                  </span>
                  <p className="font-editorial text-3xl font-semibold mt-2 text-white">
                    ₹54,015.00
                  </p>
                  <p className="text-xs text-[#a3a6af] mt-1">Rent, electricity, Wi-Fi & groceries</p>
                </div>

                <div className="p-5 rounded-[20px] bg-[#fbe1d1]/50 border border-[#f6d0bb] text-[#5d2a1a]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5d2a1a]">
                    Smart Settlement Plan
                  </span>
                  <p className="font-editorial text-3xl font-semibold mt-2 text-[#5d2a1a]">
                    2 Payments
                  </p>
                  <p className="text-xs text-[#5d2a1a]/80 mt-1">6 chaotic debts simplified</p>
                </div>

                <div className="p-5 rounded-[20px] bg-[#fafafb] border border-[#f2f2f3]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777b86]">
                    Your Balance Status
                  </span>
                  <p className="font-editorial text-3xl font-semibold mt-2 text-[#17191c]">
                    +₹1,250.00
                  </p>
                  <p className="text-xs text-green-700 font-semibold mt-1">You are owed overall</p>
                </div>
              </div>

              {/* Illustrative Transaction Item */}
              <div className="p-4 rounded-[18px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MemberAvatar name="Chandan R" size="md" />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#17191c]">
                      <span>Chandan R</span>
                      <span className="text-xs text-[#777b86]">pays</span>
                      <span className="text-[#17191c] font-bold">Chiranjeevi S</span>
                    </div>
                    <p className="text-xs text-[#777b86]">Clears all flat utility & groceries shares</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-editorial text-2xl font-semibold text-[#17191c]">
                    ₹8,550.00
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#17191c] text-white text-xs font-medium">
                    Verified Optimal
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Product Preview Showcase (Warm Neutral Background) */}
      <section id="preview" className="py-24 px-6 bg-[#faf8f5] border-b border-[#f2f2f3]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5d2a1a] px-3.5 py-1 rounded-full bg-[#fbe1d1] inline-block mb-3">
              Interactive Product Showcase
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c]">
              Tailored for every group dynamic.
            </h2>
            <p className="text-sm text-[#777b86] mt-2">
              Switch between workspaces to see how SplitSimple resolves different spending patterns with zero math errors.
            </p>

            {/* Interactive Tab Switcher */}
            <div className="mt-8 inline-flex p-1.5 rounded-full bg-[#f2f2f3] border border-[#e3e4e7] text-xs font-semibold">
              {[
                { id: 'bangalore', label: 'Flat 402 Roommates' },
                { id: 'goa', label: 'Goa Trip 2026' },
                { id: 'college', label: 'College Friends' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    activePreviewTab === tab.id
                      ? 'bg-[#17191c] text-white shadow-xs'
                      : 'text-[#777b86] hover:text-[#17191c]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Preview Card with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePreviewTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[28px] border border-[#f2f2f3] p-6 sm:p-10 shadow-[0_4px_24px_rgba(23,25,28,0.04)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#f2f2f3] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-3xl font-semibold text-[#17191c]">
                      {preview.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#777b86] mt-1">{preview.desc}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase font-semibold text-[#777b86]">Total Group Outlay</span>
                  <p className="font-editorial text-3xl font-semibold text-[#17191c]">
                    {formatCurrency(preview.totalSpent)}
                  </p>
                </div>
              </div>

              {/* Grid: Left Column (Expenses), Right Column (Settlement Plan) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                {/* 4 Expenses (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86] block mb-2">
                    Recent Group Ledger Entries
                  </span>
                  {preview.expenses.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <MemberAvatar name={exp.paidBy} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-[#17191c]">{exp.title}</p>
                          <p className="text-[11px] text-[#777b86]">
                            Paid by {exp.paidBy} · {exp.category}
                          </p>
                        </div>
                      </div>
                      <p className="font-editorial text-base font-semibold text-[#17191c]">
                        {formatCurrency(exp.amount)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Settlement Outcome (5 cols) */}
                <div className="lg:col-span-5 bg-[#fafafb] rounded-[20px] border border-[#f2f2f3] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#5d2a1a] bg-[#fbe1d1] px-2.5 py-0.5 rounded-full">
                        Greedy Optimization
                      </span>
                    </div>

                    <h4 className="font-editorial text-xl font-semibold text-[#17191c] mb-1">
                      Optimized Repayments
                    </h4>
                    <p className="text-xs text-[#777b86] mb-4">{preview.debtReduction}</p>

                    <div className="space-y-2.5">
                      {preview.settlementPlan.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-[14px] border border-[#f2f2f3] flex items-center justify-between text-xs"
                        >
                          <span className="text-[#17191c]">
                            <strong>{s.from}</strong> ➔ {s.to}
                          </span>
                          <span className="font-editorial text-sm font-semibold text-[#17191c]">
                            {formatCurrency(s.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#f2f2f3]">
                    <Button
                      variant="peach"
                      size="sm"
                      onClick={handleExploreDemo}
                      className="w-full text-xs justify-center"
                    >
                      Open Live Group Ledger ➔
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Features Section (Paper White with Hover Lift) */}
      <section id="features" className="py-24 px-6 bg-white border-b border-[#f2f2f3]">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
              Architected for Real Life
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] mt-2">
              Designed with precision. Built without complexity.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-[24px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#17191c]">
              <div>
                <div className="w-12 h-12 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center mb-6 text-[#17191c]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  Shared Groups
                </h3>
                <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                  Isolate flat rent, holiday bookings, and college outings into distinct rosters with custom membership lists.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-[24px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#17191c]">
              <div>
                <div className="w-12 h-12 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center mb-6 text-[#17191c]">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  Flexible Splitting
                </h3>
                <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                  Split equally with remainder paise distributed cleanly, or assign specific rupee shares with real-time sum checking.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-[24px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#17191c]">
              <div>
                <div className="w-12 h-12 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center mb-6 text-[#17191c]">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#17191c]">
                  Real-Time Ledgers
                </h3>
                <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                  Immediate recalculation of individual member positions. Know who is owed money and who must pay instantly.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-[24px] bg-[#fbe1d1]/30 border border-[#f6d0bb] p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#5d2a1a]">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center mb-6">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#5d2a1a]">
                  Smart Settlement
                </h3>
                <p className="mt-3 text-sm text-[#5d2a1a]/80 leading-relaxed">
                  Our greedy debt engine reduces pairwise IOUs down to at most N-1 clean transfers. Settle debts with fewer repayments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-[#fafafb] border-b border-[#f2f2f3]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
              Simple Three-Step Workflow
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] mt-2">
              How SplitSimple works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-8 transition-all hover:border-[#17191c]">
              <span className="font-editorial text-5xl text-[#a3a6af]">01</span>
              <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mt-4">
                Create a Group
              </h3>
              <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                Add roommates or friends. Look up members by email, or immediately explore with pre-loaded demo groups.
              </p>
            </div>

            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-8 transition-all hover:border-[#17191c]">
              <span className="font-editorial text-5xl text-[#a3a6af]">02</span>
              <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mt-4">
                Log Shared Receipts
              </h3>
              <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                Enter expense title, category, date, and payer. Choose equal division or allocate custom rupee shares.
              </p>
            </div>

            <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-8 transition-all hover:border-[#17191c]">
              <span className="font-editorial text-5xl text-[#5d2a1a]">03</span>
              <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mt-4">
                Settle with Less Effort
              </h3>
              <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                Review the greedy settlement plan. Send money directly via UPI or cash, click "Mark as Paid", and balances update to zero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dedicated Smart Settlement Showcase (Dark Charcoal Section) */}
      <section id="settlement" className="py-24 px-6 bg-[#17191c] text-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Description */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5d2a1a] px-3.5 py-1 rounded-full bg-[#fbe1d1] inline-block mb-4">
                Proprietary Algorithm
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-white leading-tight">
                How 6 chaotic debts become 2 clean transfers.
              </h2>
              <p className="mt-6 text-sm text-[#a3a6af] leading-relaxed">
                When friends repeatedly pay for groceries, cabs, and meals, debts intersect. Traditional splitting forces everyone to exchange multiple payments.
              </p>
              <p className="mt-3 text-sm text-[#a3a6af] leading-relaxed">
                SplitSimple models debts as a bipartite creditor-debtor graph. By pairing the largest debtor with the largest creditor, all obligations collapse into minimal payments.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-white">
                  <div className="w-5 h-5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Reduces banking friction and transfer fees</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white">
                  <div className="w-5 h-5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Instant recalculation when a payment is marked paid</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white">
                  <div className="w-5 h-5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Strict zero-sum conservation in integer paise</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Debt Simplification Demonstration */}
            <div className="lg:col-span-7 bg-[#202327] rounded-[28px] border border-white/10 p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#fbe1d1]">
                  Visual Simplification Model
                </span>
                <button
                  onClick={() => setSettledSimulated(!settledSimulated)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition flex items-center gap-1.5"
                >
                  <Repeat size={12} />
                  <span>{settledSimulated ? 'Reset Demonstration' : 'Simulate Settlement'}</span>
                </button>
              </div>

              {/* Before vs After Container */}
              <div className="space-y-4">
                {/* Before: Raw Balances */}
                <div className="p-4 rounded-[18px] bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-[#a3a6af] mb-3">
                    <span>Raw Net Balances (4 Members)</span>
                    <span className="text-green-400 font-semibold">Net Sum: ₹0.00</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-[12px] bg-white/5 border border-white/5">
                      <span className="block text-[11px] text-[#a3a6af]">Chiranjeevi</span>
                      <strong className="text-green-400 font-editorial text-sm">+₹1,000</strong>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-white/5 border border-white/5">
                      <span className="block text-[11px] text-[#a3a6af]">Gagan</span>
                      <strong className="text-[#fbe1d1] font-editorial text-sm">-₹500</strong>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-white/5 border border-white/5">
                      <span className="block text-[11px] text-[#a3a6af]">Pranav</span>
                      <strong className="text-[#fbe1d1] font-editorial text-sm">-₹300</strong>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-white/5 border border-white/5">
                      <span className="block text-[11px] text-[#a3a6af]">Chandan</span>
                      <strong className="text-[#fbe1d1] font-editorial text-sm">-₹200</strong>
                    </div>
                  </div>
                </div>

                {/* Animated Arrow / Transition Indicator */}
                <div className="text-center py-1">
                  <span className="text-xs text-[#a3a6af] inline-flex items-center gap-1.5">
                    <span>Greedy Debtor-Creditor Solver</span>
                    <span>↓</span>
                  </span>
                </div>

                {/* After: Minimal Repayments */}
                <div className="p-5 rounded-[18px] bg-[#fbe1d1] text-[#5d2a1a] shadow-lg">
                  <div className="flex items-center justify-between text-xs font-bold mb-3">
                    <span>OPTIMIZED REPAYMENTS ({settledSimulated ? '0 Remaining' : '3 Clean Transfers'})</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#5d2a1a] text-white text-[10px]">
                      Greedy Optimal
                    </span>
                  </div>

                  {settledSimulated ? (
                    <div className="py-6 text-center text-[#5d2a1a]">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#5d2a1a]" />
                      <p className="font-editorial text-xl font-semibold">All Accounts Settled</p>
                      <p className="text-xs text-[#5d2a1a]/80 mt-0.5">Every member balance returned to ₹0.00.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded-[12px] flex items-center justify-between text-[#17191c]">
                        <span><strong>Gagan K</strong> pays Chiranjeevi S</span>
                        <strong className="font-editorial text-base">₹500.00</strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-[12px] flex items-center justify-between text-[#17191c]">
                        <span><strong>Pranav M</strong> pays Chiranjeevi S</span>
                        <strong className="font-editorial text-base">₹300.00</strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-[12px] flex items-center justify-between text-[#17191c]">
                        <span><strong>Chandan R</strong> pays Chiranjeevi S</span>
                        <strong className="font-editorial text-base">₹200.00</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-24 px-6 bg-[#faf8f5]">
        <div className="max-w-[1000px] mx-auto bg-[#17191c] rounded-[32px] p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal leading-tight">
              Make shared expenses simple.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#a3a6af] max-w-xl mx-auto">
              Join roommates and friends who manage split rent, group holidays, and shared meals without stress.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="peach"
                size="lg"
                loading={loadingDemo}
                onClick={handleExploreDemo}
                icon={ArrowRight}
                className="shadow-[0_4px_24px_rgba(251,225,209,0.2)]"
              >
                Launch Demo Workspace
              </Button>
              <Link to="/register">
                <button className="px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-base hover:bg-white/10 transition">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Editorial Footer */}
      <footer className="border-t border-[#f2f2f3] py-14 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#777b86]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#17191c] text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="font-editorial text-xl font-semibold text-[#17191c]">
              SplitSimple
            </span>
            <span>·</span>
            <span>Shared Financial Ledger</span>
          </div>

          <div>
            Project Architect & Owner: <strong className="text-[#17191c]">CHIRANJEEVI S</strong>
          </div>

          <div>
            © {new Date().getFullYear()} SplitSimple. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
