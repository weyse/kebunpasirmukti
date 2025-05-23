
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Visit } from '@/types/visit';
import { CalendarPermission } from '@/types/calendarPermission';
import { toast } from 'sonner';

export const useCalendarData = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAccessLevel, setUserAccessLevel] = useState<CalendarPermission>('view');

  useEffect(() => {
    const fetchVisits = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('guest_registrations')
          .select('id, order_id, institution_name, responsible_person, visit_date, visit_type, payment_status, adult_count, children_count, teacher_count')
          .order('visit_date', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match the Visit type
          const transformedVisits: Visit[] = data.map(item => ({
            id: item.id,
            order_id: item.order_id || 'N/A',
            institution_name: item.institution_name,
            responsible_person: item.responsible_person,
            total_visitors: (item.adult_count || 0) + (item.children_count || 0) + (item.teacher_count || 0),
            visit_type: item.visit_type,
            visit_date: item.visit_date,
            payment_status: item.payment_status
          }));
          
          setVisits(transformedVisits);
        }
      } catch (error) {
        console.error('Error fetching visits:', error);
        toast('Error fetching visits');
      } finally {
        setIsLoading(false);
      }
    };
    
    // In a real application, you would fetch the user's access level from your auth system
    const fetchUserAccessLevel = async () => {
      // This is a placeholder. In a real app, you would get this from your auth system
      // For now, we'll default to 'view' access
      setUserAccessLevel('view');
    };
    
    fetchVisits();
    fetchUserAccessLevel();
  }, []);

  return { visits, isLoading, userAccessLevel };
};
