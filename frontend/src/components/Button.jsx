import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'peach' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variants = {
    primary: 'bg-[#17191c] hover:bg-[#2b2e34] text-white shadow-sm',
    secondary: 'bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#f2f2f3] hover:border-[#e3e4e7]',
    peach: 'bg-[#fbe1d1] hover:bg-[#f6d0bb] text-[#5d2a1a] font-semibold',
    ghost: 'bg-transparent hover:bg-[#f2f2f3] text-[#777b86] hover:text-[#17191c]',
    danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}

export default Button;
