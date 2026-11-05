import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' (highlighter yellow) | 'secondary' (outlined ink) | 'ghost' | 'dark' (obsidian) | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  // Ramp buttons: strictly 6px radius, weight 400, no shadows, hairline or no border
  const base =
    'inline-flex items-center justify-center font-normal rounded-[6px] transition-colors duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizes = {
    sm: 'text-xs px-3 h-8 gap-1.5',
    md: 'text-sm px-5 h-11 gap-2',
    lg: 'text-base px-6 h-12 gap-2.5',
  };

  const variants = {
    // Ramp primary button: #e4f222 fill, #0c0a08 text, no border
    primary:
      'bg-[#e4f222] text-[#0c0a08] hover:brightness-95 active:brightness-90',
    // Ramp secondary / outlined button: transparent fill, 1px #0c0a08 border, #0c0a08 text
    secondary:
      'bg-transparent text-[#0c0a08] border border-[#0c0a08] hover:bg-[#f4f2f0]',
    // Ramp ghost button: transparent fill, #0c0a08 text, hover to #f4f2f0 bone
    ghost:
      'bg-transparent text-[#0c0a08] hover:bg-[#f4f2f0]',
    // Inverted obsidian button for dark panels: #1a1919 with 1px border or white fill
    dark:
      'bg-[#1a1919] text-white border border-white/20 hover:bg-[#252424]',
    // Danger action
    danger:
      'bg-[#ffffff] text-[#b91c1c] border border-[#fca5a5] hover:bg-[#fef2f2]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
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
  return <Button variant="secondary" {...props} />;
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />;
}

export default Button;
