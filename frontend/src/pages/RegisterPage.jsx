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
      toast.success('Account created successfully!', {
        icon: '★',
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
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 antialiased relative">
      {/* Ambient glass refraction orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[8%] w-[300px] h-[300px] rounded-full bg-[#ff3377]/25 blur-[80px]" />
        <div className="absolute bottom-[15%] left-[8%] w-[250px] h-[250px] rounded-full bg-[#ccff00]/25 blur-[80px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 w-[220px] h-[220px] rounded-full bg-[#00f0ff]/20 blur-[80px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2.5 text-xl font-display font-black text-black mb-8 uppercase"
        >
          <div className="w-8 h-8 rounded-[8px] bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white border-2 border-black flex items-center justify-center text-sm shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)]">
            S
          </div>
          <span>SplitSimple</span>
        </Link>

        {/* Glassmorphic Form Card */}
        <div className="glass-brutal-card p-6 sm:p-8 relative">
          {/* Specular gloss */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[10px]" />

          <div className="relative z-10 text-left mb-6">
            <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#ccff00] to-[#b8f000] border-2 border-black rounded-[6px] font-mono text-[9px] font-bold uppercase shadow-[2px_2px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.8)] inline-block mb-1">
              FREE ONBOARDING
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-black uppercase tracking-tight">
              CREATE AN ACCOUNT
            </h2>
            <p className="font-mono text-xs text-neutral-600 mt-1">
              Join or create group ledgers and settle shared expenses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
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
              placeholder="Re-enter password"
              icon={Lock}
            />

            <Button
              type="submit"
              variant="pink"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Register Account
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center font-mono text-xs font-bold uppercase text-black">
          Already registered?{' '}
          <Link
            to="/login"
            className="text-black underline decoration-2 decoration-[#ff529a] underline-offset-4"
          >
            Sign in here →
          </Link>
        </p>
      </div>
    </div>
  );
}
