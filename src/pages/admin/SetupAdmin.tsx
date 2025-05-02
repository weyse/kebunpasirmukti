
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function SetupAdmin() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const navigate = useNavigate();

  // Check if there are any admins already
  useEffect(() => {
    const checkAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('id')
          .eq('role', 'admin');
          
        if (error) {
          throw error;
        }
        
        setAdminCount(data?.length || 0);
      } catch (error) {
        console.error('Error checking admin count:', error);
      }
    };
    
    checkAdmins();
  }, []);

  const promoteToAdmin = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update the current user's role to admin
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success!',
        description: 'You have been promoted to admin. The page will reload to apply changes.',
      });
      
      // Reload the page to update auth context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error promoting to admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to promote to admin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-500" />
            <CardTitle>Admin Status Active</CardTitle>
          </div>
          <CardDescription>
            You already have admin privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p>Your account has admin privileges</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/admin/users')} variant="outline" className="w-full">
            Go to User Management
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-pasirmukti-500" />
          <CardTitle>Admin Setup</CardTitle>
        </div>
        <CardDescription>
          {adminCount === 0 
            ? "No admin accounts found. You can promote yourself to admin." 
            : "There are already admin accounts set up."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {adminCount === 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <p>No admin accounts detected in the system</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Promote yourself to admin to unlock full system management capabilities. 
              This should only be done for the initial system setup.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <p>Admin accounts already exist</p>
            </div>
            <p className="text-sm text-muted-foreground">
              There {adminCount === 1 ? 'is' : 'are'} already {adminCount} admin {adminCount === 1 ? 'account' : 'accounts'} in the system.
              You can still promote yourself if needed.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={promoteToAdmin} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Processing..." : "Promote Me to Admin"}
        </Button>
      </CardFooter>
    </Card>
  );
}
