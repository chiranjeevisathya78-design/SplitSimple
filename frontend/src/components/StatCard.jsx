import React from 'react';

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'white', // 'white' | 'yellow' | 'pink' | 'cyan' | 'purple' | 'orange' | 'dark'
  className = '',
  trend,
  badge,
}) {
  const variantStyles = {
    white: 'bg-white text-black',
    yellow: 'bg-[#ccff00] text-black',
    pink: 'bg-[#ff529a] text-white',
    cyan: 'bg-[#00f0ff] text-black',
    purple: 'bg-[#b388ff] text-black',
    orange: 'bg-[#ff8800] text-black',
    dark: 'bg-[#000000] text-white',
    wash: 'bg-[#fffdf8] text-black',
    highlight: 'bg-[#ccff00] text-black',
    peach: 'bg-[#ffb703] text-black',
    mist: 'bg-[#e0f2fe] text-black',
  };

  const isDark = variant === 'dark';

  return (
    <div
      className={`relative border-2 sm:border-[3px] border-black rounded-[4px] p-5 sm:p-6 shadow-[4px_4px_0px_#000000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000000] ${
        variantStyles[variant] || variantStyles.white
      } ${className}`}
    >
      {/* Decorative Washi Tape on top */}
      <div className="absolute -top-2.5 left-6 w-12 h-3.5 bg-black/20 border border-black/40 rotate-1 pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-neutral-400' : 'text-neutral-700'
              }`}
            >
              {label}
            </span>
            {badge && (
              <span className="px-1.5 py-0.2 bg-black text-[#ccff00] text-[9px] font-mono font-bold uppercase border border-black rounded-xs">
                {badge}
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-[4px] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000000] ${
              isDark ? 'bg-[#ccff00] text-black' : 'bg-black text-white'
            }`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t-2 border-black/15 flex items-center justify-between text-xs font-mono">
          {subtext && (
            <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
              {subtext}
            </span>
          )}
          {trend && (
            <span
              className={`font-bold uppercase ${
                trend > 0 ? 'text-[#00c853]' : 'text-[#ff3b30]'
              }`}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function MemberAvatar({ name = '', size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-bold',
    xl: 'w-12 h-12 text-base font-bold',
  };

  const colors = [
    'bg-[#ccff00] text-black',
    'bg-[#ff529a] text-white',
    'bg-[#00f0ff] text-black',
    'bg-[#ff8800] text-black',
    'bg-[#b388ff] text-black',
  ];

  // Hash character code
  const charCode = name ? name.charCodeAt(0) : 0;
  const color = colors[charCode % colors.length];

  return (
    <div
      title={name}
      className={`inline-flex items-center justify-center border-2 border-black rounded-[4px] font-display font-bold shadow-[2px_2px_0px_#000000] shrink-0 select-none ${
        sizes[size] || sizes.md
      } ${color} ${className}`}
    >
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
}

export function DemoBadge({ label = 'DEMO DESK', active = true }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-[#ccff00] border-2 border-black rounded-[4px] text-[10px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
      {active && <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />}
      <span>{label}</span>
    </div>
  );
}

export default StatCard;
