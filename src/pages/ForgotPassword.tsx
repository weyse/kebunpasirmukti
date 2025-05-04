
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
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
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema
const forgotPasswordFormSchema = z.object({
  email: z.string().email('Email tidak valid').min(1, 'Email harus diisi'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof forgotPasswordFormSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setEmailSent(true);
      toast({
        title: 'Email terkirim',
        description: 'Silahkan cek inbox email Anda untuk instruksi reset password',
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: 'Reset password gagal',
        description: error.message || 'Terjadi kesalahan saat mengirim email reset',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#DCFCE7_100%)]" />
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4">
              <div className="h-12 w-12 rounded-full bg-pasirmukti-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Lupa Password
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Masukkan email Anda untuk menerima instruksi reset password
            </CardDescription>
          </CardHeader>

          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-md">
                  <h3 className="font-medium">Email terkirim!</h3>
                  <p className="text-sm mt-1">
                    Kami telah mengirimkan email dengan instruksi untuk mereset password Anda.
                  </p>
                </div>
                <Button 
                  className="w-full bg-pasirmukti-500 hover:bg-pasirmukti-600" 
                  onClick={() => navigate('/login')}
                >
                  Kembali ke Login
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="nama@email.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-pasirmukti-500 hover:bg-pasirmukti-600" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Mengirim...' : 'Kirim Instruksi Reset'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm">
              <Link to="/login" className="text-pasirmukti-600 hover:underline inline-flex items-center">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Kembali ke Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
