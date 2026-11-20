import React from 'react';

export const BudgetProgressBar = ({ percentage, isExceeded, isNearLimit }) => {
  // Cap visual bar at 100% width, but indicate excess
  const cappedPercentage = Math.min(Math.max(percentage, 0), 100);

  const getBarColor = () => {
    if (isExceeded) return 'bg-rose-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor()}`}
        style={{ width: `${cappedPercentage}%` }}
      />
    </div>
  );
};
