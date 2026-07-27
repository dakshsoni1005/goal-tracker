import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 text-sm rounded-2xl border border-borderCol-light dark:border-borderCol-dark bg-cardBg-light dark:bg-cardBg-dark text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
          error ? 'border-danger focus:ring-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
});

export const Textarea = forwardRef(({
  label,
  placeholder = '',
  error,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 text-sm rounded-2xl border border-borderCol-light dark:border-borderCol-dark bg-cardBg-light dark:bg-cardBg-dark text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
          error ? 'border-danger focus:ring-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
});

export const Select = forwardRef(({
  label,
  options = [],
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 text-sm rounded-2xl border border-borderCol-light dark:border-borderCol-dark bg-cardBg-light dark:bg-cardBg-dark text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
          error ? 'border-danger focus:ring-danger' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-danger font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
});
