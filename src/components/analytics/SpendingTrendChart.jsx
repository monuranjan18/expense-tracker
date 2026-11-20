import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useCurrency } from '../../context/CurrencyContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const SpendingTrendChart = ({ transactions = [], days = 30 }) => {
  const { format, currency } = useCurrency();

  // Generate labels for the last N days
  const dateLabels = [];
  const dateKeys = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dateKeys.push(key);
    dateLabels.push(
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
  }

  const spendingData = new Array(days).fill(0);

  transactions.forEach((tx) => {
    if (tx.type === 'expense' && tx.date) {
      const idx = dateKeys.indexOf(tx.date);
      if (idx !== -1) {
        spendingData[idx] += Number(tx.amount) || 0;
      }
    }
  });

  const data = {
    labels: dateLabels,
    datasets: [
      {
        fill: true,
        label: 'Daily Spending',
        data: spendingData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        tension: 0.35,
        pointBackgroundColor: '#6366f1',
        pointHoverRadius: 6,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => ` Spent: ${format(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxTicksLimit: 8,
          font: { family: 'Inter, sans-serif', size: 11 },
        },
      },
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.15)' },
        ticks: {
          callback: (value) => `${currency.symbol}${value}`,
          font: { family: 'Inter, sans-serif' },
        },
      },
    },
  };

  return (
    <div className="h-72 relative">
      <Line data={data} options={options} />
    </div>
  );
};
