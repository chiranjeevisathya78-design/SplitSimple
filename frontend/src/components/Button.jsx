import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'lime', // 'lime' | 'cyan' | 'pink' | 'glass' | 'dark' | 'yellow' | 'white' | 'primary' | 'secondary' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const base =
    'relative inline-flex items-center justify-center font-display font-bold uppercase tracking-wider border-2 border-black rounded-[8px] transition-all select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-[2px_3px_0px_#000] hover:shadow-[4px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]',
    md: 'text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 gap-2 shadow-[3px_4px_0px_#000] hover:shadow-[5px_6px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]',
    lg: 'text-sm sm:text-base px-6 py-3 sm:px-7 sm:py-3.5 gap-2.5 shadow-[4px_5px_0px_#000] hover:shadow-[6px_7px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]',
  };

  const variants = {
    lime: 'bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8)]',
    yellow: 'bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8)]',
    primary: 'bg-gradient-to-b from-[#d8ff26] to-[#b8f000] text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8)]',
    cyan: 'bg-gradient-to-b from-[#33f5ff] to-[#00d9e6] text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8)]',
    pink: 'bg-gradient-to-b from-[#ff4d8d] to-[#e62266] text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5)]',
    glass: 'bg-white/80 backdrop-blur-md text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.95)] hover:bg-white',
    white: 'bg-white/85 backdrop-blur-md text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.95)] hover:bg-white',
    secondary: 'bg-white/85 backdrop-blur-md text-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.95)] hover:bg-white',
    dark: 'bg-gradient-to-b from-[#22232e] to-[#0c0d12] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]',
    black: 'bg-gradient-to-b from-[#22232e] to-[#0c0d12] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]',
    danger: 'bg-gradient-to-b from-[#ff453a] to-[#d92218] text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4)]',
    ghost: 'bg-transparent text-black border-transparent shadow-none hover:bg-white/40 hover:border-black hover:shadow-[2px_2px_0px_#000]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.lime} ${className}`}
      {...props}
    >
      {/* Top subtle specular reflection line */}
      <span className="absolute top-0 left-2 right-2 h-[1px] bg-white/40 rounded-full pointer-events-none" />

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function SecondaryButton(props) {
  return <Button variant="glass" {...props} />;
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />;
}

export default Button;
