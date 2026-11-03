/**
 * Format paise amount to rupees display string
 * @param {number} paise - Amount in paise
 * @returns {string} Formatted amount like "₹1,200.00"
 */
export function formatCurrency(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Format a date for display
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get initials from a name
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Category labels and colors
 */
export const CATEGORIES = {
  food: { label: 'Food & Dining', color: '#f97316' },
  transport: { label: 'Transport', color: '#3b82f6' },
  entertainment: { label: 'Entertainment', color: '#a855f7' },
  shopping: { label: 'Shopping', color: '#ec4899' },
  rent: { label: 'Rent', color: '#6366f1' },
  utilities: { label: 'Utilities', color: '#14b8a6' },
  groceries: { label: 'Groceries', color: '#22c55e' },
  travel: { label: 'Travel', color: '#eab308' },
  subscriptions: { label: 'Subscriptions', color: '#f43f5e' },
  health: { label: 'Health', color: '#06b6d4' },
  education: { label: 'Education', color: '#8b5cf6' },
  other: { label: 'Other', color: '#64748b' },
};

