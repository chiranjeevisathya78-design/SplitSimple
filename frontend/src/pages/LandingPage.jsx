import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Receipt,
  Scale,
  Sparkles,
  Check,
  Zap,
  Users,
  PieChart,
  ArrowUpRight,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Handshake,
  Repeat,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  CircleDollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

// Sample preview groups for the interactive showcase
const PREVIEW_DATA = {
  bangalore: {
    id: 'bangalore',
    name: 'Bangalore Roommates',
    badge: 'INDIRANAGAR 3BHK',
    desc: 'Monthly rent, cook, utilities, and daily provisions',
    folderGradient: 'from-[#d8ff26] to-[#b8f000]',
    totalSpent: 4841500,
    expenses: [
      { title: 'Monthly House Rent', amount: 4000000, paidBy: 'Chiranjeevi S', category: 'Rent', date: '01 NOV' },
      { title: 'Nature Basket Groceries', amount: 480000, paidBy: 'Gagan K', category: 'Groceries', date: '02 NOV' },
      { title: 'BESCOM Electricity Bill', amount: 220000, paidBy: 'Pranav M', category: 'Utilities', date: '03 NOV' },
      { title: 'Airtel Xstream Fiber', amount: 141500, paidBy: 'Chandan R', category: 'Utilities', date: '04 NOV' },
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
    badge: 'BEACH VILLA TAB',
    desc: 'Beach villa, scooter rentals, dining, and scuba expeditions',
    folderGradient: 'from-[#ff4d8d] to-[#e62266]',
    totalSpent: 8180000,
    expenses: [
      { title: 'Beachfront Villa (3 Nights)', amount: 4500000, paidBy: 'Gagan K', category: 'Stay', date: '28 OCT' },
      { title: 'Activa Rentals (5 Scooters)', amount: 750000, paidBy: 'Chandan R', category: 'Transport', date: '29 OCT' },
      { title: 'Scuba Diving Expeditions', amount: 1500000, paidBy: 'Rahul V', category: 'Activity', date: '30 OCT' },
      { title: 'Fisherman’s Wharf Feast', amount: 980000, paidBy: 'Chiranjeevi S', category: 'Dining', date: '31 OCT' },
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
    badge: 'WEEKEND TAB',
    desc: 'IMAX movies, burgers, turf football, and cafe catchups',
    folderGradient: 'from-[#33f5ff] to-[#00d9e6]',
    totalSpent: 1060000,
    expenses: [
      { title: 'Dune IMAX 3D Recliner', amount: 280000, paidBy: 'Pranav M', category: 'Movies', date: '02 NOV' },
      { title: 'Truffles Burgers & Shakes', amount: 360000, paidBy: 'Chandan R', category: 'Dining', date: '03 NOV' },
      { title: 'Play Arena Night Turf', amount: 240000, paidBy: 'Rahul V', category: 'Sports', date: '03 NOV' },
      { title: 'Third Wave Coffee Catchup', amount: 180000, paidBy: 'Chiranjeevi S', category: 'Cafe', date: '04 NOV' },
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
  const { login, user, logout } = useAuth();
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
      toast.success('★ Entered SplitSimple Glass Desk!', {
        icon: '⚡',
        style: {
          border: '2px solid black',
          borderRadius: '8px',
          boxShadow: '4px 4px 0px #000, inset 0 1px 1px rgba(255,255,255,0.8)',
          background: 'linear-gradient(180deg, #d8ff26 0%, #b8f000 100%)',
          color: '#000',
          fontWeight: 'bold',
          fontFamily: 'Space Grotesk, sans-serif',
        },
      });
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
        toast.success('Repayment marked as SETTLED via UPI!', {
          icon: '✓',
          style: {
            border: '2px solid black',
            borderRadius: '8px',
            boxShadow: '4px 4px 0px #000, inset 0 1px 1px rgba(255,255,255,0.8)',
            background: 'linear-gradient(180deg, #33f5ff 0%, #00d9e6 100%)',
            color: '#000',
            fontWeight: 'bold',
            fontFamily: 'Space Mono, monospace',
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
    <div className="min-h-screen text-black overflow-x-hidden selection:bg-[#ccff00] selection:text-black antialiased relative">
      {/* 
        1. TOP GLASSMARQUEE ANNOUNCEMENT
      */}
      <div className="bg-black/90 backdrop-blur-md text-white border-b-2 border-black py-1.5 overflow-hidden select-none shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-8 text-xs font-mono font-bold tracking-widest animate-skeuo-marquee whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[#ccff00]">
            <Sparkles className="w-4 h-4" /> SKEUO-NEU-BRUTALIST GLASS INTERFACE
          </span>
          <span className="text-[#ff3377]">★</span>
          <span className="text-[#00f0ff]">3D TACTILE PUSH-BUTTONS & FROSTED BEVELS</span>
          <span className="text-[#ccff00]">★</span>
          <span className="text-[#ff7700]">100% INTEGER PAISE ACCURACY (0.00% DRIFT)</span>
          <span className="text-[#ff3377]">★</span>
          <span className="text-white">GREEDY DEBT MIN-FLOW SOLVER</span>
          <span className="text-[#00f0ff]">★</span>
          <span className="text-[#ccff00]">COLLAPSE 10 IOUs INTO 2 DIRECT TRANSFERS</span>
        </div>
      </div>

      {/* 
        2. FROSTED GLASS & BRUTALIST STICKY HEADER
      */}
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-2xl border-b-[2.5px] border-black shadow-[0_4px_16px_rgba(0,0,0,0.06),0_4px_0px_#000000]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[8px] bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black border-2 border-black flex items-center justify-center font-display font-black text-base shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_5px_0px_#000] transition-all">
              S
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-display font-extrabold tracking-tight text-black leading-none">
                  SplitSimple
                </span>
                <span className="px-1.5 py-0.2 bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white text-[9px] font-mono font-bold uppercase rounded-[4px] border border-black shadow-[1px_1px_0px_#000]">
                  GLASS
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-600 mt-0.5">
                Tactile Expense Desk
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-bold uppercase tracking-wider">
            <a href="#simulator" className="text-black hover:text-[#ff3377] transition-colors">
              Interactive Demo
            </a>
            <a href="#engine" className="text-black hover:text-[#00f0ff] transition-colors">
              Debt Engine
            </a>
            <a href="#features" className="text-black hover:text-[#ff7700] transition-colors">
              Features
            </a>
            <a href="#faq" className="text-black hover:text-[#a855f7] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 font-display text-xs font-black uppercase tracking-wider bg-black text-[#ccff00] hover:bg-neutral-800 border-2 border-black rounded-[8px] shadow-[2px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={14} className="text-[#ccff00]" />
                  <span>Go to Dashboard →</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 font-display text-xs font-bold uppercase tracking-wider text-black bg-white/80 hover:bg-white border-2 border-black rounded-[8px] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-black bg-white/80 hover:bg-white border-2 border-black rounded-[8px] shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.9)] hover:shadow-[3px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleExploreDemo}
                  disabled={loadingDemo}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-display font-bold uppercase tracking-wider bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black border-2 border-black rounded-[8px] shadow-[3px_4px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)] hover:shadow-[5px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
                >
                  {loadingDemo ? (
                    <>Connecting...</>
                  ) : (
                    <>
                      Explore Demo <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black border-2 border-black rounded-[8px] shadow-[2px_3px_0px_#000]"
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
              className="md:hidden bg-white/95 backdrop-blur-2xl border-t-2 border-black px-4 py-4 space-y-3"
            >
              <a
                href="#simulator"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-mono text-xs font-bold uppercase text-black"
              >
                Interactive Demo
              </a>
              <a
                href="#engine"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-mono text-xs font-bold uppercase text-black"
              >
                Debt Engine
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-mono text-xs font-bold uppercase text-black"
              >
                Features
              </a>
              <div className="pt-3 border-t-2 border-black flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleExploreDemo();
                  }}
                  className="w-full py-2.5 font-display text-xs font-bold uppercase bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black border-2 border-black rounded-[8px] shadow-[3px_4px_0px_#000]"
                >
                  Explore Demo Workspace
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 font-display text-xs font-bold uppercase text-center bg-white border-2 border-black rounded-[8px] shadow-[2px_3px_0px_#000]"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 
        3. HERO SECTION (SKEUO-NEU-BRUTALIST GLASS HERO)
      */}
      <section className="relative pt-14 pb-16 sm:pt-24 sm:pb-24 overflow-hidden">
        {/* Ambient floating glass orbs */}
        <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#d8ff26]/30 to-transparent blur-xl pointer-events-none" />
        <div className="absolute top-36 right-16 w-32 h-32 rounded-full bg-gradient-to-br from-[#00f0ff]/30 to-transparent blur-xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Authenticated Welcome Banner if user is logged in */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3.5 bg-gradient-to-r from-[#d8ff26]/90 via-[#33f5ff]/90 to-[#ff4d8d]/90 border-2 border-black rounded-[10px] shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-black text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                  <span>WELCOME BACK, {user.name.toUpperCase()}! YOUR EXPENSE DESK IS READY.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="px-3.5 py-1.5 bg-black text-[#ccff00] hover:bg-neutral-800 font-mono text-xs font-black uppercase rounded-[6px] border border-black shadow-[2px_2px_0px_#000] transition active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Open Live Dashboard →
                  </Link>
                  <button
                    onClick={logout}
                    className="px-2.5 py-1.5 bg-white text-black hover:bg-neutral-100 font-mono text-xs font-bold uppercase rounded-[6px] border-2 border-black shadow-[2px_2px_0px_#000] transition cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}

            {/* Maximalist Top Stickers Row */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-[#ccff00] to-[#b8f000] border-2 border-black font-mono text-[10px] font-black uppercase rounded-[6px] shadow-[2px_2px_0px_#000] -rotate-1">
                ✦ 100% INTEGER PAISE
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-[#ff3377] to-[#e62266] text-white border-2 border-black font-mono text-[10px] font-black uppercase rounded-[6px] shadow-[2px_2px_0px_#000] rotate-1">
                🔥 GREEDY MIN-FLOW
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-[#00f0ff] to-[#00d9e6] border-2 border-black font-mono text-[10px] font-black uppercase rounded-[6px] shadow-[2px_2px_0px_#000] -rotate-2">
                ★ ZERO LEAKAGE
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-[#ffb703] to-[#ff9900] border-2 border-black font-mono text-[10px] font-black uppercase rounded-[6px] shadow-[2px_2px_0px_#000] rotate-2">
                ⚡ MAXIMALIST DESK
              </span>
            </div>

            {/* Top Skeuo-Glass Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[30px] bg-white/80 backdrop-blur-xl border-2 border-black shadow-[3px_4px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.95)] text-xs font-mono font-bold uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
              <span>SKEUO-NEU-BRUTALIST GLASS DESK</span>
              <span className="text-black/30">|</span>
              <span className="text-[#ff3377] font-black">INTEGER PAISE ACCURACY</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-[76px] font-display font-black tracking-tight leading-[1.02] uppercase text-black"
            >
              SHARED EXPENSES.{' '}
              <span className="relative inline-block mt-1">
                <span className="relative z-10 px-4 py-1 bg-gradient-to-r from-[#d8ff26] to-[#a8f000] border-3 border-black rounded-[12px] shadow-[6px_6px_0px_#000,inset_0_2px_1px_rgba(255,255,255,0.8)] -rotate-1 inline-block">
                  ZERO AWKWARD MATH.
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl font-display font-medium text-neutral-800 max-w-2xl mx-auto leading-relaxed pt-2"
            >
              Track flatmates, vacation tabs, and dinner tabs on a tactile frosted glass ledger.
              The greedy debt engine collapses messy circular transfers into minimal 1-hop UPI payments.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={handleExploreDemo}
                disabled={loadingDemo}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-b from-[#d8ff26] to-[#b8f000] active:translate-x-1 active:translate-y-1 text-black font-display font-black text-sm uppercase tracking-wider border-3 border-black rounded-[10px] shadow-[5px_6px_0px_#000,inset_0_2px_1px_rgba(255,255,255,0.85)] hover:shadow-[7px_8px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingDemo ? (
                  <>Entering Workspace...</>
                ) : (
                  <>
                    Explore Live Demo Workspace <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-gradient-to-b from-[#ff4d8d] to-[#e62266] active:translate-x-1 active:translate-y-1 text-white font-display font-black text-sm uppercase tracking-wider border-3 border-black rounded-[10px] shadow-[5px_6px_0px_#000,inset_0_2px_1px_rgba(255,255,255,0.5)] hover:shadow-[7px_8px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Create Free Account
                </button>
              </Link>
            </motion.div>

            {/* Tactile Skeuo Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold"
            >
              <div className="px-3 py-1 bg-white/80 backdrop-blur-md border-2 border-black rounded-[20px] shadow-[2px_3px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center gap-1.5 rotate-1">
                <Check className="w-4 h-4 text-[#00c853]" /> 3 PRELOADED GROUPS
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-[#33f5ff] to-[#00d9e6] border-2 border-black rounded-[20px] shadow-[2px_3px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center gap-1.5 -rotate-1">
                <Check className="w-4 h-4 text-black" /> 22 REAL EXPENSES
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-[#ffc837] to-[#ff9900] border-2 border-black rounded-[20px] shadow-[2px_3px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center gap-1.5 rotate-2">
                <Check className="w-4 h-4 text-black" /> 1-CLICK UPI SETTLE
              </div>
            </motion.div>
          </div>

          {/* 
            4. FROSTED GLASS & BRUTALIST DESK MOCKUP
          */}
          <motion.div
            id="simulator"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full mt-14"
          >
            {/* The Glass Brutalist Main Frame */}
            <div className="bg-white/80 backdrop-blur-2xl border-3 sm:border-4 border-black rounded-[16px] shadow-[8px_10px_0px_#000000,0_24px_48px_rgba(0,0,0,0.1),inset_0_2px_1.5px_rgba(255,255,255,0.95)] overflow-hidden">
              {/* Gloss Top Specular Sheen */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

              {/* Desk Chrome Header */}
              <div className="bg-white/60 backdrop-blur-xl border-b-3 border-black px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff3b30] border border-black shadow-[1px_1px_0px_#000]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffcc00] border border-black shadow-[1px_1px_0px_#000]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#00c853] border border-black shadow-[1px_1px_0px_#000]" />
                  <span className="font-mono text-xs font-bold text-black ml-3">
                    splitsimple.app/workspace/{activeTab}
                  </span>
                </div>

                {/* Tactile 3D Tab Switcher */}
                <div className="flex items-center gap-2">
                  {Object.values(PREVIEW_DATA).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 border-2 border-black font-display font-bold text-xs uppercase transition-all rounded-[6px] cursor-pointer ${
                        activeTab === tab.id
                          ? `bg-gradient-to-b ${tab.folderGradient} text-black shadow-[3px_4px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.8)] -translate-y-0.5`
                          : 'bg-white/70 hover:bg-white text-black'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workspace Content */}
              <div className="p-5 sm:p-8 bg-neutral-100/40 backdrop-blur-md">
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
                      <div className="bg-white/90 backdrop-blur-xl border-3 border-black p-5 rounded-[10px] shadow-[4px_5px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.95)] relative">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <h2 className="text-2xl font-display font-black text-black uppercase">
                            {preview.name}
                          </h2>
                          <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#ff4d8d] to-[#e62266] text-white text-[10px] font-mono font-bold uppercase border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
                            {preview.badge}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-neutral-600">{preview.desc}</p>

                        {/* Members */}
                        <div className="mt-4 pt-3 border-t-2 border-black/10">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                            Active Ledger Participants
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {preview.members.map((m) => (
                              <div
                                key={m.name}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-black rounded-[6px] text-xs font-mono font-bold shadow-[2px_2px_0px_#000]"
                              >
                                <span>{m.name}</span>
                                <span className="text-[10px] text-neutral-500 font-normal">({m.role})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recent Transactions List */}
                      <div className="bg-white/90 backdrop-blur-xl border-3 border-black rounded-[10px] shadow-[4px_5px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.95)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#d8ff26] to-[#b8f000] px-4 py-2.5 border-b-2 border-black flex items-center justify-between font-mono text-xs font-bold uppercase">
                          <span>Group Transactions</span>
                          <span>Total: {formatCurrency(preview.totalSpent)}</span>
                        </div>
                        <div className="divide-y-2 divide-black">
                          {preview.expenses.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 hover:bg-white transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[6px] bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] border-2 border-black flex items-center justify-center font-mono font-bold text-xs shadow-[2px_2px_0px_#000]">
                                  {item.date}
                                </div>
                                <div>
                                  <p className="text-sm font-display font-bold text-black">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] font-mono text-neutral-600">
                                    Paid by <strong className="font-bold text-black">{item.paidBy}</strong> · {item.category}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-mono font-bold text-black">
                                {formatCurrency(item.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Smart Greedy Settlement Engine (5 cols) */}
                    <div className="lg:col-span-5 bg-[#0e0f17]/95 backdrop-blur-2xl text-white border-3 border-black rounded-[10px] p-6 flex flex-col justify-between shadow-[6px_7px_0px_#000,inset_0_1px_1.5px_rgba(255,255,255,0.25)]">
                      <div>
                        {/* Box Header */}
                        <div className="flex items-center justify-between pb-4 border-b-2 border-white/20">
                          <div>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ccff00]">
                              GREEDY DEBT ENGINE
                            </span>
                            <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                              Optimized Repayments
                            </h3>
                          </div>
                          <span className="px-2 py-1 bg-gradient-to-r from-[#ff4d8d] to-[#e62266] text-white text-[10px] font-mono font-bold uppercase border border-white rounded-[4px] shadow-[2px_2px_0px_#fff]">
                            -{preview.reductionPercent} HOPS
                          </span>
                        </div>

                        {/* Explanation */}
                        <p className="text-xs font-mono text-neutral-300 mt-3 mb-5 leading-relaxed">
                          Collapses <strong className="text-white font-bold">{preview.iouCount} tangled IOUs</strong> into{' '}
                          <strong className="text-[#ccff00] font-bold">{preview.optimizedCount} single-hop transfers</strong>.
                        </p>

                        {/* Repayment List */}
                        <div className="space-y-3">
                          {preview.settlementPlan.map((step, idx) => {
                            const isSettled = settledRows[`${activeTab}-${idx}`];
                            return (
                              <motion.div
                                key={idx}
                                layout
                                className={`p-3.5 rounded-[8px] border-2 transition-all ${
                                  isSettled
                                    ? 'bg-neutral-900 border-[#00c853] opacity-80'
                                    : 'bg-white/10 backdrop-blur-md border-white/30 hover:border-white'
                                }`}
                              >
                                <div className="flex items-center justify-between font-mono text-xs">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white">{step.from}</span>
                                    <span className="text-[#ccff00] font-bold">→ PAYS →</span>
                                    <span className="font-bold text-white">{step.to}</span>
                                  </div>
                                  <span className="font-bold text-[#ccff00] text-sm ml-2">
                                    {formatCurrency(step.amount)}
                                  </span>
                                </div>

                                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-neutral-400">
                                    {isSettled ? '✓ CONFIRMED VIA UPI' : 'Pending transfer'}
                                  </span>
                                  <button
                                    onClick={() => handleToggleSettle(idx)}
                                    className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-[6px] border-2 transition-all cursor-pointer ${
                                      isSettled
                                        ? 'bg-[#00c853] text-black border-black shadow-[2px_2px_0px_#fff]'
                                        : 'bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black border-black shadow-[2px_3px_0px_#fff] hover:brightness-105'
                                    }`}
                                  >
                                    {isSettled ? 'SETTLED ✓' : 'MARK SETTLED →'}
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Box CTA */}
                      <div className="pt-6 mt-6 border-t-2 border-white/20">
                        <div className="flex items-center justify-between mb-3 font-mono text-xs">
                          <span className="text-neutral-400">Group Expenditure:</span>
                          <span className="text-lg font-bold text-white">
                            {formatCurrency(preview.totalSpent)}
                          </span>
                        </div>
                        <button
                          onClick={handleExploreDemo}
                          disabled={loadingDemo}
                          className="w-full py-3 bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black rounded-[8px] shadow-[3px_4px_0px_#ffffff] hover:shadow-[5px_6px_0px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          LAUNCH FULL DESK <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        5. STATS BAND (FROSTED GLASS SKEUOMORPHIC NUMBERS)
      */}
      <section className="bg-black/90 backdrop-blur-xl text-white border-y-3 border-black py-12 px-4 sm:px-6 lg:px-8 shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center md:text-left">
          <div className="border-l-3 border-[#ccff00] pl-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Transactions Settled
            </p>
            <p className="text-3xl sm:text-4xl font-display font-black text-white">
              ₹1.53 LAKH+
            </p>
            <p className="font-mono text-xs text-neutral-400 mt-1">Real group volume</p>
          </div>

          <div className="border-l-3 border-[#ff3377] pl-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Transfer Reduction
            </p>
            <p className="text-3xl sm:text-4xl font-display font-black text-[#ff3377]">
              -75% HOPS
            </p>
            <p className="font-mono text-xs text-neutral-400 mt-1">Zero circular debts</p>
          </div>

          <div className="border-l-3 border-[#00f0ff] pl-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Rounding Drift
            </p>
            <p className="text-3xl sm:text-4xl font-display font-black text-[#00f0ff]">
              0.00% DRIFT
            </p>
            <p className="font-mono text-xs text-neutral-400 mt-1">Integer paise precision</p>
          </div>

          <div className="border-l-3 border-[#ff7700] pl-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Settlement Engine
            </p>
            <p className="text-3xl sm:text-4xl font-display font-black text-[#ff7700]">
              INSTANT UPI
            </p>
            <p className="font-mono text-xs text-neutral-400 mt-1">1-click ledger clearance</p>
          </div>
        </div>
      </section>

      {/* 
        6. THE DEBT ENGINE COMPARISON (GLASS CARDS)
      */}
      <section id="engine" className="py-20 md:py-24 bg-white/60 backdrop-blur-xl border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 bg-gradient-to-r from-[#d8ff26] to-[#b8f000] border-2 border-black rounded-[6px] text-xs font-mono font-bold uppercase shadow-[2px_3px_0px_#000]">
                ★ GREEDY DEBT MINIMIZATION ALGORITHM
              </span>

              <h2 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase leading-[1.05]">
                FROM A CHAOTIC WEB OF IOUs <br />
                TO DIRECT BANK TRANSFERS.
              </h2>

              <p className="text-base font-display text-neutral-800 leading-relaxed">
                When 5 roommates split rent, electricity, and weekend dining, naive calculations create a web of 10 circular payments where person A pays B, B pays C, and C pays A.
                SplitSimple computes the net balance of every person and repeatedly resolves maximum creditors with maximum debtors.
              </p>

              <div className="space-y-4 pt-2 font-mono">
                <div className="flex items-start gap-3 p-3.5 bg-white/80 backdrop-blur-md border-2 border-black rounded-[8px] shadow-[3px_4px_0px_#000]">
                  <div className="w-7 h-7 bg-gradient-to-b from-[#d8ff26] to-[#b8f000] border-2 border-black rounded-[4px] flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase text-xs">Global Net Balance Calculation</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Every participant gets a single number: Total Paid − Total Owed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white/80 backdrop-blur-md border-2 border-black rounded-[8px] shadow-[3px_4px_0px_#000]">
                  <div className="w-7 h-7 bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white border-2 border-black rounded-[4px] flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase text-xs">Greedy Flow Pairing</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Matches the max debtor with max creditor. Cuts transfers by up to 75%.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white/80 backdrop-blur-md border-2 border-black rounded-[8px] shadow-[3px_4px_0px_#000]">
                  <div className="w-7 h-7 bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] border-2 border-black rounded-[4px] flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase text-xs">Zero Rounding Drift Guarantee</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Every share is stored in integer paise. No decimal floating-point errors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Comparison Box */}
            <div className="lg:col-span-6 bg-white/80 backdrop-blur-2xl border-3 border-black rounded-[12px] p-6 sm:p-8 shadow-[6px_7px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.95)]">
              <div className="space-y-6">
                {/* Before: Chaotic */}
                <div className="bg-white/90 border-2 border-black rounded-[8px] p-4 shadow-[3px_4px_0px_#000]">
                  <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                    <span className="font-mono text-xs font-bold text-[#ff3377] uppercase flex items-center gap-1.5">
                      <Repeat className="w-4 h-4" /> WITHOUT SPLITSIMPLE (6 TANGLED IOUs)
                    </span>
                    <span className="px-2 py-0.5 bg-rose-100 text-[#ff3377] font-mono text-[10px] font-bold border border-black rounded-[4px]">
                      HIGH FRICTION
                    </span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs text-neutral-700">
                    <p className="flex justify-between"><span>• Chandan owes Pranav</span> <span>₹2,400.00</span></p>
                    <p className="flex justify-between"><span>• Pranav owes Chiranjeevi</span> <span>₹5,800.00</span></p>
                    <p className="flex justify-between"><span>• Gagan owes Chandan</span> <span>₹1,200.00</span></p>
                    <p className="flex justify-between"><span>• Rahul owes Gagan</span> <span>₹3,500.00</span></p>
                    <p className="flex justify-between"><span>• Chandan owes Chiranjeevi</span> <span>₹4,100.00</span></p>
                  </div>
                </div>

                {/* After: Clean */}
                <div className="bg-[#0e0f17]/95 backdrop-blur-xl text-white border-2 border-black rounded-[8px] p-4 shadow-[4px_5px_0px_#000]">
                  <div className="flex items-center justify-between mb-3 border-b-2 border-white/20 pb-2">
                    <span className="font-mono text-xs font-bold text-[#ccff00] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> WITH SPLITSIMPLE GREEDY ENGINE
                    </span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#d8ff26] to-[#b8f000] text-black font-mono text-[10px] font-bold border border-black rounded-[4px]">
                      2 DIRECT PAYMENTS
                    </span>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 bg-white/10 border border-white/20 rounded-[6px] flex items-center justify-between">
                      <span>Chandan R pays Chiranjeevi S</span>
                      <span className="font-bold text-[#ccff00]">₹8,550.00</span>
                    </div>
                    <div className="p-2.5 bg-white/10 border border-white/20 rounded-[6px] flex items-center justify-between">
                      <span>Gagan K pays Chiranjeevi S</span>
                      <span className="font-bold text-[#ccff00]">₹4,200.00</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 font-mono text-[11px] text-neutral-400 flex items-center justify-between">
                    <span>Result: Everyone settled to zero</span>
                    <span className="text-[#00c853] font-bold">✓ 4 transfers eliminated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        7. THREE PILLARS (SKEUO-GLASS CARDS)
      */}
      <section id="features" className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="px-3 py-1 bg-black text-white text-xs font-mono font-bold uppercase border-2 border-black rounded-[6px] shadow-[2px_3px_0px_#ccff00]">
              CORE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-black uppercase tracking-tight">
              ENGINEERED LIKE A FINANCIAL DESK.
            </h2>
            <p className="text-sm font-display text-neutral-700">
              Clean separation between ledgers, member contributions, and settlement executions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-[#d8ff26]/85 to-[#b8f000]/85 backdrop-blur-xl border-3 border-black p-6 rounded-[12px] shadow-[6px_7px_0px_#000,inset_0_2px_1px_rgba(255,255,255,0.8)] flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_9px_0px_#000] transition-all">
              <div>
                <div className="w-12 h-12 bg-white/90 border-2 border-black rounded-[8px] flex items-center justify-center text-black mb-6 shadow-[3px_4px_0px_#000]">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-black text-black uppercase">
                  Integer Paise Accounting
                </h3>
                <p className="text-xs font-mono text-neutral-900 mt-2 leading-relaxed">
                  Every split, custom share, and reimbursement is handled in integer paise.
                  Never worry about fractions of a rupee drifting across months of house tabs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black font-mono text-xs font-bold uppercase">
                [ 100 PAISE = ₹1.00 EXACT ]
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-[#ff4d8d]/85 to-[#e62266]/85 backdrop-blur-xl text-white border-3 border-black p-6 rounded-[12px] shadow-[6px_7px_0px_#000,inset_0_2px_1px_rgba(255,255,255,0.5)] flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_9px_0px_#000] transition-all">
              <div>
                <div className="w-12 h-12 bg-black border-2 border-white rounded-[8px] flex items-center justify-center text-[#ccff00] mb-6 shadow-[3px_4px_0px_#fff]">
                  <Handshake className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-black text-white uppercase">
                  Greedy Debt Minimization
                </h3>
                <p className="text-xs font-mono text-neutral-100 mt-2 leading-relaxed">
                  Instantly collapses multi-person circular debts into the minimum possible transfers.
                  Save your group from sending 15 confused UPI payments after a vacation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-white/30 font-mono text-xs font-bold uppercase text-[#ccff00]">
                [ MIN-FLOW GRAPH ALGORITHM ]
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-[#33f5ff]/85 to-[#00d9e6]/85 backdrop-blur-xl border-3 border-black p-6 rounded-[12px] shadow-[6px_7px_0px_#000,inset_0_2px_1px_rgba(255,255,255,0.8)] flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_9px_0px_#000] transition-all">
              <div>
                <div className="w-12 h-12 bg-white/90 border-2 border-black rounded-[8px] flex items-center justify-center text-black mb-6 shadow-[3px_4px_0px_#000]">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-black text-black uppercase">
                  Multi-Category Analytics
                </h3>
                <p className="text-xs font-mono text-neutral-900 mt-2 leading-relaxed">
                  Visualize group spending across Rent, Groceries, Dining, Travel, and Utilities.
                  Export transparent ledger summaries whenever a flatmate moves out.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black font-mono text-xs font-bold uppercase">
                [ INTERACTIVE RECHARTS ]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        8. FREQUENTLY ASKED QUESTIONS
      */}
      <section id="faq" className="py-20 bg-white/70 backdrop-blur-xl border-t-3 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="px-3 py-1 bg-gradient-to-r from-[#ffc837] to-[#ff9900] border-2 border-black text-xs font-mono font-bold uppercase rounded-[6px] shadow-[2px_3px_0px_#000]">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-black uppercase">
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
                className="border-2 sm:border-3 border-black rounded-[8px] overflow-hidden bg-white/80 backdrop-blur-md shadow-[3px_4px_0px_#000]"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm sm:text-base font-display font-bold text-black hover:bg-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="w-6 h-6 rounded-[6px] bg-gradient-to-b from-[#d8ff26] to-[#b8f000] border-2 border-black flex items-center justify-center font-mono font-bold text-sm shrink-0 ml-2 shadow-[1px_1px_0px_#000]">
                    {activeFaq === idx ? '−' : '+'}
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 font-mono text-xs text-neutral-800 leading-relaxed border-t-2 border-black pt-3 bg-white/90"
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

      {/* 
        9. BOTTOM SKEUO-GLASS CTA DESK
      */}
      <section className="py-20 bg-gradient-to-r from-[#d8ff26] via-[#c6f800] to-[#b8f000] text-black border-t-3 border-black">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-block px-4 py-1 bg-black text-white text-xs font-mono font-bold uppercase rounded-[6px] border-2 border-black shadow-[3px_4px_0px_#ffffff]">
            READY TO SIMPLIFY GROUP TABS?
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase leading-tight">
            STOP ARGUING OVER SHARED BILLS. <br />
            START SETTLING WITH MATHEMATICAL CERTAINTY.
          </h2>
          <p className="text-base font-display font-medium text-neutral-900 max-w-xl mx-auto">
            Try the demo workspace in 5 seconds or create a new flat ledger for your roommates.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleExploreDemo}
              disabled={loadingDemo}
              className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-neutral-900 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black rounded-[8px] shadow-[4px_5px_0px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              EXPLORE LIVE DEMO <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white/90 hover:bg-white text-black border-3 border-black font-display font-black text-xs uppercase tracking-wider rounded-[8px] shadow-[4px_5px_0px_#000000] transition-all cursor-pointer">
                CREATE FREE ACCOUNT
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        10. FOOTER
      */}
      <footer className="bg-black text-white py-12 border-t-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[6px] bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black border-2 border-black flex items-center justify-center font-display font-black text-sm">
              S
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">SplitSimple</span>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                Skeuo-Neu-Brutalist Glass Expense Desk
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-bold uppercase">
            <a href="#simulator" className="hover:text-[#ccff00] transition-colors">
              Demo Desk
            </a>
            <a href="#engine" className="hover:text-[#ff3377] transition-colors">
              Debt Engine
            </a>
            <a href="#features" className="hover:text-[#00f0ff] transition-colors">
              Features
            </a>
            <Link to="/login" className="hover:text-[#ff7700] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-[#a855f7] transition-colors">
              Register
            </Link>
          </div>

          <div className="text-[11px] text-neutral-400">
            © {new Date().getFullYear()} SplitSimple · Built for Roommates & Friends
          </div>
        </div>
      </footer>
    </div>
  );
}
