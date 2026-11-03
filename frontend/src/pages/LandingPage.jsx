import { Link } from 'react-router-dom';
import {
  Users,
  Receipt,
  Scale,
  Handshake,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Smart Splitting',
    description:
      'Split expenses equally, by percentage, or by exact amounts. Handle any scenario effortlessly.',
  },
  {
    icon: Users,
    title: 'Group Management',
    description:
      'Create groups for trips, roommates, or events. Invite members and track shared costs in one place.',
  },
  {
    icon: Scale,
    title: 'Real-Time Balances',
    description:
      'Always know who owes whom. Balances update instantly as expenses are added or settled.',
  },
  {
    icon: Handshake,
    title: 'Optimized Settlements',
    description:
      'Minimize the number of payments needed. Our algorithm finds the simplest way to settle up.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Create a Group',
    description: 'Start a group and invite friends, roommates, or travel buddies.',
  },
  {
    number: '2',
    title: 'Add Expenses',
    description: 'Log shared costs as they happen. Split them however you like.',
  },
  {
    number: '3',
    title: 'Settle Up',
    description: 'See optimized settlements and mark payments as complete.',
  },
];

const settlementExample = [
  { from: 'Alice', to: 'Bob', amount: 25.0 },
  { from: 'Charlie', to: 'Bob', amount: 15.0 },
  { from: 'Charlie', to: 'Diana', amount: 10.0 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <Receipt className="w-6 h-6" />
            SplitSimple
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Free &amp; open-source
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Shared Expenses.{' '}
            <span className="text-indigo-600">Simplified.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed">
            Stop chasing payments and doing mental math. SplitSimple tracks group
            expenses, calculates balances, and shows you the easiest way to
            settle up&nbsp;— so you can focus on what matters.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-1 px-6 py-3 text-base font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Learn more <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything you need to split expenses
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Powerful features wrapped in a simple interface.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Get up and running in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.number} className="relative text-center">
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-5 w-5 h-5 text-gray-300" />
                )}
                <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                  {s.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Smart Settlement Showcase ─── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Smart Settlements
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              After a weekend trip with friends, expenses can get tangled.
              SplitSimple&rsquo;s algorithm reduces a web of debts into the
              fewest possible transfers&nbsp;— saving everyone time and hassle.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                'Minimizes total number of payments',
                'Handles any group size',
                'Updates in real time',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mini example card */}
          <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Optimized Settlements
            </h3>
            <div className="space-y-3">
              {settlementExample.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {s.from[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {s.from}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {s.to}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                      {s.to[0]}
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-green-600">
                    ${s.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400 text-center">
              3 simple payments instead of 6 individual transactions
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <Shield className="mx-auto w-10 h-10 text-indigo-200 mb-4" />
          <h2 className="text-3xl font-bold text-white">
            Ready to simplify your shared expenses?
          </h2>
          <p className="mt-3 text-indigo-200 max-w-lg mx-auto">
            Join SplitSimple today and never argue about money again.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2 font-medium text-gray-600">
            <Receipt className="w-4 h-4 text-indigo-600" />
            SplitSimple
          </div>
          <p>&copy; 2024 SplitSimple. Built by CHIRANJEEVI S</p>
        </div>
      </footer>
    </div>
  );
}
