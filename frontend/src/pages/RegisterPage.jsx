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
              Create an account
            </h2>
            <p className="mt-1.5 text-xs text-[#777b86]">
              Start tracking shared expenses with roommates and friends
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              className="w-full mt-4"
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-xs text-[#777b86]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#17191c] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
