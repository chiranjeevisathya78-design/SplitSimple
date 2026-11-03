import React from 'react';

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'white', // 'white' | 'dark' | 'peach' | 'mist'
  trend, // 'positive' | 'negative' | 'neutral'
  badge,
  action,
  className = '',
}) {
  const variantStyles = {
    white: 'bg-white text-[#17191c] border-[#f2f2f3] shadow-[0_1px_3px_rgba(23,25,28,0.03)] hover:border-[#e3e4e7]',
    dark: 'bg-[#17191c] text-white border-white/10 shadow-[0_4px_24px_rgba(23,25,28,0.12)] hover:border-white/20',
    peach: 'bg-[#fbe1d1]/50 text-[#5d2a1a] border-[#f6d0bb] shadow-[0_1px_3px_rgba(93,42,26,0.04)] hover:border-[#fbe1d1]',
    mist: 'bg-[#f2f2f3] text-[#17191c] border-[#e3e4e7] shadow-none hover:border-[#d0d2d6]',
  };

  const labelStyles = {
    white: 'text-[#777b86]',
    dark: 'text-[#a3a6af]',
    peach: 'text-[#5d2a1a]',
    mist: 'text-[#777b86]',
  };

  const subtextStyles = {
    white: 'text-[#777b86]',
    dark: 'text-[#a3a6af]',
    peach: 'text-[#5d2a1a]/80',
    mist: 'text-[#777b86]',
  };

  return (
    <div
      className={`rounded-[24px] border p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${labelStyles[variant]}`}
        >
          {label}
        </span>
        {badge ? (
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              variant === 'dark'
                ? 'bg-[#fbe1d1] text-[#5d2a1a]'
                : variant === 'peach'
                ? 'bg-[#5d2a1a] text-white'
                : 'bg-[#fbe1d1] text-[#5d2a1a]'
            }`}
          >
            {badge}
          </span>
        ) : Icon ? (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              variant === 'dark'
                ? 'bg-white/10 text-white'
                : variant === 'peach'
                ? 'bg-[#5d2a1a]/10 text-[#5d2a1a]'
                : 'bg-[#fafafb] border border-[#f2f2f3] text-[#777b86]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        ) : null}
      </div>

      <div>
        <div className="text-3xl sm:text-4xl font-editorial tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className={`mt-2 text-xs font-normal leading-relaxed ${subtextStyles[variant]}`}>
            {subtext}
          </p>
        )}
        {action && <div className="mt-4 pt-3 border-t border-current/10">{action}</div>}
      </div>
    </div>
  );
}

export function MemberAvatar({
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'neutral', // 'neutral' | 'peach' | 'dark'
  className = '',
}) {
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const sizes = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  const variants = {
    neutral: 'bg-[#f2f2f3] text-[#17191c] border-[#e3e4e7]',
    peach: 'bg-[#fbe1d1] text-[#5d2a1a] border-[#f6d0bb]',
    dark: 'bg-[#17191c] text-white border-white/20',
  };

  return (
    <div
      title={name}
      className={`${sizes[size]} ${variants[variant]} rounded-full font-semibold flex items-center justify-center border shrink-0 select-none shadow-xs ${className}`}
    >
      {initials}
    </div>
  );
}

export function DemoBadge({ onReset, isResetting }) {
  return (
    <div className="bg-[#fbe1d1] text-[#5d2a1a] border border-[#f6d0bb] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs">
      <span className="w-2 h-2 rounded-full bg-[#5d2a1a] animate-pulse" />
      <span>Demo Workspace</span>
      {onReset && (
        <button
          onClick={onReset}
          disabled={isResetting}
          className="ml-1 text-[11px] underline font-bold hover:opacity-80 transition disabled:opacity-50"
        >
          {isResetting ? 'Resetting…' : 'Reset'}
        </button>
      )}
    </div>
  );
}
