import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
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
      toast.success('Signed in to SplitSimple!', {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 antialiased relative">
      {/* Ambient glass refraction orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-[#ccff00]/30 blur-[80px]" />
        <div className="absolute bottom-[15%] right-[10%] w-[250px] h-[250px] rounded-full bg-[#ff3377]/25 blur-[80px]" />
        <div className="absolute top-[60%] left-[50%] w-[200px] h-[200px] rounded-full bg-[#00f0ff]/20 blur-[80px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2.5 text-xl font-display font-black text-black mb-8 uppercase"
        >
          <div className="w-8 h-8 rounded-[8px] bg-gradient-to-b from-[#e0ff40] to-[#b8f000] text-black border-2 border-black flex items-center justify-center text-sm shadow-[2px_3px_0px_#000,inset_0_1.5px_1px_rgba(255,255,255,0.8)]">
            S
          </div>
          <span>SplitSimple</span>
        </Link>

        {/* Glassmorphic Form Card */}
        <div className="glass-brutal-card p-6 sm:p-8 relative">
          {/* Specular gloss */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[10px]" />

          <div className="relative z-10 text-left mb-6">
            <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#00f0ff] to-[#00d9e6] border-2 border-black rounded-[6px] font-mono text-[9px] font-bold uppercase shadow-[2px_2px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.8)] inline-block mb-1">
              DESK AUTHENTICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-black uppercase tracking-tight">
              SIGN IN TO LEDGER
            </h2>
            <p className="font-mono text-xs text-neutral-600 mt-1">
              Enter credentials to access group workspaces and settlement engine
            </p>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="relative z-10 p-3.5 rounded-[10px] bg-white/60 backdrop-blur-md border-2 border-black text-xs font-mono mb-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),3px_3px_0px_#000]">
            <div className="flex items-center gap-1.5 font-bold uppercase text-black mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] border border-black animate-pulse" />
              <span>1-CLICK DEMO ACCOUNTS:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Chiranjeevi (Admin)', email: 'chiranjeevi@example.com', color: 'bg-gradient-to-b from-[#e0ff40] to-[#b8f000]' },
                { name: 'Gagan', email: 'gagan@example.com', color: 'bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white' },
                { name: 'Pranav', email: 'pranav@example.com', color: 'bg-gradient-to-b from-[#33f5ff] to-[#00d9e6]' },
                { name: 'Chandan', email: 'chandan@example.com', color: 'bg-gradient-to-b from-[#ffc837] to-[#ff9900]' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleFillDemo(acc.email)}
                  className={`px-2.5 py-1 rounded-[6px] border-2 border-black font-mono font-bold text-[11px] shadow-[2px_2px_0px_#000,inset_0_1px_1px_rgba(255,255,255,0.7)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] transition-all cursor-pointer ${acc.color}`}
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              variant="yellow"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to Desk
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center font-mono text-xs font-bold uppercase text-black">
          Need a workspace?{' '}
          <Link
            to="/register"
            className="text-black underline decoration-2 decoration-[#ccff00] underline-offset-4"
          >
            Create account for free →
          </Link>
        </p>
      </div>
    </div>
  );
}
