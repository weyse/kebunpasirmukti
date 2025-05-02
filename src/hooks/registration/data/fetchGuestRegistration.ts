
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ClassType } from '../../types/registrationTypes';

export const fetchGuestRegistration = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('guest_registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Fetch classes if any
    const { data: classesData } = await supabase
      .from('guest_classes')
      .select('class_type')
      .eq('registration_id', id);
    
    const classes = classesData ? classesData.map(c => c.class_type) as ClassType[] : [];

    return { registrationData: data, classes };
  } catch (error: any) {
    toast({
      title: "Error!",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};
