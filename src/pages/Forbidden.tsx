
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, Home } from 'lucide-react';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#DCFCE7_100%)]" />
      
      <div className="max-w-md text-center">
        <ShieldX className="mx-auto h-24 w-24 text-red-500" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Akses Dibatasi
        </h1>
        <p className="mt-4 text-base text-gray-500">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini memerlukan akses admin.
        </p>
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
