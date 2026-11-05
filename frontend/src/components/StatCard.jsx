import React from 'react';

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'white', // 'white' | 'dark' | 'wash' | 'highlight'
  trend,
  badge,
  action,
  className = '',
}) {
  const variantStyles = {
    // Ramp Paper Card: #ffffff fill, 1px #e5e7eb hairline border, 16px radius, no shadow
    white: 'bg-white text-[#0c0a08] border border-[#e5e7eb]',
    // Ramp Obsidian Inverted Card: #1a1919 fill, white text, 1px subtle border
    dark: 'bg-[#1a1919] text-white border border-white/10',
    // Ramp Wash Card: #f4f2f0 fill, no border (or subtle hairline), 12-16px radius
    wash: 'bg-[#f4f2f0] text-[#0c0a08] border border-[#e5e7eb]',
    // Ramp Highlight Card: white card with vivid highlighter yellow accent border or top mark
    highlight: 'bg-white text-[#0c0a08] border-2 border-[#e4f222]',
  };

  const labelStyles = {
    white: 'text-[#6d6c6b]',
    dark: 'text-[#6d6c6b]',
    wash: 'text-[#6d6c6b]',
    highlight: 'text-[#0c0a08]',
  };

  const subtextStyles = {
    white: 'text-[#6d6c6b]',
    dark: 'text-[#6d6c6b]',
    wash: 'text-[#6d6c6b]',
    highlight: 'text-[#6d6c6b]',
  };

  return (
    <div
      className={`rounded-[16px] p-5 sm:p-6 flex flex-col justify-between transition-colors duration-150 ${variantStyles[variant] || variantStyles.white} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] uppercase tracking-[0.018em] font-normal ${labelStyles[variant]}`}
        >
          {label}
        </span>
        {badge ? (
          <span
            className={`text-[10px] uppercase tracking-[0.018em] font-normal px-2 py-0.5 rounded-[6px] ${
              variant === 'dark'
                ? 'bg-[#e4f222] text-[#0c0a08]'
                : 'bg-[#e4f222] text-[#0c0a08]'
            }`}
          >
            {badge}
          </span>
        ) : Icon ? (
          <div
            className={`w-7 h-7 rounded-[6px] flex items-center justify-center ${
              variant === 'dark'
                ? 'bg-white/10 text-white'
                : 'bg-[#f4f2f0] text-[#0c0a08]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        ) : null}
      </div>

      <div>
        <div className="text-3xl sm:text-4xl tracking-tight font-normal leading-none">
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
  variant = 'neutral', // 'neutral' | 'highlighter' | 'dark'
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
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const variants = {
    neutral: 'bg-[#f4f2f0] text-[#0c0a08] border border-[#e5e7eb]',
    highlighter: 'bg-[#e4f222] text-[#0c0a08] border border-black/10',
    dark: 'bg-[#1a1919] text-white border border-white/20',
  };

  return (
    <div
      title={name}
      className={`${sizes[size]} ${variants[variant]} rounded-[6px] font-normal flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {initials}
    </div>
  );
}

export function DemoBadge({ onReset, isResetting }) {
  return (
    <div className="bg-[#1a1919] text-white border border-white/10 px-2.5 py-1 rounded-[6px] text-[10px] uppercase tracking-[0.018em] font-normal flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]" />
      <span>Demo Workspace</span>
      {onReset && (
        <button
          onClick={onReset}
          disabled={isResetting}
          className="ml-1 text-[10px] text-[#e4f222] hover:underline font-normal transition disabled:opacity-50"
        >
          {isResetting ? 'Resetting…' : 'Reset'}
        </button>
      )}
    </div>
  );
}
