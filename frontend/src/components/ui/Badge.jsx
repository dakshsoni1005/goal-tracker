import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-all';
  
  const variants = {
    primary: 'bg-primary/10 text-primary-dark border-primary/20 dark:bg-primary/5 dark:text-primary-light dark:border-primary/20',
    secondary: 'bg-secondary/15 text-[#8B7662] border-secondary/35 dark:bg-secondary/10 dark:text-secondary-light dark:border-secondary/20',
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
