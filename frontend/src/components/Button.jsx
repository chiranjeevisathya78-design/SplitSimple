import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'yellow', // 'yellow' | 'pink' | 'cyan' | 'white' | 'black' | 'secondary' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-display font-bold uppercase tracking-wider border-2 border-black rounded-[4px] transition-all select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-[2px_2px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000]',
    md: 'text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 gap-2 shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000]',
    lg: 'text-sm sm:text-base px-6 py-3 sm:px-7 sm:py-3.5 gap-2.5 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000]',
  };

  const variants = {
    yellow: 'bg-[#ccff00] text-black hover:bg-[#bbf000]',
    primary: 'bg-[#ccff00] text-black hover:bg-[#bbf000]', // alias
    pink: 'bg-[#ff529a] text-white hover:bg-[#f03f89]',
    cyan: 'bg-[#00f0ff] text-black hover:bg-[#00d9e6]',
    orange: 'bg-[#ff8800] text-black hover:bg-[#f07b00]',
    purple: 'bg-[#b388ff] text-black hover:bg-[#9d6ef7]',
    white: 'bg-white text-black hover:bg-[#faf7ee]',
    secondary: 'bg-white text-black hover:bg-[#faf7ee]', // alias
    black: 'bg-black text-white hover:bg-[#1a1a1a]',
    danger: 'bg-[#ff3b30] text-white hover:bg-[#e03126]',
    ghost: 'bg-transparent text-black border-transparent shadow-none hover:bg-black/5 hover:border-black hover:shadow-[2px_2px_0px_#000000]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.yellow} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export function SecondaryButton(props) {
  return <Button variant="white" {...props} />;
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />;
}

export default Button;
