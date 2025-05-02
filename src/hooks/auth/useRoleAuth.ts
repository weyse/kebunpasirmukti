
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'guest';

export interface RoleAuthState {
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useRoleAuth = () => {
  const [authState, setAuthState] = useState<RoleAuthState>({
    user: null,
    role: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setAuthState(prev => ({ ...prev, user: currentUser }));
        
        if (currentUser) {
          // Fetch the user's role
          fetchUserRole(currentUser.id);
        } else {
          // Reset role if user is not logged in
          setAuthState(prev => ({ 
            ...prev, 
            role: null, 
            isAdmin: false, 
            isLoading: false 
          }));
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setAuthState(prev => ({ ...prev, user: session.user }));
          fetchUserRole(session.user.id);
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      // First, try to use the has_role function to check if user is admin
      const { data: isAdminData, error: isAdminError } = await supabase.rpc(
        'has_role',
        { requested_role: 'admin' }
      );
      
      if (isAdminError) {
        throw isAdminError;
      }
      
      // Then fetch the actual role from user_roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError && roleError.code !== 'PGRST116') {
        throw roleError;
      }

      const role = roleData?.role || 'guest';
      
      setAuthState({
        user: authState.user,
        role: role as UserRole,
        isAdmin: isAdminData === true,
        isLoading: false
      });

    } catch (error: any) {
      console.error("Error fetching user role:", error);
      toast({
        title: "Error fetching user role",
        description: "There was an error retrieving your access level.",
        variant: "destructive",
      });
      
      setAuthState(prev => ({ 
        ...prev, 
        role: 'guest', // Default to guest on error
        isAdmin: false,
        isLoading: false
      }));
    }
  };

  return authState;
};
