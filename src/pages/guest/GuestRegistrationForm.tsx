
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Upload, Loader2 } from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Checkbox
} from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define form schema
const formSchema = z.object({
  // Basic Information
  responsiblePerson: z.string().min(2, 'Nama harus diisi').max(100),
  institutionName: z.string().min(2, 'Nama institusi harus diisi').max(100),
  phoneNumber: z.string().min(10, 'Nomor telepon tidak valid').max(15),
  address: z.string().optional(),
  visitDate: z.date({
    required_error: 'Tanggal kunjungan harus dipilih',
  }),
  
  // Participants
  adultCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Jumlah harus berupa angka positif',
  }),
  childrenCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Jumlah harus berupa angka positif',
  }),
  teacherCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Jumlah harus berupa angka positif',
  }),
  
  // Activity & Packages
  activityType: z.string().min(1, 'Jenis kegiatan harus dipilih'),
  packageType: z.string().min(1, 'Jenis paket harus dipilih'),
  
  // Classes (will be handled separately)
  
  // Payment
  paymentMethod: z.string().min(1, 'Metode pembayaran harus dipilih'),
  paymentStatus: z.enum(['belum_lunas', 'lunas'], {
    required_error: 'Status pembayaran harus dipilih',
  }),
  downPayment: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
    message: 'Nilai harus berupa angka positif',
  }),
  paymentDate: z.date().optional(),
  
  // Additional notes
  notes: z.string().optional(),
});

// Define class types
const classTypes = [
  { id: 'kb_tk', label: 'KB/TK' },
  { id: 'sd_1_2', label: 'SD Kelas 1-2' },
  { id: 'sd_3_4', label: 'SD Kelas 3-4' },
  { id: 'sd_5_6', label: 'SD Kelas 5-6' },
  { id: 'smp', label: 'SMP' },
  { id: 'sma', label: 'SMA' },
  { id: 'umum_a', label: 'Umum A' },
  { id: 'umum_b', label: 'Umum B' },
  { id: 'abk', label: 'ABK' },
];

// Activity types mapping
const activityTypes = [
  { value: 'wisata_edukasi', label: 'Wisata Edukasi' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'camping', label: 'Camping' },
  { value: 'field_trip', label: 'Field Trip' },
  { value: 'penelitian', label: 'Penelitian' },
  { value: 'lainnya', label: 'Lainnya' },
];

// Convert string to enum type
const visitTypeToEnum = (visitType: string): "wisata_edukasi" | "outbound" | "camping" | "field_trip" | "penelitian" | "lainnya" => {
  if (["wisata_edukasi", "outbound", "camping", "field_trip", "penelitian", "lainnya"].includes(visitType)) {
    return visitType as "wisata_edukasi" | "outbound" | "camping" | "field_trip" | "penelitian" | "lainnya";
  }
  return "lainnya"; // Default fallback
};

// Convert string to class type enum
const classTypeToEnum = (classType: string): "kb_tk" | "sd_1_2" | "sd_3_4" | "sd_5_6" | "smp" | "sma" | "umum_a" | "umum_b" | "abk" => {
  if (["kb_tk", "sd_1_2", "sd_3_4", "sd_5_6", "smp", "sma", "umum_a", "umum_b", "abk"].includes(classType)) {
    return classType as "kb_tk" | "sd_1_2" | "sd_3_4" | "sd_5_6" | "smp" | "sma" | "umum_a" | "umum_b" | "abk";
  }
  return "umum_a"; // Default fallback
};

