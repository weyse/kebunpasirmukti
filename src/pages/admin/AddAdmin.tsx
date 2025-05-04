
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const adminFormSchema = z.object({
  email: z.string().email('Email tidak valid').min(1, 'Email harus diisi'),
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Password minimal 6 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export default function AddAdmin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof adminFormSchema>) => {
    setIsLoading(true);
    
    try {
      // Step 1: Create the user in Supabase Auth
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });
      
      if (userError) {
        throw userError;
      }
      
      if (!userData || !userData.user) {
        throw new Error('Gagal membuat pengguna');
      }
      
      // Step 2: Call the add_admin_role function to assign admin role
      const { error: roleError } = await supabase.rpc(
        'add_admin_role', 
        { user_id_param: userData.user.id }
      );
      
      if (roleError) {
        throw roleError;
      }
      
      toast({
        title: 'Admin berhasil dibuat',
        description: `${values.email} telah ditambahkan sebagai admin`,
      });
      
      form.reset();
      
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Gagal membuat pengguna admin',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tambah Admin Baru</h1>
        <Button variant="outline" onClick={() => navigate('/admin/users')}>
          Kembali ke Daftar Pengguna
        </Button>
      </div>
      
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-pasirmukti-500" />
            <CardTitle className="text-xl">Buat Akun Admin Baru</CardTitle>
          </div>
          <CardDescription>
            Tambahkan pengguna admin baru yang akan memiliki akses penuh ke sistem
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isLoading ? 'Membuat...' : 'Buat Akun Admin'}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="bg-muted/50 text-sm text-muted-foreground">
          <p>Pengguna admin baru akan memiliki akses penuh ke semua fitur sistem</p>
        </CardFooter>
      </Card>
    </div>
  );
}
