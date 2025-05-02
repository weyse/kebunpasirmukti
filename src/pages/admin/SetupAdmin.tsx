
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
      // Use direct SQL execution to bypass RLS policies
      // First delete any existing roles
      const { error: deleteError } = await supabase.rpc('remove_user_role', {
        user_id_param: user.id
      });
      
      if (deleteError) {
        console.error("Error removing existing role:", deleteError);
        // Continue anyway to try the insert
      }
      
      // Then insert the admin role
      const { error: insertError } = await supabase.rpc('add_admin_role', {
        user_id_param: user.id
      });
      
      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: 'Berhasil!',
        description: 'Anda telah menjadi admin. Halaman akan dimuat ulang untuk menerapkan perubahan.',
        variant: 'default',
      });
      
      // Reload the page to update auth context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error promoting to admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Gagal mempromosikan menjadi admin',
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
            <CardTitle>Status Admin Aktif</CardTitle>
          </div>
          <CardDescription>
            Anda sudah memiliki hak akses admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p>Akun Anda memiliki hak akses admin</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/admin/users')} variant="outline" className="w-full">
            Ke Manajemen Pengguna
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
          <CardTitle>Setup Admin</CardTitle>
        </div>
        <CardDescription>
          {adminCount === 0 
            ? "Tidak ada akun admin ditemukan. Anda dapat mempromosikan diri menjadi admin." 
            : `Ada ${adminCount} akun admin yang sudah diatur.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {adminCount === 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <p>Tidak ada akun admin terdeteksi dalam sistem</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Promosikan diri Anda menjadi admin untuk membuka kemampuan manajemen sistem lengkap.
              Ini hanya perlu dilakukan untuk pengaturan sistem awal.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <p>Akun admin sudah ada</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Sudah ada {adminCount} akun admin dalam sistem.
              Anda masih dapat mempromosikan diri jika diperlukan.
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
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Promosikan Saya Menjadi Admin"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