// Define component
const GuestRegistrationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [calculatedCost, setCalculatedCost] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState('info');
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsiblePerson: '',
      institutionName: '',
      phoneNumber: '',
      address: '',
      adultCount: '0',
      childrenCount: '0',
      teacherCount: '0',
      activityType: '',
      packageType: '',
      paymentMethod: '',
      paymentStatus: 'belum_lunas',
      downPayment: '0',
      notes: '',
    },
  });

  // Watch form values for cost calculation
  const adultCount = parseInt(form.watch('adultCount') || '0');
  const childrenCount = parseInt(form.watch('childrenCount') || '0');
  const teacherCount = parseInt(form.watch('teacherCount') || '0');
  const packageType = form.watch('packageType');
  
  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPackages(data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load package data',
          variant: 'destructive',
        });
      }
    };
    
    fetchPackages();
  }, []);

  // Fetch registration data if in edit mode
  useEffect(() => {
    const fetchRegistration = async () => {
      if (!isEditMode) return;
      
      setIsLoading(true);
      try {
        // Fetch main registration data
        const { data: registration, error: regError } = await supabase
          .from('guest_registrations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (regError) throw regError;
        
        if (registration) {
          // Populate form with fetched data
          form.setValue('responsiblePerson', registration.responsible_person);
          form.setValue('institutionName', registration.institution_name);
          form.setValue('phoneNumber', registration.phone_number);
          form.setValue('address', registration.address || '');
          form.setValue('visitDate', new Date(registration.visit_date));
          form.setValue('adultCount', registration.adult_count.toString());
          form.setValue('childrenCount', registration.children_count.toString());
          form.setValue('teacherCount', registration.teacher_count.toString());
          form.setValue('activityType', registration.visit_type);
          form.setValue('packageType', registration.package_type);
          form.setValue('paymentStatus', registration.payment_status);
          form.setValue('downPayment', registration.down_payment?.toString() || '0');
          form.setValue('notes', registration.notes || '');
          
          if (registration.payment_date) {
            form.setValue('paymentDate', new Date(registration.payment_date));
          }
          
          // Fetch selected classes
          const { data: classes } = await supabase
            .from('guest_classes')
            .select('class_type')
            .eq('registration_id', id);
            
          if (classes && classes.length > 0) {
            const selectedClassIds = classes.map(c => c.class_type);
            setSelectedClasses(selectedClassIds);
          }
        }
      } catch (error) {
        console.error('Error fetching registration data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load registration data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRegistration();
  }, [id, isEditMode, form]);

  // Calculate cost based on selected package and participant counts
  useEffect(() => {
    if (!packageType || !packages.length) return;
    
    const selectedPackage = packages.find(pkg => pkg.package_type === packageType);
    if (!selectedPackage) return;
    
    const adultTotal = adultCount * selectedPackage.price_per_adult;
    const childrenTotal = childrenCount * selectedPackage.price_per_child;
    const teacherTotal = teacherCount * selectedPackage.price_per_teacher;
    
    const total = adultTotal + childrenTotal + teacherTotal;
    setCalculatedCost(total);
  }, [packageType, adultCount, childrenCount, teacherCount, packages]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Toggle class selection
  const toggleClass = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter(id => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  // Function to navigate to next tab
  const goToNextTab = (currentTab: string) => {
    const tabOrder = ['info', 'participants', 'activity', 'payment', 'summary'];
    const currentIndex = tabOrder.indexOf(currentTab);
    
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Prepare registration data
      const registrationData = {
        responsible_person: values.responsiblePerson,
        institution_name: values.institutionName,
        phone_number: values.phoneNumber,
        address: values.address,
        visit_date: values.visitDate.toISOString().split('T')[0],
        adult_count: parseInt(values.adultCount),
        children_count: parseInt(values.childrenCount),
        teacher_count: parseInt(values.teacherCount),
        visit_type: visitTypeToEnum(values.activityType),
        package_type: values.packageType,
        notes: values.notes,
        total_cost: calculatedCost,
        discounted_cost: calculatedCost, // No discount applied yet
        down_payment: values.downPayment ? parseFloat(values.downPayment) : 0,
        payment_date: values.paymentDate ? values.paymentDate.toISOString().split('T')[0] : null,
        bank_name: values.paymentMethod,
        payment_status: values.paymentStatus,
      };
      
      let registrationId: string;
      
      // Insert or update registration
      if (isEditMode) {
        // Update existing registration
        const { error: updateError } = await supabase
          .from('guest_registrations')
          .update(registrationData)
          .eq('id', id);
          
        if (updateError) throw updateError;
        registrationId = id!;
        
        // Delete existing classes to be replaced with new selections
        await supabase
          .from('guest_classes')
          .delete()
          .eq('registration_id', id);
      } else {
        // Create new registration
        const { data: newReg, error: insertError } = await supabase
          .from('guest_registrations')
          .insert(registrationData)
          .select('id')
          .single();
          
        if (insertError) throw insertError;
        registrationId = newReg.id;
      }
      
      // Insert selected classes
      if (selectedClasses.length > 0) {
        const classData = selectedClasses.map(classType => ({
          registration_id: registrationId,
          class_type: classTypeToEnum(classType),
        }));
        
        const { error: classError } = await supabase
          .from('guest_classes')
          .insert(classData);
          
        if (classError) throw classError;
      }
      
      // Show success message
      toast({
        title: isEditMode ? 'Data berhasil diperbarui' : 'Registrasi berhasil disimpan',
        description: `ID: ${registrationId}`,
      });
      
      // Navigate back to guest list
      navigate('/guest-registration');
    } catch (error) {
      console.error('Error saving registration:', error);
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat menyimpan data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-pasirmukti-500" />
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/guest-registration')} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? 'Edit Registrasi Tamu' : 'Registrasi Tamu Baru'}
        </h1>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="info">Informasi Dasar</TabsTrigger>
          <TabsTrigger value="participants">Peserta</TabsTrigger>
          <TabsTrigger value="activity">Kegiatan & Paket</TabsTrigger>
          <TabsTrigger value="payment">Pembayaran</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <TabsContent value="info" className="space-y-6">
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
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Alamat</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Alamat lengkap" 
                              className="resize-none"
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button 
                      type="button"
                      onClick={() => goToNextTab('info')}
                      className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="adultCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Peserta (Dewasa)</FormLabel>
                          <FormControl>
                            <Input placeholder="0" type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Pengunjung dewasa
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="childrenCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Peserta (Anak-anak)</FormLabel>
                          <FormControl>
                            <Input placeholder="0" type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Pengunjung anak-anak
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teacherCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Guru/Pendamping</FormLabel>
                          <FormControl>
                            <Input placeholder="0" type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Guru atau pendamping
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Pilihan Kelas yang Berkunjung</h3>
                    <div className="grid gap-2 md:grid-cols-3">
                      {classTypes.map((classType) => (
                        <div key={classType.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${classType.id}`}
                            checked={selectedClasses.includes(classType.id)}
                            onCheckedChange={() => toggleClass(classType.id)}
                          />
                          <label
                            htmlFor={`class-${classType.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {classType.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('info')}
                    >
                      Kembali
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => goToNextTab('participants')}
                      className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
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
                              {activityTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="packageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pilihan Paket</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih paket kegiatan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {packages.map((pkg) => (
                                <SelectItem key={pkg.package_type} value={pkg.package_type}>
                                  {pkg.name} (Rp {parseInt(pkg.price_per_adult).toLocaleString('id')}/org)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Upload Dokumen/Identitas (Opsional)</h3>
                    <div className="flex items-center space-x-4">
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

                  <div className="flex justify-between mt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('participants')}
                    >
                      Kembali
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => goToNextTab('activity')}
                      className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="downPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Down Payment (DP)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Jumlah pembayaran awal
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank/Metode Pembayaran</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih bank/metode pembayaran" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bni">BNI</SelectItem>
                              <SelectItem value="bri">BRI</SelectItem>
                              <SelectItem value="bca">BCA</SelectItem>
                              <SelectItem value="mandiri">Mandiri</SelectItem>
                              <SelectItem value="cash">Tunai</SelectItem>
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
                    
                    <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Pembayaran</FormLabel>
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

                  <div>
                    <h3 className="text-lg font-medium mb-3">Perhitungan Biaya</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span>Dewasa ({adultCount || 0} orang)</span>
                        <span>Rp {((packageType && packages.find(p => p.package_type === packageType)?.price_per_adult || 0) * adultCount).toLocaleString('id')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Anak-anak ({childrenCount || 0} orang)</span>
                        <span>Rp {((packageType && packages.find(p => p.package_type === packageType)?.price_per_child || 0) * childrenCount).toLocaleString('id')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guru/Pendamping ({teacherCount || 0} orang)</span>
                        <span>Rp {((packageType && packages.find(p => p.package_type === packageType)?.price_per_teacher || 0) * teacherCount).toLocaleString('id')}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total Biaya</span>
                        <span>Rp {calculatedCost.toLocaleString('id')}</span>
                      </div>
                      <div className="flex justify-between text-pasirmukti-600 font-medium">
                        <span>Sisa yang Harus Dibayar</span>
                        <span>Rp {Math.max(0, calculatedCost - parseFloat(form.watch('downPayment') || '0')).toLocaleString('id')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab('activity')}
                    >
                      Kembali
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => goToNextTab('payment')}
                      className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-6">
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Penanggung Jawab</h4>
                        <p className="font-medium">{form.watch('responsiblePerson') || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Institusi</h4>
                        <p className="font-medium">{form.watch('institutionName') || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Nomor Telepon</h4>
                        <p className="font-medium">{form.watch('phoneNumber') || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Tanggal Kunjungan</h4>
                        <p className="font-medium">{form.watch('visitDate') ? format(form.watch('visitDate'), 'dd MMMM yyyy') : '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Jenis Kegiatan</h4>
                        <p className="font-medium">
                          {form.watch('activityType') ? 
                            activityTypes.find(t => t.value === form.watch('activityType'))?.label || '-' 
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Paket</h4>
                        <p className="font-medium">
                          {form.watch('packageType') ? 
                            packages.find(p => p.package_type === form.watch('packageType'))?.name || '-'
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Jumlah Peserta</h4>
                        <p className="font-medium">
                          {(parseInt(form.watch('adultCount') || '0') + 
                            parseInt(form.watch('childrenCount') || '0') + 
                            parseInt(form.watch('teacherCount') || '0'))} orang
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Status Pembayaran</h4>
                        <p className="font-medium">
                          {form.watch('paymentStatus') === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Biaya</h4>
                        <p className="text-lg font-semibold text-pasirmukti-600">
                          Rp {calculatedCost.toLocaleString('id')}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>

              <CardFooter className="flex justify-between space-x-4 pt-6 border-t">
                {currentTab === 'summary' && (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentTab('payment')}
                    >
                      Kembali
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="bg-pasirmukti-500 hover:bg-pasirmukti-600"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditMode ? 'Perbarui Registrasi' : 'Simpan Registrasi'}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default GuestRegistrationForm;
