import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { VisitStatsChart } from '@/components/dashboard/VisitStatsChart';
import { useDashboardMetrics } from '@/hooks/dashboard';

const Modal: React.FC<{ open: boolean; onClose: () => void; data: any; packageIdToName: Record<string, string> }> = ({ open, onClose, data, packageIdToName }) => {
  const [showRooms, setShowRooms] = React.useState(false);
  const [showVenues, setShowVenues] = React.useState(false);
  React.useEffect(() => { setShowRooms(false); setShowVenues(false); }, [data]);
  if (!open || !data) return null;

  // Helper to render a field nicely
  const renderField = (key: string, value: any) => {
    if (key === 'package_type') {
      return packageIdToName[value] || value;
    }
    if (key === 'packages_json' && Array.isArray(value)) {
      return (
        <table className="w-full text-sm border mt-2 mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 border">Nama Paket</th>
              <th className="p-1 border">Dewasa</th>
              <th className="p-1 border">Anak</th>
              <th className="p-1 border">Guru</th>
            </tr>
          </thead>
          <tbody>
            {value.map((pkg: any, i: number) => (
              <tr key={i}>
                <td className="p-1 border">{packageIdToName[pkg.package_type] || pkg.name || pkg.package_type}</td>
                <td className="p-1 border text-center">{pkg.adult_count}</td>
                <td className="p-1 border text-center">{pkg.children_count}</td>
                <td className="p-1 border text-center">{pkg.teacher_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (key === 'rooms_json') {
      return (
        <div>
          <button className="text-blue-600 underline mb-1" onClick={() => setShowRooms(v => !v)}>
            {showRooms ? 'Sembunyikan Detail' : 'Lihat Detail'}
          </button>
          {showRooms && (
            <pre className="bg-gray-50 rounded p-2 text-xs overflow-x-auto max-h-40">{JSON.stringify(value, null, 2)}</pre>
          )}
        </div>
      );
    }
    if (key === 'venues_json') {
      return (
        <div>
          <button className="text-blue-600 underline mb-1" onClick={() => setShowVenues(v => !v)}>
            {showVenues ? 'Sembunyikan Detail' : 'Lihat Detail'}
          </button>
          {showVenues && (
            <pre className="bg-gray-50 rounded p-2 text-xs overflow-x-auto max-h-40">{JSON.stringify(value, null, 2)}</pre>
          )}
        </div>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return <span className="text-gray-400 italic">(data tersedia)</span>;
    }
    return value === null || value === undefined ? '-' : value;
  };

  // Fields to show, in order (only the most important by default)
  const fields = [
    { key: 'order_id', label: 'Order ID' },
    { key: 'institution_name', label: 'Institusi' },
    { key: 'responsible_person', label: 'Penanggung Jawab' },
    { key: 'visit_date', label: 'Tanggal Kunjungan' },
    { key: 'visit_type', label: 'Tipe Kunjungan' },
    { key: 'package_type', label: 'Paket (Utama)' },
    { key: 'adult_count', label: 'Dewasa' },
    { key: 'children_count', label: 'Anak' },
    { key: 'teacher_count', label: 'Guru' },
    { key: 'free_of_charge_teacher_count', label: 'Guru Gratis' },
    { key: 'total_cost', label: 'Total Biaya' },
    { key: 'discount_percentage', label: 'Diskon (%)' },
    { key: 'discounted_cost', label: 'Biaya Setelah Diskon' },
    { key: 'payment_status', label: 'Status Pembayaran' },
    { key: 'packages_json', label: 'Paket Lainnya' },
    { key: 'rooms_json', label: 'Kamar' },
    { key: 'venues_json', label: 'Venue' },
    { key: 'created_at', label: 'Dibuat Pada' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl z-10" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Detail Kunjungan</h2>
        <div className="divide-y max-h-[70vh] overflow-y-auto pr-2">
          {fields.map(({ key, label }) => (
            key in data && (
              <div key={key} className="flex py-2">
                <div className="w-1/3 font-medium text-gray-700">{label}</div>
                <div className="w-2/3 text-gray-900">{renderField(key, data[key])}</div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

const intervalOptions = [
  { value: 'mingguan', label: 'Mingguan' },
  { value: 'bulanan', label: 'Bulanan' },
  { value: 'tahunan', label: 'Tahunan' },
];

const Laporan: React.FC = () => {
  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [packageType, setPackageType] = useState('');
  const [institution, setInstitution] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Data state
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Packages state
  const [packages, setPackages] = useState<any[]>([]);

  // Summary state
  const [summary, setSummary] = useState({
    totalVisits: 0,
    totalRevenue: 0,
    totalParticipants: 0,
    topPackage: ''
  });

  // Selected row state
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  // Dashboard chart state
  const { metrics, isLoading: chartLoading, updateChartPeriod } = useDashboardMetrics();

  // Fetch all packages for mapping UUID to name
  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase.from('packages').select('id, name');
      if (!error && data) setPackages(data);
    };
    fetchPackages();
  }, []);

  // Create a mapping from package id to name
  const packageIdToName = React.useMemo(() => {
    const map: Record<string, string> = {};
    packages.forEach(pkg => {
      map[pkg.id] = pkg.name;
    });
    return map;
  }, [packages]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let query = (supabase as any)
        .from('laporan_view')
        .select('*');
      if (startDate) query = query.gte('visit_date', startDate);
      if (endDate) query = query.lte('visit_date', endDate);
      if (packageType && packageType !== 'Semua') query = query.eq('package_type', packageType);
      if (institution) query = query.ilike('institution_name', `%${institution}%`);
      if (paymentStatus && paymentStatus !== 'Semua') query = query.eq('payment_status', paymentStatus);
      query = query.order('visit_date', { ascending: false });
      const { data, error } = await query;
      if (error) {
        setError(error.message);
        setData([]);
        setSummary({ totalVisits: 0, totalRevenue: 0, totalParticipants: 0, topPackage: '' });
      } else {
        setData(data || []);
        // Calculate summary
        const totalVisits = data.length;
        const totalRevenue = data.reduce((sum: number, row: any) => sum + (row.total_cost || 0), 0);
        const totalParticipants = data.reduce((sum: number, row: any) => sum + (row.adult_count || 0) + (row.children_count || 0) + (row.teacher_count || 0), 0);
        const packageCounts: Record<string, number> = {};
        data.forEach((row: any) => {
          if (row.package_type) packageCounts[row.package_type] = (packageCounts[row.package_type] || 0) + 1;
        });
        const topPackage = Object.entries(packageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
        setSummary({ totalVisits, totalRevenue, totalParticipants, topPackage });
      }
      setLoading(false);
    };
    fetchData();
  }, [startDate, endDate, packageType, institution, paymentStatus]);

  return (
    <div className="p-6 space-y-8">
      {/* 1. Filters/Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
          <input type="date" className="border rounded px-2 py-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
          <input type="date" className="border rounded px-2 py-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Paket</label>
          <select className="border rounded px-2 py-1" value={packageType} onChange={e => setPackageType(e.target.value)}>
            <option>Semua</option>
            {/* You can map package options here */}
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Institusi</label>
          <input type="text" placeholder="Cari institusi..." className="border rounded px-2 py-1" value={institution} onChange={e => setInstitution(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status Pembayaran</label>
          <select className="border rounded px-2 py-1" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
            <option>Semua</option>
            <option>Lunas</option>
            <option>Belum Lunas</option>
          </select>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Total Kunjungan</div>
          <div className="text-2xl font-bold">{loading ? '...' : summary.totalVisits}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Total Pendapatan</div>
          <div className="text-2xl font-bold">{loading ? '...' : `Rp ${summary.totalRevenue.toLocaleString('id-ID')}`}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Total Peserta</div>
          <div className="text-2xl font-bold">{loading ? '...' : summary.totalParticipants}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-muted-foreground">Paket Terpopuler</div>
          <div className="text-2xl font-bold">{loading ? '...' : (packageIdToName[summary.topPackage] || summary.topPackage)}</div>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded shadow p-4">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal Kunjungan</TableHead>
              <TableHead>Nama Paket</TableHead>
              <TableHead>Institusi</TableHead>
              <TableHead>Dewasa</TableHead>
              <TableHead>Anak</TableHead>
              <TableHead>Guru</TableHead>
              <TableHead>Total Biaya</TableHead>
              <TableHead>Diskon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={10}>Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={10}>Tidak ada data</TableCell></TableRow>
            ) : data.map((row, idx) => {
              // If packages_json exists, display each package in a new line in each cell
              const packages = Array.isArray(row.packages_json) ? row.packages_json : null;
              return (
                <TableRow key={row.id || idx}>
                  <TableCell>{row.visit_date}</TableCell>
                  <TableCell>
                    {packages ? packages.map((pkg, i) => (
                      <div key={i}>{packageIdToName[pkg.package_type] || pkg.name || pkg.package_type}</div>
                    )) : (packageIdToName[row.package_type] || row.package_type)}
                  </TableCell>
                  <TableCell>{row.institution_name}</TableCell>
                  <TableCell>
                    {packages ? packages.map((pkg, i) => (
                      <div key={i}>{pkg.adult_count}</div>
                    )) : row.adult_count}
                  </TableCell>
                  <TableCell>
                    {packages ? packages.map((pkg, i) => (
                      <div key={i}>{pkg.children_count}</div>
                    )) : row.children_count}
                  </TableCell>
                  <TableCell>
                    {packages ? packages.map((pkg, i) => (
                      <div key={i}>{pkg.teacher_count}</div>
                    )) : row.teacher_count}
                  </TableCell>
                  <TableCell>{row.total_cost ? `Rp ${row.total_cost.toLocaleString('id-ID')}` : '-'}</TableCell>
                  <TableCell>{row.discount_percentage ? `${row.discount_percentage}%` : '-'}</TableCell>
                  <TableCell>{row.payment_status}</TableCell>
                  <TableCell>
                    <button className="text-blue-600 underline" onClick={() => setSelectedRow(row)}>Detail</button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 4. Statistik Kunjungan Chart */}
      <div className="bg-white rounded shadow p-4 mt-8">
        <VisitStatsChart
          data={metrics.monthlyVisits}
          isLoading={chartLoading}
          selectedPeriod={metrics.selectedPeriod}
          onPeriodChange={updateChartPeriod}
        />
      </div>

      <Modal open={!!selectedRow} onClose={() => setSelectedRow(null)} data={selectedRow} packageIdToName={packageIdToName} />
    </div>
  );
};

export default Laporan; 