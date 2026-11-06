import React from 'react';

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'glass', // 'glass' | 'lime' | 'pink' | 'cyan' | 'dark' | 'amber'
  className = '',
  trend,
  badge,
}) {
  const variantStyles = {
    glass:
      'bg-white/80 backdrop-blur-xl text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.95),4px_5px_0px_#000]',
    lime:
      'bg-gradient-to-br from-[#e0ff40]/90 to-[#b8f000]/90 backdrop-blur-xl text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),4px_5px_0px_#000]',
    yellow:
      'bg-gradient-to-br from-[#e0ff40]/90 to-[#b8f000]/90 backdrop-blur-xl text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),4px_5px_0px_#000]',
    pink:
      'bg-gradient-to-br from-[#ff4d8d]/90 to-[#e62266]/90 backdrop-blur-xl text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),4px_5px_0px_#000]',
    cyan:
      'bg-gradient-to-br from-[#33f5ff]/90 to-[#00d9e6]/90 backdrop-blur-xl text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),4px_5px_0px_#000]',
    amber:
      'bg-gradient-to-br from-[#ffc837]/90 to-[#ff9900]/90 backdrop-blur-xl text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),4px_5px_0px_#000]',
    dark:
      'bg-[#0e0f17]/90 backdrop-blur-xl text-white shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.25),4px_5px_0px_#ccff00]',
    wash:
      'bg-white/70 backdrop-blur-lg text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),4px_5px_0px_#000]',
    white:
      'bg-white/80 backdrop-blur-xl text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.95),4px_5px_0px_#000]',
  };

  const isDark = variant === 'dark';

  return (
    <div
      className={`relative border-2 sm:border-[2.5px] border-black rounded-[12px] p-5 sm:p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_7px_0px_#000] overflow-hidden ${
        variantStyles[variant] || variantStyles.glass
      } ${className}`}
    >
      {/* Specular gloss shine at top edge */}
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[10px]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
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
              <span className="px-1.5 py-0.2 bg-black text-[#ccff00] text-[9px] font-mono font-bold uppercase border border-black rounded-[4px] shadow-[1px_1px_0px_#000]">
                {badge}
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-[8px] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000] ${
              isDark ? 'bg-[#ccff00] text-black' : 'bg-black text-white'
            }`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="relative z-10 mt-4 pt-3 border-t-2 border-black/15 flex items-center justify-between text-xs font-mono">
          {subtext && (
            <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
              {subtext}
            </span>
          )}
          {trend && (
            <span
              className={`font-bold uppercase ${
                trend > 0 ? 'text-[#00c853]' : 'text-[#ff3377]'
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

  const gradients = [
    'bg-gradient-to-b from-[#e0ff40] to-[#b8f000] text-black',
    'bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white',
    'bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] text-black',
    'bg-gradient-to-b from-[#ffc837] to-[#ff9900] text-black',
    'bg-gradient-to-b from-[#c084fc] to-[#9333ea] text-white',
  ];

  const charCode = name ? name.charCodeAt(0) : 0;
  const color = gradients[charCode % gradients.length];

  return (
    <div
      title={name}
      className={`inline-flex items-center justify-center border-2 border-black rounded-[6px] font-display font-black shadow-[2px_2px_0px_#000000] shrink-0 select-none ${
        sizes[size] || sizes.md
      } ${color} ${className}`}
    >
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
}

export function DemoBadge({ label = 'DEMO DESK', active = true }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-[#ccff00] border-2 border-black rounded-[6px] text-[10px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000]">
      {active && <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />}
      <span>{label}</span>
    </div>
  );
}

export default StatCard;
