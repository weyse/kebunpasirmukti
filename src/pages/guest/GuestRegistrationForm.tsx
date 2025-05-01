
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Define form schema
const formSchema = z.object({
  responsiblePerson: z.string().min(2, 'Nama harus diisi').max(100),
  institutionName: z.string().min(2, 'Nama institusi harus diisi').max(100),
  phoneNumber: z.string().min(10, 'Nomor telepon tidak valid').max(15),
  email: z.string().email('Format email tidak valid'),
  adultCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Jumlah harus berupa angka positif',
  }),
  childrenCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Jumlah harus berupa angka positif',
  }),
  activityType: z.string().min(1, 'Jenis kegiatan harus dipilih'),
  visitDate: z.date({
    required_error: 'Tanggal kunjungan harus dipilih',
  }),
  arrivalTime: z.string().min(1, 'Waktu kedatangan harus diisi'),
  departureTime: z.string().min(1, 'Waktu kepulangan harus diisi'),
  paymentMethod: z.string().min(1, 'Metode pembayaran harus dipilih'),
  paymentStatus: z.string().min(1, 'Status pembayaran harus dipilih'),
  notes: z.string().optional(),
});

// Define component
const GuestRegistrationForm = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsiblePerson: '',
      institutionName: '',
      phoneNumber: '',
      email: '',
      adultCount: '0',
      childrenCount: '0',
      activityType: '',
      visitDate: undefined,
      arrivalTime: '',
      departureTime: '',
      paymentMethod: '',
      paymentStatus: '',
      notes: '',
    },
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Generate unique order ID
    const orderId = `PSD-${Date.now().toString(36).toUpperCase()}`;
    
    // Combine form values with order ID
    const formData = {
      ...values,
      orderId,
      totalVisitors: parseInt(values.adultCount) + parseInt(values.childrenCount),
      documentFile: uploadedFile?.name || null,
      createdAt: new Date(),
    };

    console.log('Form submitted:', formData);
    
    // Show success notification
    toast.success('Registrasi berhasil disimpan', {
      description: `ID Pesanan: ${orderId}`,
    });

    // Navigate back to guest list
    navigate('/guest-registration');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/guest-registration')} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <h1 className="text-3xl font-bold">Registrasi Tamu Baru</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="responsiblePerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Penanggung Jawab</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Institusi / Sekolah / Grup</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama institusi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="08xxxxxxxxxx" {...field} />
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
                        <Input placeholder="email@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <FormField
                    control={form.control}
                    name="adultCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Pengunjung (Dewasa)</FormLabel>
                        <FormControl>
                          <Input placeholder="0" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="childrenCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Pengunjung (Anak-anak)</FormLabel>
                        <FormControl>
                          <Input placeholder="0" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kegiatan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis kegiatan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wisata_edukasi">Wisata Edukasi</SelectItem>
                          <SelectItem value="outbound">Outbound</SelectItem>
                          <SelectItem value="camping">Camping</SelectItem>
                          <SelectItem value="field_trip">Field Trip</SelectItem>
                          <SelectItem value="penelitian">Penelitian</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Kunjungan</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="arrivalTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Kedatangan</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Kepulangan</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metode Pembayaran</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode pembayaran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tunai">Tunai</SelectItem>
                          <SelectItem value="transfer_bank">Transfer Bank</SelectItem>
                          <SelectItem value="qris">QRIS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Pembayaran</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status pembayaran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
                          <SelectItem value="lunas">Lunas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Upload Dokumen/Identitas (Opsional)</FormLabel>
                <div className="mt-2 flex items-center space-x-4">
                  <label
                    htmlFor="file-upload"
                    className="flex cursor-pointer items-center rounded-md border border-input px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadedFile ? uploadedFile.name : 'Pilih File'}
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {uploadedFile && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setUploadedFile(null)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Maksimal 5MB (PDF, JPG, PNG)
                </p>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan Tambahan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Catatan tambahan (opsional)"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/guest-registration')}
                >
                  Batal
                </Button>
                <Button 
                  type="submit"
                  className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
                >
                  Simpan Registrasi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestRegistrationForm;
