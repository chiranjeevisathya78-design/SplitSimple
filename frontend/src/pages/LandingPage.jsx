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
    desc: 'Indiranagar flat ledger — Monthly rent, utilities, and daily provisions',
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
    debtReduction: '6 circular debts collapsed into 2 single-hop repayments',
  },
  goa: {
    name: 'Goa Trip 2026',
    desc: 'Beach villa, scooter rentals, and scuba expeditions',
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
    debtReduction: '10 potential IOUs resolved into 3 clean peer payments',
  },
  college: {
    name: 'College Friends',
    desc: 'IMAX movies, burger nights, turf football, and cafe catchups',
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
    debtReduction: 'Streamlined into 2 transfers with zero balance drift',
  },
};

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('bangalore');
  const [heroEmail, setHeroEmail] = useState('');

  // 1-Click Demo Explorer
  const handleExploreDemo = async () => {
    setLoadingDemo(true);
    try {
      await login('chiranjeevi@example.com', 'password123');
      toast.success('Connected to SplitSimple Demo Workspace');
      navigate('/dashboard');
    } catch {
      toast.error('Directing to login desk...');
      navigate('/login');
    } finally {
      setLoadingDemo(false);
    }
  };

  const preview = PREVIEW_DATA[activePreviewTab];

  return (
    <div className="min-h-screen bg-[#f4f2f0] text-[#0c0a08] overflow-x-hidden selection:bg-[#e4f222] selection:text-[#0c0a08]">
      {/* 1. Top Announcement Bar (Ramp 40px Height) */}
      <div className="h-10 bg-white border-b border-[#e5e7eb] px-4 flex items-center justify-between text-xs text-[#6d6c6b] font-normal">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]" />
            <span>Greedy settlement algorithm reduces multi-party group debts by up to 75%</span>
            <span className="hidden sm:inline">·</span>
            <a href="#settlement" className="text-[#0c0a08] underline hidden sm:inline">
              Learn how it works
            </a>
          </div>
          <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] hidden md:inline">
            Integer Paise Precision
          </span>
        </div>
      </div>

      {/* 2. Ramp Sticky Navigation Bar (62px, Paper #ffffff, Hairline Border #e5e7eb) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] shadow-[rgba(255,255,255,0.6)_0px_0px_2px_0px_inset]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center font-normal text-xs">
              S
            </div>
            <span className="text-base font-normal tracking-tight text-[#0c0a08]">
              SplitSimple
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-normal text-[#6d6c6b]">
            <a href="#preview" className="hover:text-[#0c0a08] transition-colors">
              Product
            </a>
            <a href="#settlement" className="hover:text-[#0c0a08] transition-colors">
              Settlement Engine
            </a>
            <a href="#features" className="hover:text-[#0c0a08] transition-colors">
              Ledger
            </a>
            <a href="#benchmarks" className="hover:text-[#0c0a08] transition-colors">
              Accuracy
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <button className="px-3 py-1.5 text-sm text-[#0c0a08] rounded-[6px] hover:bg-[#f4f2f0] transition-colors font-normal">
                Sign in
              </button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              loading={loadingDemo}
              onClick={handleExploreDemo}
              className="text-xs"
            >
              Explore Demo
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#0c0a08] p-1.5 rounded-[6px] hover:bg-[#f4f2f0]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#e5e7eb] px-6 py-4 space-y-3">
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-[#6d6c6b] hover:text-[#0c0a08]"
            >
              Product
            </a>
            <a
              href="#settlement"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-[#6d6c6b] hover:text-[#0c0a08]"
            >
              Settlement Engine
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-[#6d6c6b] hover:text-[#0c0a08]"
            >
              Ledger
            </a>
            <div className="pt-3 border-t border-[#e5e7eb] flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                loading={loadingDemo}
                onClick={handleExploreDemo}
                className="w-full justify-center"
              >
                Explore Live Demo
              </Button>
              <Link to="/login" className="w-full">
                <button className="w-full h-11 rounded-[6px] border border-[#0c0a08] text-xs font-normal text-[#0c0a08]">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. Hero Section (Bone Canvas #f4f2f0, Left-Aligned 64px Editorial Headline) */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Micro-label kicker */}
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] font-normal">
              Shared Expense Management · Intelligent Settlement Desk
            </span>
          </div>

          {/* Left-Aligned Headline (Tight Leading 1.0, Weight 400) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] leading-none tracking-tight text-[#0c0a08] font-normal">
                Shared expenses. <br />
                <span className="underline decoration-[#e4f222] decoration-4 underline-offset-8">
                  Zero awkward calculations.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#6d6c6b] font-normal leading-relaxed max-w-2xl">
                Track roommates, travel tabs, and group dinners with integer precision. The greedy debt engine eliminates circular transfers in one click.
              </p>
            </div>

            {/* Composite CTA: Input + Highlighter Button */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <Button
                  size="lg"
                  variant="primary"
                  loading={loadingDemo}
                  onClick={handleExploreDemo}
                  className="w-full"
                >
                  Explore Demo Workspace
                </Button>
                <Link to="/register" className="w-full">
                  <SecondaryButton size="lg" className="w-full">
                    Create Free Account
                  </SecondaryButton>
                </Link>
              </div>
              <p className="text-[10px] text-[#6d6c6b] uppercase tracking-[0.018em]">
                Preloaded with 3 groups · 22 expenses · No credit card
              </p>
            </div>
          </div>

          {/* Product UI Preview (Chrome browser frame, hairline border, shadow-free) */}
          <div id="preview" className="mt-16 bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-8">
            {/* Browser chrome header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#e5e7eb]" />
                <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] ml-2">
                  splitsimple.app/workspace
                </span>
              </div>

              {/* Group Workspace Switcher Tabs */}
              <div className="flex items-center gap-1.5 bg-[#f4f2f0] p-1 rounded-[6px]">
                {Object.keys(PREVIEW_DATA).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActivePreviewTab(key)}
                    className={`px-3 py-1 text-xs rounded-[6px] transition-colors font-normal ${
                      activePreviewTab === key
                        ? 'bg-white text-[#0c0a08] border border-[#e5e7eb]'
                        : 'text-[#6d6c6b] hover:text-[#0c0a08]'
                    }`}
                  >
                    {PREVIEW_DATA[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Workspace Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Group Summary & Expenses */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-normal text-[#0c0a08] tracking-tight">
                      {preview.name}
                    </h3>
                    <span className="bg-[#e4f222] text-[#0c0a08] px-2 py-0.5 rounded-[6px] text-[10px] uppercase tracking-[0.018em] font-normal">
                      Active Ledger
                    </span>
                  </div>
                  <p className="text-xs text-[#6d6c6b]">{preview.desc}</p>
                </div>

                {/* Member avatars */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                    Members:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {preview.members.map((name) => (
                      <span
                        key={name}
                        className="text-xs px-2.5 py-1 rounded-[6px] bg-[#f4f2f0] text-[#0c0a08] border border-[#e5e7eb]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expense List */}
                <div className="border border-[#e5e7eb] rounded-[10px] divide-y divide-[#e5e7eb] bg-white">
                  {preview.expenses.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-sm font-normal text-[#0c0a08]">{item.title}</p>
                        <p className="text-[11px] text-[#6d6c6b] mt-0.5">
                          Paid by {item.paidBy} · {item.category}
                        </p>
                      </div>
                      <span className="text-sm text-[#0c0a08] font-normal">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Smart Settlement Optimizer */}
              <div className="lg:col-span-5 bg-[#1a1919] text-white rounded-[16px] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                        Settlement Engine
                      </span>
                      <h4 className="text-lg font-normal text-white tracking-tight">
                        Optimized Repayments
                      </h4>
                    </div>
                    <span className="bg-[#e4f222] text-[#0c0a08] text-[10px] uppercase tracking-[0.018em] px-2 py-0.5 rounded-[6px]">
                      Greedy
                    </span>
                  </div>

                  <p className="text-xs text-[#6d6c6b] mb-4">
                    {preview.debtReduction}
                  </p>

                  <div className="space-y-2.5">
                    {preview.settlementPlan.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 border border-white/10 rounded-[10px] p-3 flex items-center justify-between"
                      >
                        <div className="text-xs text-[#6d6c6b]">
                          <span className="text-white">{step.from}</span>
                          <span className="mx-1.5 text-[#e4f222]">→ pays →</span>
                          <span className="text-white">{step.to}</span>
                        </div>
                        <span className="text-sm text-[#e4f222] font-normal">
                          {formatCurrency(step.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#6d6c6b]">Net Group Volume:</span>
                  <span className="text-xl text-white font-normal">
                    {formatCurrency(preview.totalSpent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ramp Live Counter Ticker (#1a1919 Dark Band, Uppercase Ash Micro-Labels) */}
      <section className="bg-[#1a1919] text-white py-12 px-6 border-y border-white/10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1">
              Transactions Settled
            </p>
            <p className="text-2xl sm:text-3xl font-normal text-white">
              ₹1.53 Lakh+
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1">
              Debt Step Reduction
            </p>
            <p className="text-2xl sm:text-3xl font-normal text-[#e4f222]">
              -75% Transactions
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1">
              Rounding Precision
            </p>
            <p className="text-2xl sm:text-3xl font-normal text-white">
              0.00% Drift (Paise)
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1">
              Active Desks
            </p>
            <p className="text-2xl sm:text-3xl font-normal text-white">
              100% Client Audited
            </p>
          </div>
        </div>
      </section>

      {/* 5. Editorial Feature Grid (Content Cards: 16px radius, #ffffff, 1px Hairline #e5e7eb) */}
      <section id="features" className="py-20 md:py-28 px-6 bg-[#f4f2f0]">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
              Platform Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a08] tracking-tight mt-1">
              Engineered like an editorial trading desk.
            </h2>
            <p className="text-sm text-[#6d6c6b] mt-2 max-w-xl">
              Clean separation between ledgers, member contributions, and settlement executions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-[6px] bg-[#f4f2f0] flex items-center justify-center text-[#0c0a08] mb-4">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-normal text-[#0c0a08] tracking-tight">
                  Integer Paise Accounting
                </h3>
                <p className="text-xs text-[#6d6c6b] mt-2 leading-relaxed">
                  Every split, custom share, and reimbursement is handled in integer paise, preventing fractional currency drift or floating-point rounding bugs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                Standard Banking Math
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-[6px] bg-[#e4f222] flex items-center justify-center text-[#0c0a08] mb-4">
                  <Handshake className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-normal text-[#0c0a08] tracking-tight">
                  Greedy Debt Minimization
                </h3>
                <p className="text-xs text-[#6d6c6b] mt-2 leading-relaxed">
                  Instead of tracking who paid whom across 20 dinners, our algorithm calculates each member's net position and generates the minimum viable repayment paths.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-[10px] uppercase tracking-[0.018em] text-[#0c0a08]">
                Minimal Transfers
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-[6px] bg-[#f4f2f0] flex items-center justify-center text-[#0c0a08] mb-4">
                  <PieChart className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-normal text-[#0c0a08] tracking-tight">
                  Multi-Category Analytics
                </h3>
                <p className="text-xs text-[#6d6c6b] mt-2 leading-relaxed">
                  Analyze group spending across Rent, Groceries, Dining, Travel, and Utilities. Export balances and review spending trends over time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e5e7eb] text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                Interactive Recharts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Smart Settlement Deep Dive */}
      <section id="settlement" className="py-20 md:py-28 px-6 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                The Mathematics of Debt Elimination
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#0c0a08] tracking-tight leading-tight">
                From a web of IOUs <br />
                to direct bank payments.
              </h2>
              <p className="text-sm text-[#6d6c6b] leading-relaxed">
                When 5 roommates split rent, groceries, and dining over months, manual calculations require up to 10 cross-payments. SplitSimple computes the global net balance for each person, matches max creditors with max debtors, and settles the group in at most N - 1 transactions.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-normal text-[#0c0a08]">No circular transaction loops</h4>
                    <p className="text-xs text-[#6d6c6b]">No one pays person A only for person A to pay person B.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-normal text-[#0c0a08]">1-Click Settlement Recording</h4>
                    <p className="text-xs text-[#6d6c6b]">Once paid via UPI or bank transfer, click "Mark as Settled" to clear the ledger.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="primary" size="md" onClick={handleExploreDemo}>
                  Try Smart Settlement Now
                </Button>
              </div>
            </div>

            {/* Visual comparison box */}
            <div className="lg:col-span-6 bg-[#f4f2f0] rounded-[16px] border border-[#e5e7eb] p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                      Without SplitSimple (Manual)
                    </span>
                    <span className="text-xs text-[#b91c1c] font-normal">6 Separate IOUs</span>
                  </div>
                  <div className="p-3 bg-white rounded-[10px] border border-[#e5e7eb] space-y-1.5 text-xs text-[#6d6c6b]">
                    <p>• Chandan owes Pranav ₹2,400</p>
                    <p>• Pranav owes Chiranjeevi ₹5,800</p>
                    <p>• Gagan owes Chandan ₹1,200</p>
                    <p>• Rahul owes Gagan ₹3,500</p>
                    <p>• Chandan owes Chiranjeevi ₹4,100</p>
                    <p>• Rahul owes Chiranjeevi ₹1,900</p>
                  </div>
                </div>

                <div className="border-t border-[#e5e7eb] pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.018em] text-[#0c0a08]">
                      With SplitSimple Smart Settlement
                    </span>
                    <span className="text-xs bg-[#e4f222] text-[#0c0a08] px-2 py-0.5 rounded-[6px]">
                      2 Direct Payments
                    </span>
                  </div>
                  <div className="p-3 bg-[#1a1919] text-white rounded-[10px] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Chandan R pays Chiranjeevi S</span>
                      <span className="text-[#e4f222] font-normal">₹8,550.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Gagan K pays Chiranjeevi S</span>
                      <span className="text-[#e4f222] font-normal">₹4,200.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer (Obsidian #1a1919) */}
      <footer className="bg-[#1a1919] text-white py-14 px-6 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center font-normal text-xs">
              S
            </div>
            <div>
              <span className="text-sm font-normal text-white">SplitSimple</span>
              <p className="text-[10px] text-[#6d6c6b] uppercase tracking-[0.018em] mt-0.5">
                Editorial Expense Desk
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#6d6c6b]">
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Register
            </Link>
            <a href="#preview" className="hover:text-white transition-colors">
              Preview
            </a>
            <a href="#settlement" className="hover:text-white transition-colors">
              Settlement Engine
            </a>
          </div>

          <div className="text-[10px] text-[#6d6c6b] uppercase tracking-[0.018em]">
            © {new Date().getFullYear()} SplitSimple · Built for roommates & friends
          </div>
        </div>
      </footer>
    </div>
  );
}
