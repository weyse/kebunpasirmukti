
/**
 * Format a number as Indonesian Rupiah currency
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Ensure amount is a valid number
  const safeAmount = numAmount === null || numAmount === undefined || isNaN(Number(numAmount)) ? 0 : Number(numAmount);
  
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
  if (!dateString) return '-';
  
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  } catch (error) {
    console.error("Date formatting error:", error);
    return '-';
  }
}

/**
 * Format a date to short Indonesian format (dd/MM/yyyy)
 */
export function formatShortDate(dateString: string): string {
  if (!dateString) return '-';
  
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString));
  } catch (error) {
    console.error("Date formatting error:", error);
    return '-';
  }
}

/**
 * Format invoice number from order_id
 */
export function formatInvoiceNumber(orderId: string | null | undefined): string {
  if (!orderId) return '-';
  
  // Extract parts from ORD-YYYYMMDD-HHMMSS-RAND4 format
  const parts = orderId.split('-');
  if (parts.length < 3) return orderId;
  
  // Create invoice number format: INV/YYYYMMDD/RAND4
  return `INV/${parts[1]}/${parts[3] || '0000'}`;
}

/**
 * Convert any value to a safe number
 */
export function toSafeNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}
