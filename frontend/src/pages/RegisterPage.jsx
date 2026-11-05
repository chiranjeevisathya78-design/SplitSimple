import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
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
              Create an account
            </h2>
            <p className="mt-1 text-xs text-[#6d6c6b] font-normal">
              Join or create group ledgers and settle shared expenses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Input
              label="Full Name"
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chiranjeevi S"
              icon={User}
            />

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
              placeholder="At least 6 characters"
              icon={Lock}
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              icon={Lock}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-5 text-center text-xs text-[#6d6c6b] font-normal">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#0c0a08] underline underline-offset-4 font-normal"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
