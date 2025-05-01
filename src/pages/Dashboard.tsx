
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Users, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the dashboard
const visitData = [
  { name: 'Jan', visitors: 400 },
  { name: 'Feb', visitors: 300 },
  { name: 'Mar', visitors: 600 },
  { name: 'Apr', visitors: 800 },
  { name: 'Mei', visitors: 500 },
  { name: 'Jun', visitors: 700 },
];

const upcomingVisits = [
  { id: '001', name: 'SD Negeri 1 Cisarua', date: '2025-05-05', count: 120 },
  { id: '002', name: 'TK Harapan Bunda', date: '2025-05-07', count: 45 },
  { id: '003', name: 'Komunitas Pecinta Alam', date: '2025-05-10', count: 25 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
          onClick={() => navigate('/guest-registration/new')}
        >
          + Registrasi Baru
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kunjungan</CardTitle>
            <CalendarCheck className="h-4 w-4 text-pasirmukti-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +12% dari bulan sebelumnya
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengunjung</CardTitle>
            <Users className="h-4 w-4 text-pasirmukti-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,281</div>
            <p className="text-xs text-muted-foreground">
              +8% dari bulan sebelumnya
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-pasirmukti-500"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 85,420,000</div>
            <p className="text-xs text-muted-foreground">
              +14% dari bulan sebelumnya
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Statistik Kunjungan</CardTitle>
            <CardDescription>Jumlah pengunjung per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visitData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#40916c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Kunjungan Mendatang</CardTitle>
            <CardDescription>Kunjungan yang akan datang dalam waktu dekat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingVisits.map((visit) => (
                <div key={visit.id} className="flex items-center space-x-4">
                  <div className="bg-pasirmukti-100 rounded-full p-2">
                    <Calendar className="h-5 w-5 text-pasirmukti-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{visit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(visit.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="rounded-full bg-pasirmukti-100 px-2.5 py-0.5 text-xs font-semibold text-pasirmukti-700">
                      {visit.count} orang
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/visit-list')}>
              Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
