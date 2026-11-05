import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helper,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1.5 font-normal leading-tight"
        >
          {label} {required && <span className="text-[#0c0a08]">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6d6c6b]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white text-[#0c0a08] placeholder-[#6d6c6b]/60 text-sm rounded-[10px] border border-[#e5e7eb] py-2.5 px-3.5 transition-colors focus:outline-none focus:border-[#0c0a08] focus:ring-1 focus:ring-[#0c0a08] font-normal ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-normal">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-[#6d6c6b] font-normal">{helper}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[10px] uppercase tracking-[0.018em] text-[#6d6c6b] mb-1.5 font-normal leading-tight"
        >
          {label} {required && <span className="text-[#0c0a08]">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-white text-[#0c0a08] text-sm rounded-[10px] border border-[#e5e7eb] py-2.5 px-3.5 transition-colors focus:outline-none focus:border-[#0c0a08] focus:ring-1 focus:ring-[#0c0a08] font-normal ${
          error ? 'border-red-400' : ''
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 font-normal">{error}</p>}
    </div>
  );
}

export default Input;
