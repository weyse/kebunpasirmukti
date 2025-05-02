
/**
 * Format a number as Indonesian Rupiah currency
 */
export function formatCurrency(amount: number): string {
  // Ensure amount is a valid number
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

/**
 * Format a date to Indonesian format
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString));
}
