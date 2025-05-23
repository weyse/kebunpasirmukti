
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Shield, UserX, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  role: 'admin' | 'guest';
  full_name?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState<UserData | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null); // Reset error state when fetching
    
    try {
      // First get current session to ensure we have authentication
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('You must be logged in to view users');
      }
      
      // Get user profile information from auth.getUser()
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw new Error(`Error getting current user: ${userError.message}`);
      }
      
      // Fetch all user roles from public.user_roles table
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError) {
        throw new Error(`Error fetching roles: ${rolesError.message}`);
      }
      
      // Get all users who have a role - we can't query auth.users directly
      // so we'll use the user_roles table as a starting point
      const roleUsers = rolesData || [];
      
      // For each user role, get the user details from the current user
      // (this is a limitation since we can't query auth.users directly)
      let allUsers: UserData[] = [];
      
      // Add the current user to the list
      if (userData.user) {
        const userRole = roleUsers.find(r => r.user_id === userData.user?.id);
        allUsers.push({
          id: userData.user.id,
          email: userData.user.email || '',
          created_at: userData.user.created_at || '',
          role: (userRole?.role as 'admin' | 'guest') || 'guest',
          full_name: userData.user.user_metadata?.full_name,
        });
      }
      
      // Fetch other users from user_roles table
      // Note: This is a workaround since we can't access auth.users directly
      const uniqueUserIds = [...new Set(roleUsers.map(r => r.user_id))];
      
      // Filter out users we already have
      const otherUserIds = uniqueUserIds.filter(id => id !== userData.user?.id);
      
      // For demo purposes, we'll just show the roles for users we can't fully access
      // In a real application, you would need to use administrative API access
      for (const userId of otherUserIds) {
        const userRole = roleUsers.find(r => r.user_id === userId);
        // Add a placeholder user with the role information we have
        allUsers.push({
          id: userId,
          email: `User ID: ${userId.substring(0, 8)}...`,
          created_at: new Date().toISOString(),
          role: (userRole?.role as 'admin' | 'guest') || 'guest',
          full_name: 'Unknown User', // We don't have access to user metadata
        });
      }
      
      setUsers(allUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users data');
      toast({
        title: 'Error',
        description: 'Failed to load users data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRoleUpdate = async (user: UserData, newRole: 'admin' | 'guest') => {
    try {
      // First determine if this is an insert or update operation
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let error;
      
      if (existingRole) {
        // Update existing role
        ({ error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', user.id));
      } else {
        // Insert new role
        ({ error } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: newRole }));
      }
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, role: newRole } : u
      ));
      
      toast({
        title: 'Role updated',
        description: `User is now a ${newRole}`,
      });
      
      setIsUpdateDialogOpen(false);
      setUserToUpdate(null);
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Button 
          onClick={() => fetchUsers()} 
          variant="outline" 
          size="sm"
        >
          Reload Data
        </Button>
      </div>
      
      <Table>
        <TableCaption>List of all users in the system</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pasirmukti-500"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                No users found matching your search
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.full_name || 'N/A'}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <Badge className="bg-pasirmukti-500">
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">Guest</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy') : 'Unknown'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUserToUpdate(user);
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    {user.role === 'admin' ? 'Demote to Guest' : 'Promote to Admin'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Role Update Dialog */}
      <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              {userToUpdate?.role === 'admin' ? (
                <>
                  Are you sure you want to demote <strong>{userToUpdate?.email}</strong> from Admin to Guest?
                  <br /><br />
                  This user will lose all admin privileges.
                </>
              ) : (
                <>
                  Are you sure you want to promote <strong>{userToUpdate?.email}</strong> from Guest to Admin?
                  <br /><br />
                  This will grant the user full administrative access.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (userToUpdate) {
                  handleRoleUpdate(userToUpdate, userToUpdate.role === 'admin' ? 'guest' : 'admin');
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
