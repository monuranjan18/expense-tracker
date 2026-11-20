import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useCurrency } from '../../context/CurrencyContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const IncomeVsExpenseChart = ({ transactions = [] }) => {
  const { format, currency } = useCurrency();

  // Get last 6 months list: ['2026-06', '2026-07', ...]
  const monthLabels = [];
  const monthKeys = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short' });
    monthKeys.push(key);
    monthLabels.push(label);
  }

  const incomeData = new Array(6).fill(0);
  const expenseData = new Array(6).fill(0);

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const txMonth = tx.date.slice(0, 7);
    const index = monthKeys.indexOf(txMonth);
    if (index !== -1) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        incomeData[index] += amt;
      } else {
        expenseData[index] += amt;
      }
    }
  });

  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#10b981',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: '#ef4444',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: { family: 'Inter, sans-serif', size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${format(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter, sans-serif' } },
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
      <Bar data={data} options={options} />
    </div>
  );
};
