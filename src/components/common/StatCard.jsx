import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'brand',
  trend,
  className = '',
}) => {
  const variantStyles = {
    brand: {
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/30',
      iconBg: 'bg-indigo-600 text-white',
      border: 'border-indigo-100/60 dark:border-indigo-900/30',
      accent: 'text-indigo-600 dark:text-indigo-400',
    },
    income: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      iconBg: 'bg-emerald-500 text-white',
      border: 'border-emerald-100/60 dark:border-emerald-900/30',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    expense: {
      bg: 'bg-rose-50/70 dark:bg-rose-950/30',
      iconBg: 'bg-rose-500 text-white',
      border: 'border-rose-100/60 dark:border-rose-900/30',
      accent: 'text-rose-600 dark:text-rose-400',
    },
    balance: {
      bg: 'bg-blue-50/70 dark:bg-blue-950/30',
      iconBg: 'bg-blue-600 text-white',
      border: 'border-blue-100/60 dark:border-blue-900/30',
      accent: 'text-blue-600 dark:text-blue-400',
    },
  };

  const style = variantStyles[variant] || variantStyles.brand;

  return (
    <div
      className={`relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border ${style.border} shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${style.iconBg} shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {trend && (
            <span
              className={`font-semibold ${
                trend > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};
