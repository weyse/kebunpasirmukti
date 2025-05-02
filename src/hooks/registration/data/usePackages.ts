
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePackages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    console.log("Fetching packages...");
    const { data, error } = await supabase
      .from('packages')
      .select('*');

    if (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error fetching packages",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      console.log("Packages fetched:", data);
      setPackages(data);
    }
  };
  
  return { packages };
};
