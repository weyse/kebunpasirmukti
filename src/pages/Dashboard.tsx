import React from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { isAdmin, user } = useAuth();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Selamat Datang, {user?.user_metadata?.full_name || 'User'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isAdmin ? 
            'Kelola reservasi, pengguna, dan akses sistem dari dashboard ini' : 
            'Lihat jadwal kunjungan dan detail reservasi Anda di dashboard ini'}
        </p>
      </div>
      
      {/* Show admin panel only to admins */}
      {isAdmin && <AdminPanel />}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Kunjungan Hari Ini</h2>
          <p className="text-3xl font-bold text-pasirmukti-600">5</p>
          <p className="text-sm text-gray-500 mt-2">Total kunjungan terjadwal</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pengunjung Minggu Ini</h2>
          <p className="text-3xl font-bold text-pasirmukti-600">127</p>
          <p className="text-sm text-gray-500 mt-2">Total pengunjung</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pendapatan Bulan Ini</h2>
          <p className="text-3xl font-bold text-pasirmukti-600">Rp 15.7jt</p>
          <p className="text-sm text-gray-500 mt-2">Dari 23 kunjungan</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Kunjungan Mendatang</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <p className="font-medium">SD Harapan Bangsa</p>
                <p className="text-sm text-gray-500">120 pengunjung</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-pasirmukti-600">24 Mei 2023</p>
                <p className="text-sm text-gray-500">Wisata Edukasi</p>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <p className="font-medium">TK Ceria</p>
                <p className="text-sm text-gray-500">45 pengunjung</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-pasirmukti-600">26 Mei 2023</p>
                <p className="text-sm text-gray-500">Field Trip</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">SMP Tunas Bangsa</p>
                <p className="text-sm text-gray-500">90 pengunjung</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-pasirmukti-600">30 Mei 2023</p>
                <p className="text-sm text-gray-500">Camping</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Status Pembayaran</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <p className="font-medium">SD Harapan Bangsa</p>
                <p className="text-sm text-gray-500">INV-20230524</p>
              </div>
              <div>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Lunas</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <p className="font-medium">TK Ceria</p>
                <p className="text-sm text-gray-500">INV-20230526</p>
              </div>
              <div>
                <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">DP 50%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">SMP Tunas Bangsa</p>
                <p className="text-sm text-gray-500">INV-20230530</p>
              </div>
              <div>
                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Belum Bayar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
