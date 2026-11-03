import React from 'react';

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend, // 'positive' | 'negative' | 'neutral'
  badge,
  className = '',
}) {
  const trendColors = {
    positive: 'text-[#17191c] font-semibold',
    negative: 'text-[#5d2a1a] font-semibold',
    neutral: 'text-[#17191c]',
  };

  return (
    <div
      className={`bg-white rounded-[24px] border border-[#f2f2f3] p-6 shadow-[0_1px_3px_rgba(23,25,28,0.03)] flex flex-col justify-between transition-all hover:border-[#e3e4e7] ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#777b86]">
          {label}
        </span>
        {badge ? (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#fbe1d1] text-[#5d2a1a]">
            {badge}
          </span>
        ) : Icon ? (
          <div className="w-8 h-8 rounded-full bg-[#fafafb] border border-[#f2f2f3] flex items-center justify-center text-[#777b86]">
            <Icon className="w-4 h-4" />
          </div>
        ) : null}
      </div>

      <div>
        <div className={`text-3xl font-editorial tracking-tight ${trendColors[trend || 'neutral']}`}>
          {value}
        </div>
        {subtext && (
          <p className="mt-1.5 text-xs text-[#777b86] font-normal leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export function MemberAvatar({
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  return (
    <div
      title={name}
      className={`${sizes[size]} rounded-full bg-[#f2f2f3] text-[#17191c] font-semibold flex items-center justify-center border border-[#e3e4e7] shrink-0 select-none ${className}`}
    >
      {initials}
    </div>
  );
}

export function DemoBadge({ onReset, isResetting }) {
  return (
    <div className="bg-[#fbe1d1] text-[#5d2a1a] border border-[#f6d0bb] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-xs">
      <span className="w-2 h-2 rounded-full bg-[#5d2a1a] animate-pulse" />
      <span>Demo Environment</span>
      {onReset && (
        <button
          onClick={onReset}
          disabled={isResetting}
          className="ml-1 text-[11px] underline font-semibold hover:opacity-80 transition disabled:opacity-50"
        >
          {isResetting ? 'Resetting…' : 'Reset Data'}
        </button>
      )}
    </div>
  );
}
