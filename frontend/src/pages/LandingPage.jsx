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
  Smile,
  Flame,
  Award,
  CircleDot,
  CheckCircle2,
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
    folderColor: 'bg-[#ccff00]',
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
    folderColor: 'bg-[#ff529a]',
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
    folderColor: 'bg-[#00f0ff]',
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
      toast.success('★ Entered Demo Workspace!', {
        icon: '⚡',
        style: {
          border: '2px solid black',
          borderRadius: '4px',
          boxShadow: '4px 4px 0px #000',
          background: '#ccff00',
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
            borderRadius: '4px',
            boxShadow: '4px 4px 0px #000',
            background: '#00f0ff',
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
    <div className="min-h-screen bg-[#faf7ee] text-black overflow-x-hidden selection:bg-[#ccff00] selection:text-black antialiased">
      {/* 
        1. SURREAL BRUTALIST TICKER BANNER
      */}
      <div className="bg-black text-white border-b-2 border-black py-1.5 overflow-hidden select-none">
        <div className="flex items-center gap-8 text-xs font-mono font-bold tracking-widest animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[#ccff00]">
            <Sparkles className="w-4 h-4" /> SPLITSIMPLE NEO-BRUTALIST EDITION
          </span>
          <span className="text-[#ff529a]">★</span>
          <span className="text-[#00f0ff]">COLLAPSE 10 IOUs INTO 2 DIRECT PAYMENTS</span>
          <span className="text-[#ccff00]">★</span>
          <span className="text-[#ff8800]">100% INTEGER PAISE ACCURACY (0.00% DRIFT)</span>
          <span className="text-[#ff529a]">★</span>
          <span className="text-white">NO FLOATING-POINT ERRORS</span>
          <span className="text-[#00f0ff]">★</span>
          <span className="text-[#ccff00]">GREEDY GRAPH OPTIMIZER ACTIVATED</span>
        </div>
      </div>

      {/* 
        2. STICKY NEO-BRUTALIST HEADER
      */}
      <header className="sticky top-0 z-50 bg-[#fffdf8] border-b-3 border-black shadow-[0_4px_0_#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[4px] bg-[#ccff00] text-black border-2 border-black flex items-center justify-center font-display font-black text-base shadow-[2px_2px_0px_#000000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_#000000] transition-all">
              S
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-display font-extrabold tracking-tight text-black leading-none">
                  SplitSimple
                </span>
                <span className="px-1.5 py-0.2 bg-[#ff529a] text-white text-[9px] font-mono font-bold uppercase rounded-[2px] border border-black shadow-[1px_1px_0px_#000000]">
                  v2.4
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-600 mt-0.5">
                Surreal Expense Desk
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-bold uppercase tracking-wider">
            <a href="#simulator" className="text-black hover:text-[#ff529a] transition-colors">
              Interactive Demo
            </a>
            <a href="#engine" className="text-black hover:text-[#00f0ff] transition-colors">
              Debt Engine
            </a>
            <a href="#features" className="text-black hover:text-[#ff8800] transition-colors">
              Features
            </a>
            <a href="#faq" className="text-black hover:text-[#b388ff] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-[#faf7ee] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              Sign In
            </Link>
            <button
              onClick={handleExploreDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-display font-bold uppercase tracking-wider bg-[#ccff00] text-black border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer"
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
            className="md:hidden p-2 bg-[#ccff00] text-black border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000000]"
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
              className="md:hidden bg-[#fffdf8] border-t-2 border-black px-4 py-4 space-y-3"
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
                  className="w-full py-2.5 font-display text-xs font-bold uppercase bg-[#ccff00] text-black border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000000]"
                >
                  Explore Demo Workspace
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 font-display text-xs font-bold uppercase text-center bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000000]"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 
        3. HERO SECTION (NEO-BRUTALISM + SURREAL ART)
      */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Floating Surreal Doodles */}
        <div className="absolute top-10 left-6 sm:left-16 pointer-events-none opacity-80 animate-surreal-float">
          <div className="w-14 h-14 rounded-full bg-[#ff529a] border-3 border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center font-display font-black text-xl text-white rotate-12">
            ₹
          </div>
        </div>
        <div className="absolute top-24 right-8 sm:right-24 pointer-events-none opacity-80 animate-surreal-float" style={{ animationDelay: '1.5s' }}>
          <div className="px-3 py-1 bg-[#00f0ff] border-2 border-black shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs -rotate-6">
            ★ PAISE ACCURATE
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#ccff00] border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-mono font-bold uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
              <span>NEO-BRUTALIST EXPENSE DESK</span>
              <span className="text-black/40">|</span>
              <span className="text-[#ff529a] font-black">ZERO ROUNDING DRIFT</span>
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
                <span className="relative z-10 px-3 bg-[#ccff00] border-3 border-black shadow-[5px_5px_0px_#000000] -rotate-1 inline-block">
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
              Track flatmates, travel tabs, and group dinners on a surreal tactile ledger.
              The greedy debt engine collapses messy circular debts into minimal 1-hop UPI transfers.
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
                className="w-full sm:w-auto px-8 py-4 bg-[#ccff00] hover:bg-[#bbf000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#000000] text-black font-display font-black text-sm uppercase tracking-wider border-3 border-black rounded-[4px] shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                <button className="w-full px-8 py-4 bg-[#ff529a] hover:bg-[#f03f89] active:translate-x-1 active:translate-y-1 text-white font-display font-black text-sm uppercase tracking-wider border-3 border-black rounded-[4px] shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Create Free Account
                </button>
              </Link>
            </motion.div>

            {/* Stickers / Trust Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold"
            >
              <div className="px-3 py-1 bg-white border-2 border-black rounded-[3px] shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 rotate-1">
                <Check className="w-4 h-4 text-[#00c853]" /> 3 PRELOADED GROUPS
              </div>
              <div className="px-3 py-1 bg-[#00f0ff] border-2 border-black rounded-[3px] shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 -rotate-1">
                <Check className="w-4 h-4 text-black" /> 22 REAL EXPENSES
              </div>
              <div className="px-3 py-1 bg-[#ffb703] border-2 border-black rounded-[3px] shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 rotate-2">
                <Check className="w-4 h-4 text-black" /> 1-CLICK UPI SETTLE
              </div>
            </motion.div>
          </div>

          {/* 
            4. TACTILE INTERACTIVE WORKSPACE DESK (MOCKUP)
          */}
          <motion.div
            id="simulator"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full mt-14"
          >
            {/* The Outer Paper Desk Container */}
            <div className="bg-[#ffffff] border-3 sm:border-4 border-black rounded-[6px] shadow-[8px_8px_0px_#000000] overflow-hidden">
              {/* Desk Chrome Header */}
              <div className="bg-[#fffdf8] border-b-3 border-black px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff3b30] border border-black shadow-[1px_1px_0px_#000]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffcc00] border border-black shadow-[1px_1px_0px_#000]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#00c853] border border-black shadow-[1px_1px_0px_#000]" />
                  <span className="font-mono text-xs font-bold text-black ml-3">
                    splitsimple.desk / {activeTab}
                  </span>
                </div>

                {/* Tab Folder Switcher */}
                <div className="flex items-center gap-2">
                  {Object.values(PREVIEW_DATA).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 border-2 border-black font-display font-bold text-xs uppercase transition-all rounded-[3px] cursor-pointer ${
                        activeTab === tab.id
                          ? `${tab.folderColor} text-black shadow-[3px_3px_0px_#000000] -translate-y-0.5`
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workspace Content */}
              <div className="p-5 sm:p-8 bg-[#faf7ee]">
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
                      <div className="bg-white border-3 border-black p-5 rounded-[4px] shadow-[4px_4px_0px_#000000] relative">
                        {/* Washi Tape */}
                        <div className="absolute -top-3 left-8 w-16 h-4 bg-[#ccff00] border border-black/40 rotate-2 pointer-events-none" />

                        <div className="flex items-center justify-between gap-3 mb-1">
                          <h2 className="text-2xl font-display font-black text-black uppercase">
                            {preview.name}
                          </h2>
                          <span className="px-2.5 py-0.5 bg-[#ff529a] text-white text-[10px] font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000000]">
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
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#faf7ee] border-2 border-black rounded-[3px] text-xs font-mono font-bold shadow-[2px_2px_0px_#000000]"
                              >
                                <span>{m.name}</span>
                                <span className="text-[10px] text-neutral-500 font-normal">({m.role})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recent Transactions List */}
                      <div className="bg-white border-3 border-black rounded-[4px] shadow-[4px_4px_0px_#000000] overflow-hidden">
                        <div className="bg-[#ccff00] px-4 py-2.5 border-b-2 border-black flex items-center justify-between font-mono text-xs font-bold uppercase">
                          <span>Group Expenses</span>
                          <span>Total: {formatCurrency(preview.totalSpent)}</span>
                        </div>
                        <div className="divide-y-2 divide-black">
                          {preview.expenses.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 hover:bg-[#fffef7] transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[3px] bg-[#00f0ff] border-2 border-black flex items-center justify-center font-mono font-bold text-xs shadow-[2px_2px_0px_#000000]">
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
                    <div className="lg:col-span-5 bg-[#000000] text-white border-3 border-black rounded-[4px] p-6 flex flex-col justify-between shadow-[6px_6px_0px_#000000]">
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
                          <span className="px-2 py-1 bg-[#ff529a] text-white text-[10px] font-mono font-bold uppercase border border-white shadow-[2px_2px_0px_#fff]">
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
                                className={`p-3.5 rounded-[4px] border-2 transition-all ${
                                  isSettled
                                    ? 'bg-neutral-900 border-[#00c853] opacity-80'
                                    : 'bg-[#1a1a1a] border-white/30 hover:border-white'
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
                                    className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-[3px] border-2 transition-all cursor-pointer ${
                                      isSettled
                                        ? 'bg-[#00c853] text-black border-black shadow-[2px_2px_0px_#fff]'
                                        : 'bg-[#ccff00] text-black border-black shadow-[2px_2px_0px_#fff] hover:bg-[#bbf000]'
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
                          className="w-full py-3 bg-[#ccff00] hover:bg-[#bbf000] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#ffffff] hover:shadow-[5px_5px_0px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
        5. STATS BAND (NEO-BRUTALIST NUMBERS)
      */}
      <section className="bg-black text-white border-y-3 border-black py-12 px-4 sm:px-6 lg:px-8">
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

          <div className="border-l-3 border-[#ff529a] pl-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Transfer Reduction
            </p>
            <p className="text-3xl sm:text-4xl font-display font-black text-[#ff529a]">
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

          <div className="border-l-3 border-[#ff8800] pl-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Settlement Engine
            </p>
            <p className="text-3xl sm:text-4xl font-display font-black text-[#ff8800]">
              INSTANT UPI
            </p>
            <p className="font-mono text-xs text-neutral-400 mt-1">1-click ledger clearance</p>
          </div>
        </div>
      </section>

      {/* 
        6. THE DEBT ENGINE COMPARISON (SURREAL WEB OF IOUs VS GREEDY FLOW)
      */}
      <section id="engine" className="py-20 md:py-24 bg-white border-b-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 bg-[#ccff00] border-2 border-black rounded-[3px] text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_#000]">
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
                <div className="flex items-start gap-3 p-3 bg-[#faf7ee] border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000]">
                  <div className="w-7 h-7 bg-[#ccff00] border-2 border-black flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase text-xs">Global Net Balance Calculation</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Every participant gets a single number: Total Paid − Total Owed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#faf7ee] border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000]">
                  <div className="w-7 h-7 bg-[#ff529a] text-white border-2 border-black flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-black uppercase text-xs">Greedy Flow Pairing</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Matches the max debtor with max creditor. Cuts transfers by up to 75%.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#faf7ee] border-2 border-black rounded-[4px] shadow-[3px_3px_0px_#000]">
                  <div className="w-7 h-7 bg-[#00f0ff] border-2 border-black flex items-center justify-center font-bold text-xs shrink-0">
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
            <div className="lg:col-span-6 bg-[#faf7ee] border-3 border-black rounded-[6px] p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
              <div className="space-y-6">
                {/* Before: Chaotic */}
                <div className="bg-white border-2 border-black rounded-[4px] p-4 shadow-[3px_3px_0px_#000]">
                  <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                    <span className="font-mono text-xs font-bold text-[#ff3b30] uppercase flex items-center gap-1.5">
                      <Repeat className="w-4 h-4" /> WITHOUT SPLITSIMPLE (6 TANGLED IOUs)
                    </span>
                    <span className="px-2 py-0.5 bg-rose-100 text-[#ff3b30] font-mono text-[10px] font-bold border border-black">
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
                <div className="bg-black text-white border-2 border-black rounded-[4px] p-4 shadow-[4px_4px_0px_#000]">
                  <div className="flex items-center justify-between mb-3 border-b-2 border-white/20 pb-2">
                    <span className="font-mono text-xs font-bold text-[#ccff00] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> WITH SPLITSIMPLE GREEDY ENGINE
                    </span>
                    <span className="px-2 py-0.5 bg-[#ccff00] text-black font-mono text-[10px] font-bold border border-black">
                      2 DIRECT PAYMENTS
                    </span>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 bg-neutral-900 border border-white/20 rounded-[3px] flex items-center justify-between">
                      <span>Chandan R pays Chiranjeevi S</span>
                      <span className="font-bold text-[#ccff00]">₹8,550.00</span>
                    </div>
                    <div className="p-2.5 bg-neutral-900 border border-white/20 rounded-[3px] flex items-center justify-between">
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
        7. THREE KEY PILLARS (BRUTALIST CARDS)
      */}
      <section id="features" className="py-20 md:py-24 bg-[#faf7ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="px-3 py-1 bg-black text-white text-xs font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#ccff00]">
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
            {/* Pillar 1 */}
            <div className="bg-[#ccff00] border-3 border-black p-6 rounded-[4px] shadow-[6px_6px_0px_#000000] flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all">
              <div>
                <div className="w-12 h-12 bg-white border-2 border-black rounded-[4px] flex items-center justify-center text-black mb-6 shadow-[3px_3px_0px_#000]">
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

            {/* Pillar 2 */}
            <div className="bg-[#ff529a] text-white border-3 border-black p-6 rounded-[4px] shadow-[6px_6px_0px_#000000] flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all">
              <div>
                <div className="w-12 h-12 bg-black border-2 border-white rounded-[4px] flex items-center justify-center text-[#ccff00] mb-6 shadow-[3px_3px_0px_#fff]">
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

            {/* Pillar 3 */}
            <div className="bg-[#00f0ff] border-3 border-black p-6 rounded-[4px] shadow-[6px_6px_0px_#000000] flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all">
              <div>
                <div className="w-12 h-12 bg-white border-2 border-black rounded-[4px] flex items-center justify-center text-black mb-6 shadow-[3px_3px_0px_#000]">
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
        8. FREQUENTLY ASKED QUESTIONS (ACCORDION)
      */}
      <section id="faq" className="py-20 bg-white border-t-3 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="px-3 py-1 bg-[#ffb703] border-2 border-black text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_#000]">
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
                className="border-2 sm:border-3 border-black rounded-[4px] overflow-hidden bg-[#faf7ee] shadow-[3px_3px_0px_#000]"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm sm:text-base font-display font-bold text-black hover:bg-[#fffef7] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="w-6 h-6 rounded-[3px] bg-[#ccff00] border-2 border-black flex items-center justify-center font-mono font-bold text-sm shrink-0 ml-2">
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
                      className="px-4 pb-4 font-mono text-xs text-neutral-800 leading-relaxed border-t-2 border-black pt-3 bg-white"
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
        9. BOTTOM SURREAL CTA DESK
      */}
      <section className="py-20 bg-[#ccff00] text-black border-t-3 border-black">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-block px-4 py-1 bg-black text-white text-xs font-mono font-bold uppercase rounded-[3px] border-2 border-black shadow-[3px_3px_0px_#ffffff]">
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
              className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-neutral-900 text-white font-display font-black text-xs uppercase tracking-wider border-3 border-black rounded-[4px] shadow-[4px_4px_0px_#ffffff] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              EXPLORE LIVE DEMO <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white hover:bg-neutral-100 text-black border-3 border-black font-display font-black text-xs uppercase tracking-wider rounded-[4px] shadow-[4px_4px_0px_#000000] transition-all cursor-pointer">
                CREATE FREE ACCOUNT
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        10. NEO-BRUTALIST FOOTER
      */}
      <footer className="bg-black text-white py-12 border-t-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[4px] bg-[#ccff00] text-black border-2 border-black flex items-center justify-center font-display font-black text-sm">
              S
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">SplitSimple</span>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                Surreal Brutalist Expense Desk
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-bold uppercase">
            <a href="#simulator" className="hover:text-[#ccff00] transition-colors">
              Demo Desk
            </a>
            <a href="#engine" className="hover:text-[#ff529a] transition-colors">
              Debt Engine
            </a>
            <a href="#features" className="hover:text-[#00f0ff] transition-colors">
              Features
            </a>
            <Link to="/login" className="hover:text-[#ff8800] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-[#b388ff] transition-colors">
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
