import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  required = false,
  className = '',
  helperText = '',
  icon: Icon,
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-[#ff529a]">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-white text-black placeholder-neutral-400 font-mono text-xs sm:text-sm border-2 border-black rounded-[4px] px-3.5 py-2.5 shadow-[2px_2px_0px_#000000] focus:outline-none focus:shadow-[4px_4px_0px_#000000] focus:bg-[#fffef7] transition-all disabled:opacity-50 disabled:bg-neutral-100 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-[#ff3b30] bg-rose-50' : ''} ${className}`}
          {...props}
        />
      </div>

      {helperText && !error && (
        <p className="font-mono text-[11px] text-neutral-600">{helperText}</p>
      )}
      {error && <p className="font-mono text-[11px] font-bold text-[#ff3b30]">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  error = '',
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block font-mono text-xs font-bold uppercase tracking-wider text-black"
        >
          {label} {required && <span className="text-[#ff529a]">*</span>}
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-white text-black font-mono text-xs sm:text-sm border-2 border-black rounded-[4px] px-3.5 py-2.5 shadow-[2px_2px_0px_#000000] focus:outline-none focus:shadow-[4px_4px_0px_#000000] focus:bg-[#fffef7] transition-all cursor-pointer ${
          error ? 'border-[#ff3b30]' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="font-mono text-[11px] font-bold text-[#ff3b30]">{error}</p>}
    </div>
  );
}

export default Input;
