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
    <div className="min-h-screen flex items-center justify-center bg-[#fafafb] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2.5 text-2xl font-editorial font-semibold text-[#17191c] mb-8"
        >
          <div className="w-7 h-7 rounded-full bg-[#17191c] text-white flex items-center justify-center font-bold text-xs">
            S
          </div>
          <span>SplitSimple</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-[0_1px_3px_rgba(23,25,28,0.03)] border border-[#f2f2f3] p-8 sm:p-10">
          <div className="text-center">
            <h2 className="font-editorial text-3xl font-normal text-[#17191c]">
              Welcome back
            </h2>
            <p className="mt-1.5 text-xs text-[#777b86]">
              Sign in to manage your groups and settle balances
            </p>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 p-3.5 rounded-[16px] bg-[#fafafb] border border-[#f2f2f3] text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#5d2a1a] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Demo Accounts:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Chiranjeevi', email: 'chiranjeevi@example.com' },
                { name: 'Gagan', email: 'gagan@example.com' },
                { name: 'Pranav', email: 'pranav@example.com' },
                { name: 'Chandan', email: 'chandan@example.com' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleFillDemo(acc.email)}
                  className="px-2.5 py-1 rounded-full bg-white border border-[#e3e4e7] hover:border-[#17191c] text-[11px] font-medium text-[#17191c] transition"
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
        <p className="mt-6 text-center text-xs text-[#777b86]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#17191c] hover:underline"
          >
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
}
