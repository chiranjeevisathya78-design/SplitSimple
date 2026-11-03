/**
 * Format paise amount to rupees display string
 * @param {number} paise - Amount in paise
 * @returns {string} Formatted amount like "₹1,200.00"
 */
export function formatCurrency(paise) {
  const rupees = (paise || 0) / 100;
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
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a human readable full date for header
 * @returns {string}
 */
export function formatHeaderDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
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
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Steep-inspired category configurations
 */
export const CATEGORIES = {
  groceries: { label: 'Groceries', bg: '#edf3ec', text: '#254422' },
  food: { label: 'Food & Dining', bg: '#fbe1d1', text: '#5d2a1a' },
  rent: { label: 'House Rent', bg: '#17191c', text: '#ffffff' },
  utilities: { label: 'Utilities', bg: '#e9eef5', text: '#223854' },
  travel: { label: 'Travel & Trips', bg: '#f4ede6', text: '#5c381c' },
  transport: { label: 'Transport', bg: '#f2f2f3', text: '#3c4046' },
  entertainment: { label: 'Entertainment', bg: '#f7eaf0', text: '#5e253a' },
  shopping: { label: 'Shopping', bg: '#f4ede4', text: '#54361e' },
  subscriptions: { label: 'Subscriptions', bg: '#f2f2f3', text: '#777b86' },
  health: { label: 'Health', bg: '#ebf4ee', text: '#204f32' },
  education: { label: 'Education', bg: '#eceef6', text: '#272f54' },
  other: { label: 'General / Other', bg: '#f2f2f3', text: '#777b86' },
};
