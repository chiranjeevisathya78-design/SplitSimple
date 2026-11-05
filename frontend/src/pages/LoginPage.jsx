import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, SecondaryButton } from '../components/Button';
import { Input } from '../components/Input';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f2f0] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-xl font-normal text-[#0c0a08] mb-8"
        >
          <div className="w-6 h-6 rounded-[6px] bg-[#e4f222] text-[#0c0a08] flex items-center justify-center font-normal text-xs">
            S
          </div>
          <span>SplitSimple</span>
        </Link>

        {/* Ramp Content Card: 16px radius, Paper #ffffff, Hairline #e5e7eb border, no shadow */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-6 sm:p-8">
          <div className="text-left">
            <h2 className="text-2xl font-normal text-[#0c0a08] tracking-tight">
              Sign in to ledger
            </h2>
            <p className="mt-1 text-xs text-[#6d6c6b] font-normal">
              Enter credentials to access group ledgers and settlement desks
            </p>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-5 p-3 rounded-[10px] bg-[#f4f2f0] border border-[#e5e7eb] text-xs">
            <div className="flex items-center gap-1.5 font-normal text-[#0c0a08] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]" />
              <span className="text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b]">
                Preloaded Demo Desks:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Chiranjeevi (Admin)', email: 'chiranjeevi@example.com' },
                { name: 'Gagan', email: 'gagan@example.com' },
                { name: 'Pranav', email: 'pranav@example.com' },
                { name: 'Chandan', email: 'chandan@example.com' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleFillDemo(acc.email)}
                  className="px-2.5 py-1 rounded-[6px] bg-white border border-[#e5e7eb] hover:border-[#0c0a08] text-[11px] font-normal text-[#0c0a08] transition-colors"
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Input
              label="Email Address"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
            />

            <Input
              label="Password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-5 text-center text-xs text-[#6d6c6b] font-normal">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#0c0a08] underline underline-offset-4 font-normal"
          >
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
}
