
import { format } from 'date-fns';

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

export const formatShortDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

export const formatInvoiceNumber = (id: string, prefix = 'INV'): string => {
  // Format ID as an invoice number (e.g., INV-20230001)
  return `${prefix}-${new Date().getFullYear()}${id.slice(0, 4)}`;
};

export const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'lunas':
      return 'Lunas';
    case 'belum_lunas':
      return 'Belum Lunas';
    default:
      return status;
  }
};
