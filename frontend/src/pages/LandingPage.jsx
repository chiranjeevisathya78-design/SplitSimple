import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, SecondaryButton } from '../components/Button';

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleExploreDemo = async () => {
    setLoadingDemo(true);
    try {
      // Demo credentials pre-seeded
      await login('chiranjeevi@example.com', 'password123');
      toast.success('Welcome to SplitSimple Demo Workspace!');
      navigate('/dashboard');
    } catch {
      toast.error('Could not connect to demo workspace. Please try logging in manually.');
      navigate('/login');
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-[#17191c]">
      {/* Editorial Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#fafafb]/90 backdrop-blur-md border-b border-[#f2f2f3]">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#17191c] text-white flex items-center justify-center font-bold text-sm tracking-tight">
              S
            </div>
            <span className="font-editorial text-2xl font-semibold tracking-tight text-[#17191c]">
              SplitSimple
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#777b86]">
            <a href="#features" className="hover:text-[#17191c] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#17191c] transition-colors">
              How It Works
            </a>
            <a href="#settlement" className="hover:text-[#17191c] transition-colors">
              Smart Settlement
            </a>
          </nav>

          <div className="flex items-center gap-3">
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
              <SecondaryButton size="sm" className="text-xs">
                Sign In
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] text-xs font-semibold tracking-wide uppercase mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Designed for Roommates & Travel Groups
          </div>

          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[1.05] tracking-tight text-[#17191c] max-w-4xl mx-auto font-normal">
            Shared expenses. <br />
            <span className="italic font-normal">Simplified.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-[#777b86] max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate awkward IOUs and mathematical confusion. Split rent, trips, and dinners with integer paise precision, real-time balances, and greedy debt minimization.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              loading={loadingDemo}
              onClick={handleExploreDemo}
              icon={ArrowRight}
            >
              Explore Live Demo
            </Button>
            <Link to="/register">
              <SecondaryButton size="lg">
                Create Free Account
              </SecondaryButton>
            </Link>
          </div>

          {/* Actual Product UI Preview */}
          <div className="mt-16 sm:mt-20 max-w-[1100px] mx-auto bg-white rounded-[24px] border border-[#f2f2f3] p-4 sm:p-8 shadow-[0_4px_30px_rgba(23,25,28,0.04)] text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f2f2f3] gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
                  Active Workspace
                </span>
                <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mt-0.5">
                  Bangalore Roommates
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#f2f2f3] text-xs font-medium text-[#17191c]">
                  4 Participants
                </span>
                <span className="px-3 py-1 rounded-full bg-[#fbe1d1] text-xs font-semibold text-[#5d2a1a]">
                  Smart Settlement Active
                </span>
              </div>
            </div>

            {/* Dashboard Snapshot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-5 rounded-[20px] bg-[#fafafb] border border-[#f2f2f3]">
                <p className="text-xs uppercase font-semibold text-[#777b86]">Total Group Spending</p>
                <p className="font-editorial text-3xl font-semibold text-[#17191c] mt-2">
                  ₹54,015.00
                </p>
                <p className="text-xs text-[#777b86] mt-1">7 expenses across rent & utilities</p>
              </div>

              <div className="p-5 rounded-[20px] bg-[#fafafb] border border-[#f2f2f3]">
                <p className="text-xs uppercase font-semibold text-[#777b86]">Optimized Debt Plan</p>
                <p className="font-editorial text-3xl font-semibold text-[#17191c] mt-2">
                  2 Payments
                </p>
                <p className="text-xs text-[#777b86] mt-1">Down from 6 chaotic transfers</p>
              </div>

              <div className="p-5 rounded-[20px] bg-[#fbe1d1]/30 border border-[#f6d0bb] p-5">
                <p className="text-xs uppercase font-semibold text-[#5d2a1a]">Algorithm Accuracy</p>
                <p className="font-editorial text-3xl font-semibold text-[#5d2a1a] mt-2">
                  100% Zero-Sum
                </p>
                <p className="text-xs text-[#5d2a1a] mt-1">Exact paise arithmetic balance</p>
              </div>
            </div>

            {/* Repayment visual bar */}
            <div className="bg-[#fafafb] rounded-[16px] p-4 border border-[#f2f2f3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center font-bold text-xs text-[#17191c]">
                  CR
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#17191c]">Chandan R ➔ Gagan K</p>
                  <p className="text-xs text-[#777b86]">Settling apartment groceries & water</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-editorial text-xl font-semibold text-[#17191c]">₹1,245.00</span>
                <span className="px-3 py-1 rounded-full bg-[#17191c] text-white text-xs font-medium">
                  Verified Optimal
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 bg-white border-y border-[#f2f2f3]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
              Architected for Accuracy
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] mt-2">
              Everything you need to share life smoothly.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            <div className="p-6 rounded-[24px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center mb-5 text-[#17191c]">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-[#17191c]">
                  Integer Paise Math
                </h3>
                <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                  Financial records are stored in integer paise internally. No 0.3333 paise drift or floating-point discrepancies.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center mb-5 text-[#17191c]">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-[#17191c]">
                  Greedy Settlement
                </h3>
                <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                  Our algorithm matches the highest debtor with the highest creditor, collapsing complex webs of debt into minimal transactions.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center mb-5 text-[#17191c]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-[#17191c]">
                  Flexible Splitting
                </h3>
                <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                  Split equally with automatic remainder allocation, or specify exact rupee amounts per participant with immediate sum checking.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-[#fafafb] border border-[#f2f2f3] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white border border-[#f2f2f3] flex items-center justify-center mb-5 text-[#17191c]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-[#17191c]">
                  Payment Integrity
                </h3>
                <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
                  Marking repayments as paid automatically creates permanent transactional audit records and updates net group balances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
            Three Simple Steps
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] mt-2">
            How SplitSimple works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-8">
            <span className="font-editorial text-4xl text-[#a3a6af]">01</span>
            <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mt-4">
              Create Your Group
            </h3>
            <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
              Add your roommates, travel buddies, or college friends. Add members by email or explore our preloaded demo groups.
            </p>
          </div>

          <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-8">
            <span className="font-editorial text-4xl text-[#a3a6af]">02</span>
            <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mt-4">
              Log Shared Expenses
            </h3>
            <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
              Record rent, groceries, travel tickets, or dinner. Select who paid and choose equal or custom participant shares.
            </p>
          </div>

          <div className="bg-white rounded-[24px] border border-[#f2f2f3] p-8">
            <span className="font-editorial text-4xl text-[#a3a6af]">03</span>
            <h3 className="font-editorial text-2xl font-semibold text-[#17191c] mt-4">
              Settle With Ease
            </h3>
            <p className="mt-3 text-sm text-[#777b86] leading-relaxed">
              View your optimized settlement plan. Pay directly through UPI or cash, click "Mark as Paid", and enjoy zero debts.
            </p>
          </div>
        </div>
      </section>

      {/* Smart Settlement Engine Showcase */}
      <section id="settlement" className="py-20 bg-white border-y border-[#f2f2f3]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5d2a1a] px-3 py-1 rounded-full bg-[#fbe1d1] inline-block mb-4">
                Core Feature
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#17191c] leading-tight">
                Smart Settlement Engine
              </h2>
              <p className="mt-6 text-[#777b86] leading-relaxed">
                When 5 friends travel together, there are up to 10 possible pairs of debts. SplitSimple models debts as a bipartite graph and greedily cancels overlapping receivables.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#17191c]">
                  <div className="w-5 h-5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center text-xs">✓</div>
                  <span>Fewer transactions means less bank transfer hassle</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#17191c]">
                  <div className="w-5 h-5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center text-xs">✓</div>
                  <span>Real-time recalculation upon payment confirmation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#17191c]">
                  <div className="w-5 h-5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center text-xs">✓</div>
                  <span>Verified across 11 automated unit test suites</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#fafafb] rounded-[24px] border border-[#f2f2f3] p-6 sm:p-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#777b86] mb-6">
                Optimization Demonstration
              </h4>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-[16px] border border-[#f2f2f3]">
                  <div className="flex items-center justify-between text-xs text-[#777b86] mb-2">
                    <span>Raw Member Net Balances</span>
                    <span className="text-green-600 font-medium">Sum = ₹0.00</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-[#fafafb] rounded-[10px]">Chiranjeevi: <strong>+₹1,000</strong></div>
                    <div className="p-2 bg-[#fafafb] rounded-[10px]">Gagan: <strong>-₹500</strong></div>
                    <div className="p-2 bg-[#fafafb] rounded-[10px]">Pranav: <strong>-₹300</strong></div>
                    <div className="p-2 bg-[#fafafb] rounded-[10px]">Chandan: <strong>-₹200</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-[#fbe1d1]/30 rounded-[16px] border border-[#f6d0bb]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#5d2a1a] mb-3">
                    <span>Smart Settlement Output (3 Transfers)</span>
                    <span className="bg-[#fbe1d1] px-2 py-0.5 rounded-full text-[10px]">Greedy Optimal</span>
                  </div>
                  <div className="space-y-2 text-sm text-[#17191c]">
                    <div className="flex justify-between items-center bg-white/80 p-2.5 rounded-[12px] border border-[#f2f2f3]">
                      <span>Gagan pays Chiranjeevi</span>
                      <strong className="font-editorial text-base">₹500.00</strong>
                    </div>
                    <div className="flex justify-between items-center bg-white/80 p-2.5 rounded-[12px] border border-[#f2f2f3]">
                      <span>Pranav pays Chiranjeevi</span>
                      <strong className="font-editorial text-base">₹300.00</strong>
                    </div>
                    <div className="flex justify-between items-center bg-white/80 p-2.5 rounded-[12px] border border-[#f2f2f3]">
                      <span>Chandan pays Chiranjeevi</span>
                      <strong className="font-editorial text-base">₹200.00</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-[1000px] mx-auto bg-[#17191c] rounded-[32px] p-8 sm:p-14 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal leading-tight">
              Ready to simplify your shared expenses?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#a3a6af] max-w-xl mx-auto">
              Hop directly into the pre-populated demo environment or start a fresh group for your home or next trip.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="peach"
                size="lg"
                loading={loadingDemo}
                onClick={handleExploreDemo}
                icon={ArrowRight}
              >
                Launch Demo Workspace
              </Button>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-transparent text-white border-white/20 hover:bg-white/10"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-[#f2f2f3] py-12 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#777b86]">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-lg font-semibold text-[#17191c]">
              SplitSimple
            </span>
            <span>·</span>
            <span>Shared Expense Management</span>
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
