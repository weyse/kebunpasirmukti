
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Visit } from '@/types/visit';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ReportFilters {
  startDate: string;
  endDate: string;
  packageType: string | null;
  institution: string | null;
  paymentStatus: string | null;
}

interface ReportSummary {
  totalVisits: number;
  totalRevenue: number;
  totalParticipants: number;
  topPackage: string;
}

export const useReportData = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<ReportSummary>({
    totalVisits: 0,
    totalRevenue: 0,
    totalParticipants: 0,
    topPackage: '-'
  });
  
  // Default to current month for date filters
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: format(firstDayOfMonth, 'yyyy-MM-dd'),
    endDate: format(today, 'yyyy-MM-dd'),
    packageType: null,
    institution: null,
    paymentStatus: null
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('guest_registrations')
        .select('*')
        .gte('visit_date', filters.startDate)
        .lte('visit_date', filters.endDate);
        
      if (filters.packageType) {
        query = query.eq('package_type', filters.packageType);
      }
      
      if (filters.institution) {
        query = query.ilike('institution_name', `%${filters.institution}%`);
      }
      
      if (filters.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
      }
      
      query = query.order('visit_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const processedData = data.map(visit => ({
          ...visit,
          id: visit.id,
          order_id: visit.order_id || '',
          total_visitors: (visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0)
        })) as Visit[];
        
        setVisits(processedData);
        setFilteredVisits(processedData);
        calculateSummary(processedData);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast('Gagal mengambil data laporan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateSummary = (data: Visit[]) => {
    const totalVisits = data.length;
    const totalRevenue = data.reduce((sum, visit) => sum + (visit.discounted_cost || 0), 0);
    const totalParticipants = data.reduce((sum, visit) => sum + (visit.adult_count || 0) + (visit.children_count || 0) + (visit.teacher_count || 0), 0);
    
    // Calculate top package
    const packageCounts: Record<string, number> = {};
    data.forEach(visit => {
      const packageType = visit.package_type || 'Tidak ada';
      packageCounts[packageType] = (packageCounts[packageType] || 0) + 1;
    });
    
    let topPackage = '-';
    let maxCount = 0;
    
    Object.entries(packageCounts).forEach(([packageName, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPackage = packageName;
      }
    });
    
    setSummary({
      totalVisits,
      totalRevenue,
      totalParticipants,
      topPackage
    });
  };
  
  const applyFilters = () => {
    fetchData();
  };
  
  const updateFilter = (name: keyof ReportFilters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);
  
  return {
    visits: filteredVisits,
    isLoading,
    summary,
    filters,
    updateFilter,
    applyFilters
  };
};
