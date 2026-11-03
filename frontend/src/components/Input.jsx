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
          className="block text-xs font-semibold tracking-wider uppercase text-[#777b86] mb-2"
        >
          {label} {required && <span className="text-[#5d2a1a]">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777b86]">
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
          className={`w-full bg-white text-[#17191c] placeholder-[#a3a6af] text-sm rounded-[16px] border border-[#f2f2f3] py-2.5 px-3.5 transition-colors focus:outline-none focus:border-[#17191c] focus:ring-1 focus:ring-[#17191c] ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-[#777b86]">{helper}</p>}
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
          className="block text-xs font-semibold tracking-wider uppercase text-[#777b86] mb-2"
        >
          {label} {required && <span className="text-[#5d2a1a]">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-white text-[#17191c] text-sm rounded-[16px] border border-[#f2f2f3] py-2.5 px-3.5 transition-colors focus:outline-none focus:border-[#17191c] focus:ring-1 focus:ring-[#17191c] ${
          error ? 'border-red-300' : ''
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
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default Input;

