import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CATEGORY_COLORS } from '../../utils/constants';
import { useCurrency } from '../../context/CurrencyContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryExpenseChart = ({ categoryExpenseMap = {} }) => {
  const { format, currency } = useCurrency();
  const categories = Object.keys(categoryExpenseMap);
  const values = Object.values(categoryExpenseMap);

  if (categories.length === 0 || values.every((v) => v === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm">
        No expense data available for chart.
      </div>
    );
  }

  const backgroundColors = categories.map(
    (cat) => CATEGORY_COLORS[cat] || '#94a3b8'
  );

  const data = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 16,
          usePointStyle: true,
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = values.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return ` ${label}: ${format(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '68%',
  };

  return (
    <div className="h-72 relative">
      <Doughnut data={data} options={options} />
    </div>
  );
};
