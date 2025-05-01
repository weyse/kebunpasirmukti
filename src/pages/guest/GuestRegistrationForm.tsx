
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';
import { Calendar, ArrowLeft } from 'lucide-react';

import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import ClassSelectionGroup from '@/components/registration/ClassSelectionGroup';
import PackageSelectionCard from '@/components/registration/PackageSelectionCard';
import AccommodationCard from '@/components/registration/AccommodationCard';
import VenueCard from '@/components/registration/VenueCard';
import OrderSummary from '@/components/registration/OrderSummary';

// Define types to match database enum
type VisitType = 'wisata_edukasi' | 'outbound' | 'camping' | 'field_trip' | 'penelitian' | 'lainnya';
type PaymentStatus = 'belum_lunas' | 'lunas';
type ClassType = 'kb_tk' | 'sd_1_2' | 'sd_3_4' | 'sd_5_6' | 'smp' | 'sma' | 'umum_a' | 'umum_b' | 'abk';

// Define class options for selection - this could come from API/DB in the future
const classOptions = [
  { id: 'kb_tk', label: 'KB/TK' },
  { id: 'sd_1_2', label: 'SD Kelas 1 & 2' },
  { id: 'sd_3_4', label: 'SD Kelas 3 & 4' },
  { id: 'sd_5_6', label: 'SD Kelas 5 & 6' },
  { id: 'smp', label: 'SMP' },
  { id: 'sma', label: 'SMA' },
  { id: 'umum_a', label: 'Umum A' },
  { id: 'umum_b', label: 'Umum B' },
  { id: 'abk', label: 'ABK' }
];

const formSchema = z.object({
  responsible_person: z.string().min(2, {
    message: "Nama penanggung jawab harus diisi minimal 2 karakter.",
  }),
  institution_name: z.string().min(2, {
    message: "Nama instansi harus diisi minimal 2 karakter.",
  }),
  phone_number: z.string().min(10, {
    message: "Nomor telepon harus diisi minimal 10 karakter.",
  }),
  address: z.string().min(10, {
    message: "Alamat harus diisi minimal 10 karakter.",
  }),
  visit_date: z.date({
    required_error: "Tanggal kunjungan harus dipilih.",
  }),
  adult_count: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, {
    message: "Jumlah dewasa harus berupa angka dan tidak boleh negatif.",
  }),
  children_count: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, {
    message: "Jumlah anak-anak harus berupa angka dan tidak boleh negatif.",
  }),
  teacher_count: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, {
    message: "Jumlah guru harus berupa angka dan tidak boleh negatif.",
  }),
  notes: z.string().optional(),
  document_url: z.string().optional(),
  discount_percentage: z.string().optional(),
  down_payment: z.string().optional(),
  payment_date: z.date().optional().nullable(),
  bank_name: z.string().optional(),
  payment_status: z.boolean().default(false),
});

