import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-all';
  
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    secondary: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
export const PriorityBadge = ({ priority }) => {
  const mapping = {
    high: { variant: 'danger', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'primary', label: 'Low' },
  };

  const current = mapping[priority?.toLowerCase()] || { variant: 'slate', label: priority };

  return <Badge variant={current.variant}>{current.label}</Badge>;
};

export const StatusBadge = ({ status }) => {
  const mapping = {
    completed: { variant: 'success', label: 'Completed' },
    pending: { variant: 'slate', label: 'Pending' },
  };

  const current = mapping[status?.toLowerCase()] || { variant: 'slate', label: status };

  return <Badge variant={current.variant}>{current.label}</Badge>;
};
