
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ClassType } from '../../types/registrationTypes';
import { PackageParticipants } from '../useSelectionState';

// Define the package data structure
export interface PackagesJsonData {
  selected_packages?: string[];
  package_participants?: PackageParticipants;
}

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

    // Process packages_json data if it exists
    let packagesData: PackagesJsonData = { 
      selected_packages: [], 
      package_participants: {} 
    };

    if (data.packages_json) {
      try {
        if (typeof data.packages_json === 'string') {
          packagesData = JSON.parse(data.packages_json);
        } else if (typeof data.packages_json === 'object' && data.packages_json !== null) {
          packagesData = data.packages_json as PackagesJsonData;
        }
      } catch (err) {
        console.error('Error parsing packages_json:', err);
      }
    }

    return { registrationData: data, classes, packagesData };
  } catch (error: any) {
    toast({
      title: "Error!",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};
