
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SetupAdmin() {
  const { user, isAdmin } = useAuth();
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
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-pasirmukti-500" />
          <CardTitle>Status Admin</CardTitle>
        </div>
        <CardDescription>
          {adminCount === 0 
            ? "Tidak ada akun admin ditemukan." 
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
              Gunakan SQL query untuk menjadi admin.
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
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
