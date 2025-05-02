
import { Visit, RoomsJsonData, VenuesJsonData } from '@/types/visit';

// Helper to safely parse JSON data
export const safeParseJson = <T>(jsonData: any, defaultValue: T): T => {
  if (!jsonData) return defaultValue;
  
  if (typeof jsonData === 'string') {
    try {
      return JSON.parse(jsonData) as T;
    } catch (err) {
      console.error('Error parsing JSON data:', err);
      return defaultValue;
    }
  }
  
  if (typeof jsonData === 'object') {
    return jsonData as T;
  }
  
  return defaultValue;
};

// Process raw data from database to proper Visit type
export const processVisitData = (rawData: any[]): Visit[] => {
  return rawData.map(visit => {
    // Calculate the total visitors
    const totalVisitors = (
      Number(visit.adult_count || 0) + 
      Number(visit.children_count || 0) + 
      Number(visit.teacher_count || 0) +
      Number(visit.free_of_charge_teacher_count || 0)
    );
    
    // Parse JSON fields first to ensure they have the correct type
    const roomsJson = safeParseJson<RoomsJsonData>(visit.rooms_json, { 
      accommodation_counts: {},
      extra_bed_counts: {} 
    });
    
    const venuesJson = safeParseJson<VenuesJsonData>(visit.venues_json, { 
      selected_venues: [] 
    });

    // Create a properly typed Visit object
    const typedVisit: Visit = {
      ...visit,
      id: visit.id,
      order_id: visit.order_id || '',
      institution_name: visit.institution_name || '',
      responsible_person: visit.responsible_person || '',
      visit_type: visit.visit_type || 'wisata_edukasi',
      visit_date: visit.visit_date || '',
      payment_status: visit.payment_status || 'belum_lunas',
      total_visitors: totalVisitors,
      rooms_json: roomsJson,
      venues_json: venuesJson
    };

    // Add optional properties if they exist
    if (visit.total_cost !== undefined) typedVisit.total_cost = visit.total_cost;
    if (visit.discount_percentage !== undefined) typedVisit.discount_percentage = visit.discount_percentage;
    if (visit.discounted_cost !== undefined) typedVisit.discounted_cost = visit.discounted_cost;
    if (visit.down_payment !== undefined) typedVisit.down_payment = visit.down_payment;
    if (visit.adult_count !== undefined) typedVisit.adult_count = visit.adult_count;
    if (visit.children_count !== undefined) typedVisit.children_count = visit.children_count;
    if (visit.teacher_count !== undefined) typedVisit.teacher_count = visit.teacher_count;
    if (visit.nights_count !== undefined) typedVisit.nights_count = visit.nights_count;

    return typedVisit;
  });
};