const GuestRegistrationForm = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<ClassType[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [accommodationCounts, setAccommodationCounts] = useState<Record<string, number>>({});
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [discountedCost, setDiscountedCost] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [packages, setPackages] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsible_person: "",
      institution_name: "",
      phone_number: "",
      address: "",
      visit_date: new Date(),
      adult_count: "0",
      children_count: "0",
      teacher_count: "0",
      notes: "",
      document_url: "",
      discount_percentage: "0",
      down_payment: "0",
      payment_date: null,
      bank_name: "",
      payment_status: false,
    },
  });

  // Get form values for cost calculation
  const watchDiscount = form.watch("discount_percentage");
  const watchDownPayment = form.watch("down_payment");
  const watchAdultCount = form.watch("adult_count");
  const watchChildrenCount = form.watch("children_count");
  const watchTeacherCount = form.watch("teacher_count");

  useEffect(() => {
    // Fetch packages from database
    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*');

      if (error) {
        toast({
          title: "Error fetching packages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setPackages(data);
        // Initialize accommodation counts
        const initialCounts: Record<string, number> = {};
        data.forEach((pkg: any) => {
          initialCounts[pkg.id] = 0;
        });
        setAccommodationCounts(prev => ({...prev, ...initialCounts}));
      }
    };

    // Fetch accommodations (rooms) from database
    const fetchAccommodations = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');

      if (error) {
        toast({
          title: "Error fetching accommodations",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setAccommodations(data.map(room => ({
          id: room.id,
          name: room.room_name,
          price: room.price_per_night,
          details: `Capacity: ${room.capacity} people`,
          capacity: room.capacity,
          features: [room.room_type],
        })));
        
        // Initialize accommodation counts
        const initialCounts: Record<string, number> = {};
        data.forEach(room => {
          initialCounts[room.id] = 0;
        });
        setAccommodationCounts(prev => ({...prev, ...initialCounts}));
      }
    };

    // This would be a real API call in production
    const fetchVenues = async () => {
      // Example venues - in a real app this would come from an API
      const mockVenues = [
        {
          id: 'saung_gardena',
          name: 'Saung Gardena',
          capacity: 100,
          price: 2660000,
          features: ['Toilet (WC)', 'Halaman Luas', 'Podium 2.2 m', 'Meja 2', 'Kursi kayu']
        },
        {
          id: 'saung_cempaka',
          name: 'Saung Cempaka',
          capacity: 300,
          price: 6000000,
          features: ['Mushollah', 'Toilet (WC)', 'Podium 2.5 m', 'Meja 2', 'Kursi 100']
        },
        {
          id: 'saung_tribun',
          name: 'Saung Tribun 1 (S. Padi & Panggung)',
          capacity: 300,
          price: 6650000,
          features: ['Toilet (WC)', 'Panggung', 'Mushollah', 'Halaman luas', 'Meja 2']
        },
        {
          id: 'saung_kecapi',
          name: 'Saung Kecapi (Inc. Lapangan Futsal)',
          capacity: 80,
          price: 1995000,
          features: ['Toilet (WC)', 'Mushollah', 'Podium 2.2 m', 'Meja 2']
        },
      ];
      
      setVenues(mockVenues);
    };

    fetchPackages();
    fetchAccommodations();
    fetchVenues();

    if (editId) {
      fetchGuestRegistration(editId);
    }
  }, [editId]);

  useEffect(() => {
    calculateCosts();
  }, [
    watchAdultCount,
    watchChildrenCount, 
    watchTeacherCount,
    watchDiscount,
    watchDownPayment,
    selectedPackage,
    accommodationCounts,
    selectedVenues,
    packages,
    venues
  ]);

  const fetchGuestRegistration = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('guest_registrations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Format the visit_date and payment_date if they exist
        const formattedVisitDate = data.visit_date ? new Date(data.visit_date) : new Date();
        const formattedPaymentDate = data.payment_date ? new Date(data.payment_date) : null;
        
        // Convert payment_status enum to boolean
        const paymentStatusBool = data.payment_status === 'lunas';

        // Fetch classes if any
        const { data: classesData } = await supabase
          .from('guest_classes')
          .select('class_type')
          .eq('registration_id', id);
          
        if (classesData) {
          const classes = classesData.map(c => c.class_type) as ClassType[];
          setSelectedClasses(classes);
        }

        // Update form values
        form.reset({
          responsible_person: data.responsible_person || '',
          institution_name: data.institution_name || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          visit_date: formattedVisitDate,
          adult_count: String(data.adult_count) || '0',
          children_count: String(data.children_count) || '0',
          teacher_count: String(data.teacher_count) || '0',
          notes: data.notes || '',
          document_url: data.document_url || '',
          discount_percentage: String(data.discount_percentage) || '0',
          down_payment: String(data.down_payment) || '0',
          payment_date: formattedPaymentDate,
          bank_name: data.bank_name || '',
          payment_status: paymentStatusBool,
        });
        
        // Set package type
        if (data.package_type) {
          setSelectedPackage(data.package_type);
        }

        // TODO: Fetch accommodation and venue data if needed
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateCosts = () => {
    // Calculate participant costs based on selected package
    const adultCount = Number(form.getValues("adult_count")) || 0;
    const childrenCount = Number(form.getValues("children_count")) || 0;
    const teacherCount = Number(form.getValues("teacher_count")) || 0;
    
    // Find the selected package and get its price
    const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage);
    
    // Base price per person
    const adultPrice = selectedPackageData?.price_per_adult || 100000;
    const childrenPrice = selectedPackageData?.price_per_child || 80000; 
    const teacherPrice = selectedPackageData?.price_per_teacher || 50000;  
    
    // Calculate accommodations cost
    const accommodationCost = Object.entries(accommodationCounts).reduce((sum, [id, count]) => {
      const accommodation = accommodations.find(a => a.id === id);
      return sum + (accommodation ? accommodation.price * count : 0);
    }, 0);
    
    // Calculate venue cost
    const venueCost = selectedVenues.reduce((sum, venueId) => {
      const venue = venues.find(v => v.id === venueId);
      return sum + (venue ? venue.price : 0);
    }, 0);
    
    // Calculate participants cost
    const participantsCost = (adultCount * adultPrice) + (childrenCount * childrenPrice) + (teacherCount * teacherPrice);
    
    // Calculate total cost
    const total = participantsCost + accommodationCost + venueCost;
    setTotalCost(total);
    
    // Apply discount
    const discountPercentage = Number(form.getValues("discount_percentage")) || 0;
    const discountAmount = (discountPercentage / 100) * total;
    const withDiscount = total - discountAmount;
    setDiscountedCost(withDiscount);
    
    // Calculate remaining balance
    const downPayment = Number(form.getValues("down_payment")) || 0;
    setRemainingBalance(withDiscount - downPayment);
  };

  const handleClassChange = (classes: ClassType[]) => {
    setSelectedClasses(classes);
  };

  const handlePackageChange = (packageId: string) => {
    setSelectedPackage(packageId === selectedPackage ? '' : packageId);
  };

  const handleAccommodationChange = (id: string, count: number) => {
    setAccommodationCounts(prev => ({
      ...prev,
      [id]: count
    }));
  };

  const handleVenueChange = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedVenues(prev => [...prev, id]);
    } else {
      setSelectedVenues(prev => prev.filter(venueId => venueId !== id));
    }
  };

  const handleSubmit = async (formValues: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Calculate total guests
      const totalGuests = Number(formValues.adult_count) + Number(formValues.children_count) + Number(formValues.teacher_count);
      
      // Map the boolean payment_status to the expected enum values
      const dbPaymentStatus: PaymentStatus = formValues.payment_status ? 'lunas' : 'belum_lunas';
      
      // Map visit type based on class selection
      let dbVisitType: VisitType = 'lainnya';
      if (selectedClasses.some(c => ['kb_tk', 'sd_1_2', 'sd_3_4', 'sd_5_6', 'smp', 'sma'].includes(c))) {
        dbVisitType = 'wisata_edukasi';
      }
      
      // Format visit_date and payment_date to ISO string format for database
      const visitDateForDB = formValues.visit_date ? formValues.visit_date.toISOString().split('T')[0] : null;
      const paymentDateForDB = formValues.payment_date ? formValues.payment_date.toISOString().split('T')[0] : null;
      
      // Prepare data for submission
      const submissionData = {
        responsible_person: formValues.responsible_person,
        institution_name: formValues.institution_name,
        phone_number: formValues.phone_number,
        address: formValues.address,
        visit_date: visitDateForDB,
        adult_count: Number(formValues.adult_count),
        children_count: Number(formValues.children_count),
        teacher_count: Number(formValues.teacher_count),
        visit_type: dbVisitType,
        package_type: selectedPackage || null,
        notes: formValues.notes || '',
        document_url: formValues.document_url || '',
        total_cost: totalCost,
        discount_percentage: Number(formValues.discount_percentage || 0),
        discounted_cost: discountedCost,
        down_payment: Number(formValues.down_payment || 0),
        payment_date: paymentDateForDB,
        bank_name: formValues.bank_name || '',
        payment_status: dbPaymentStatus
      };

      let registrationId;
      
      if (editId) {
        // Update existing record
        const { data: updatedData, error } = await supabase
          .from('guest_registrations')
          .update(submissionData)
          .eq('id', editId)
          .select();
        
        if (error) throw new Error(error.message);
        registrationId = editId;
      } else {
        // For new records, we need to omit the order_id as it's generated by a DB trigger
        const { data: insertedData, error } = await supabase
          .from('guest_registrations')
          .insert(submissionData)
          .select();
        
        if (error) throw new Error(error.message);
        if (insertedData && insertedData.length > 0) {
          registrationId = insertedData[0].id;
        }
      }
      
      // If we have a registration ID, save the selected classes
      if (registrationId && selectedClasses.length > 0) {
        // First delete any existing classes for this registration
        if (editId) {
          await supabase
            .from('guest_classes')
            .delete()
            .eq('registration_id', editId);
        }
        
        // Then insert the new classes - make sure to type them correctly
        for (const classType of selectedClasses) {
          const { error: classError } = await supabase
            .from('guest_classes')
            .insert({
              registration_id: registrationId,
              class_type: classType
            });
          
          if (classError) throw new Error(classError.message);
        }
      }
      
      // TODO: Save accommodation and venue selections similarly
      
      toast({
        title: "Success!",
        description: editId ? "Guest registration updated successfully." : "Guest registration created successfully.",
      });
      
      navigate('/guest-registration');
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare summary data for the order summary component
  const getSummaryData = () => {
    const values = form.getValues();
    
    const basicInfo = [
      { label: 'PIC', value: values.responsible_person || '-' },
      { label: 'Institusi', value: values.institution_name || '-' },
      { label: 'Tanggal Kunjungan', value: values.visit_date ? format(values.visit_date, 'dd MMM yyyy') : '-' },
      { label: 'Jumlah Peserta', value: `${Number(values.adult_count) + Number(values.children_count) + Number(values.teacher_count)}` }
    ];
    
    const paymentInfo = [];
    if (values.bank_name) {
      paymentInfo.push({ label: 'Bank', value: values.bank_name });
    }
    if (values.payment_date) {
      paymentInfo.push({ label: 'Tanggal Pembayaran', value: format(values.payment_date, 'dd MMM yyyy') });
    }
    
    return {
      basicInfo,
      paymentInfo,
      costCalculation: {
        baseTotal: totalCost,
        discountedTotal: discountedCost,
        remaining: remainingBalance
      }
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/guest-registration')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{editId ? 'Edit' : 'New'} Guest Event Order</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="responsible_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama PIC</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon/HP</FormLabel>
                      <FormControl>
                        <Input placeholder="08xxxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institution_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sekolah/Instansi</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Instansi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Input placeholder="Alamat Lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="visit_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Kunjungan</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={(date) => field.onChange(date)}
                          defaultMonth={field.value}
                          placeholder="Pilih tanggal kunjungan"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <p className="text-base font-medium mb-3">Jumlah Peserta</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="children_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anak</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adult_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dewasa</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teacher_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guru</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Class Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Pilihan Kelas yang Berkunjung</CardTitle>
            </CardHeader>
            <CardContent>
              <ClassSelectionGroup
                title=""
                options={classOptions}
                selectedClasses={selectedClasses as string[]}
                onClassChange={(classes) => handleClassChange(classes as ClassType[])}
              />
            </CardContent>
          </Card>
          
          {/* Package Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Pilihan Paket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map(pkg => (
                  <PackageSelectionCard
                    key={pkg.id}
                    id={pkg.id}
                    title={pkg.name}
                    description={pkg.description}
                    price={pkg.price_per_adult}
                    checked={selectedPackage === pkg.id}
                    onCheckedChange={() => handlePackageChange(pkg.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Accommodation Section */}
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Malam Menginap</CardTitle>
              <CardDescription className="text-muted-foreground">
                Harga yang ditampilkan adalah per malam × 1 malam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accommodations.map(accommodation => (
                  <AccommodationCard
                    key={accommodation.id}
                    name={accommodation.name}
                    price={accommodation.price}
                    details={accommodation.details}
                    capacity={accommodation.capacity}
                    features={accommodation.features}
                    count={accommodationCounts[accommodation.id] || 0}
                    onCountChange={(count) => handleAccommodationChange(accommodation.id, count)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Venue Section */}
          <Card>
            <CardHeader>
              <CardTitle>Pilihan Venue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map(venue => (
                  <VenueCard
                    key={venue.id}
                    name={venue.name}
                    capacity={venue.capacity}
                    price={venue.price}
                    features={venue.features}
                    selected={selectedVenues.includes(venue.id)}
                    onSelectionChange={(selected) => handleVenueChange(venue.id, selected)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Perhitungan Biaya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span>Total Biaya</span>
                  <span className="font-medium">Rp {totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Setelah Diskon</span>
                  <span className="font-medium">Rp {discountedCost.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Sisa Yang Harus Dibayar</span>
                  <span className="font-bold">Rp {remainingBalance.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diskon Paket (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min="0" max="100" />
                      </FormControl>
                      <FormMessage />
                      <div className="text-right text-sm">
                        <span className="text-muted-foreground">Potongan Diskon: </span>
                        <span className="font-medium text-red-500">
                          Rp {((Number(field.value) / 100) * totalCost).toLocaleString()}
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Informasi Pembayaran</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="down_payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Down Payment (DP)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Transfer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Bank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bca">Bank Central Asia (BCA)</SelectItem>
                            <SelectItem value="bni">Bank Negara Indonesia (BNI)</SelectItem>
                            <SelectItem value="bri">Bank Rakyat Indonesia (BRI)</SelectItem>
                            <SelectItem value="mandiri">Bank Mandiri</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payment_date"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Tanggal Pembayaran DP</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            onSelect={(date) => field.onChange(date)}
                            placeholder="Pilih tanggal pembayaran"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Tambahkan catatan khusus untuk pemesanan ini" 
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <OrderSummary
                basicInfo={getSummaryData().basicInfo}
                paymentInfo={getSummaryData().paymentInfo}
                costCalculation={getSummaryData().costCalculation}
              />
            </div>
          </div>
          
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GuestRegistrationForm;
