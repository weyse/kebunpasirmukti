<<<<<<< HEAD
=======

>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23
import { Visit } from '@/types/visit';
import { formatCurrency, formatInvoiceNumber, formatShortDate } from '../formatters';

/**
 * Function to get package type label
 */
export const getPackageLabel = (type: string): string => {
  const packageLabels: Record<string, string> = {
    agropintar: 'Agropintar',
    agro_junior: 'Agro Junior',
    kemping: 'Kemping',
    funtastic: 'Funtastic',
    ekstrakurikuler: 'Ekstrakurikuler',
    ceria_outdoor: 'Ceria Outdoor',
    ceria_indoor: 'Ceria Indoor',
    lansia: 'Lansia 60+',
    corporate: 'Corporate',
    seminar_sehari: 'Seminar Sehari',
    seminar_inap_biasa: 'Seminar Inap Biasa',
    seminar_inap_religi: 'Seminar Inap Religi',
  };
  return packageLabels[type] || type;
};

/**
 * Generate border style for Excel cells
 */
export const borderStyle = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' }
};

/**
 * Generate header style for invoice
 */
export const headerStyle = {
  font: { bold: true, size: 14 },
  alignment: { horizontal: 'center', vertical: 'center' }
};

/**
 * Generate subheader style for invoice
 */
export const subheaderStyle = {
  font: { bold: true, size: 12 },
  alignment: { horizontal: 'center', vertical: 'center' }
};

/**
 * Generate table header style
 */
export const tableHeaderStyle = {
  font: { bold: true },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: borderStyle,
  fill: { fgColor: { rgb: "E5E5E5" } }
};

/**
 * Calculate base prices
 */
export const getProductPrices = () => {
  return {
    adultPrice: 100000,
    childPrice: 70000,
    teacherPrice: 50000,
    roomPrice: 1250000,
    extraBedPrice: 160000,
    venuePrice: 500000
  };
};

/**
 * Calculate total cost from visit data
 */
export const calculateVisitCosts = (visit: Visit) => {
  const prices = getProductPrices();
  
  const adultSubtotal = prices.adultPrice * (visit.adult_count || 0);
  const childSubtotal = prices.childPrice * (visit.children_count || 0);
  const teacherSubtotal = prices.teacherPrice * (visit.teacher_count || 0);
  
  // Calculate room costs if available
  let roomSubtotal = 0;
  let extraBedSubtotal = 0;
  let venueSubtotal = 0;
  
  if (visit.rooms_json && visit.nights_count && visit.nights_count > 0) {
    // Calculate room costs
    if (visit.rooms_json.accommodation_counts) {
      Object.values(visit.rooms_json.accommodation_counts).forEach(count => {
        roomSubtotal += prices.roomPrice * Number(count) * visit.nights_count!;
      });
    }
    
    // Calculate extra bed costs
    if (visit.rooms_json.extra_bed_counts) {
      const extraBeds = Object.values(visit.rooms_json.extra_bed_counts).reduce(
        (sum, count) => sum + Number(count), 0
      );
      extraBedSubtotal = prices.extraBedPrice * extraBeds * visit.nights_count!;
    }
  }
  
  // Calculate venue costs if available
  if (visit.venues_json && visit.venues_json.selected_venues) {
    venueSubtotal = prices.venuePrice * visit.venues_json.selected_venues.length;
  }
  
  const baseTotal = adultSubtotal + childSubtotal + teacherSubtotal + 
                    roomSubtotal + extraBedSubtotal + venueSubtotal;
  
  // Calculate discount if applicable
  const discountAmount = visit.discount_percentage ? 
    baseTotal * (visit.discount_percentage / 100) : 0;
  
  // Calculate final total
  const finalTotal = visit.discounted_cost || baseTotal;
  
  // Calculate remaining payment
  const remainingAmount = visit.down_payment ? 
    finalTotal - visit.down_payment : finalTotal;
  
  return {
    adultSubtotal,
    childSubtotal,
    teacherSubtotal,
    roomSubtotal,
    extraBedSubtotal,
    venueSubtotal,
    baseTotal,
    discountAmount,
    finalTotal,
    remainingAmount
  };
};
