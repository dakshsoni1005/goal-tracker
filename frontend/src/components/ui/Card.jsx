import React from 'react';

const Card = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  ...props
}) => {
  const baseStyles = 'rounded-2xl border border-borderCol-light dark:border-borderCol-dark bg-cardBg-light dark:bg-cardBg-dark shadow-soft dark:shadow-soft-dark p-5 overflow-hidden transition-all';
  
  const hoverStyles = hoverEffect 
    ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

export default Card;
