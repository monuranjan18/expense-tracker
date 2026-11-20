export const formatCurrency = (amount, symbol = '₹', currencyCode = 'INR') => {
  const numericAmount = Number(amount) || 0;
  try {
    // Format using standard NumberFormat with Indian/international numbering system
    const isIndian = currencyCode === 'INR';
    const formatted = new Intl.NumberFormat(isIndian ? 'en-IN' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(numericAmount));

    const sign = numericAmount < 0 ? '-' : '';
    return `${sign}${symbol}${formatted}`;
  } catch {
    return `${symbol}${numericAmount.toFixed(2)}`;
  }
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
};

export const getMonthYearString = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
