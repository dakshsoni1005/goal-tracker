import React from 'react';

const ProgressRing = ({
  radius = 60,
  strokeWidth = 10,
  progress = 0,
  color = 'stroke-primary',
  className = '',
}) => {
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Track Ring */}
        <circle
          className="stroke-slate-100 dark:stroke-slate-800"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Ring */}
        <circle
          className={`transition-all duration-500 ease-out ${color}`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      {/* Percentage Center Text */}
      <div className="absolute text-center flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {Math.round(progress)}%
        </span>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
          Score
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
