
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminPanel() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-muted-foreground">
            Panel khusus untuk pengelola sistem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-pasirmukti-500" />
          <span className="font-medium text-pasirmukti-600">Admin Area</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Kelola Pengguna
            </CardTitle>
            <CardDescription>
              Lihat dan kelola akun pengguna dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/admin/users')}
              className="w-full"
              variant="outline"
            >
              Kelola Pengguna
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Tambah Admin Baru
            </CardTitle>
            <CardDescription>
              Tambahkan admin baru ke sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/admin/add-admin')}
              className="w-full"
              variant="outline"
            >
              Tambah Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
