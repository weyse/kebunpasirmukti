
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
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
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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
  visit_date: z.date(),
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
  visit_type: z.enum(['INSTANSI', 'UMUM'], {
    required_error: "Tipe kunjungan harus dipilih.",
  }),
  package_type: z.enum(['HEMAT', 'REGULER', 'LENGKAP'], {
    required_error: "Tipe paket harus dipilih.",
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
  const [formData, setFormData] = useState({
    responsible_person: '',
    institution_name: '',
    phone_number: '',
    address: '',
    visit_date: new Date(),
    adult_count: '0',
    children_count: '0',
    teacher_count: '0',
    visit_type: 'INSTANSI',
    package_type: 'HEMAT',
    notes: '',
    document_url: '',
    discount_percentage: '',
    down_payment: '',
    payment_date: null as Date | null,
    bank_name: '',
    payment_status: false,
  });
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

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
      visit_type: "INSTANSI",
      package_type: "HEMAT",
      notes: "",
      document_url: "",
      discount_percentage: "0",
      down_payment: "0",
      payment_date: null,
      bank_name: "",
      payment_status: false,
    },
  });

  useEffect(() => {
    if (editId) {
      fetchGuestRegistration(editId);
    }
  }, [editId]);

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

        setFormData({
          responsible_person: data.responsible_person || '',
          institution_name: data.institution_name || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          visit_date: formattedVisitDate,
          adult_count: String(data.adult_count) || '0',
          children_count: String(data.children_count) || '0',
          teacher_count: String(data.teacher_count) || '0',
          visit_type: data.visit_type === 'wisata_edukasi' ? 'INSTANSI' : 'UMUM', // Map DB value to form value
          package_type: data.package_type || 'HEMAT',
          notes: data.notes || '',
          document_url: data.document_url || '',
          discount_percentage: String(data.discount_percentage) || '0',
          down_payment: String(data.down_payment) || '0',
          payment_date: formattedPaymentDate,
          bank_name: data.bank_name || '',
          payment_status: paymentStatusBool,
        });

        // Update form default values
        form.reset({
          responsible_person: data.responsible_person || '',
          institution_name: data.institution_name || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          visit_date: formattedVisitDate,
          adult_count: String(data.adult_count) || '0',
          children_count: String(data.children_count) || '0',
          teacher_count: String(data.teacher_count) || '0',
          visit_type: data.visit_type === 'wisata_edukasi' ? 'INSTANSI' : 'UMUM', // Map DB value to form value
          package_type: data.package_type || 'HEMAT',
          notes: data.notes || '',
          document_url: data.document_url || '',
          discount_percentage: String(data.discount_percentage) || '0',
          down_payment: String(data.down_payment) || '0',
          payment_date: formattedPaymentDate,
          bank_name: data.bank_name || '',
          payment_status: paymentStatusBool,
        });
        
        setIsPaymentConfirmed(paymentStatusBool);
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const packageCosts = {
    HEMAT: 5000,
    REGULER: 7500,
    LENGKAP: 10000,
  };

  const calculatePackageCost = () => {
    const baseCost = packageCosts[formData.package_type as keyof typeof packageCosts] || 0;
    const totalGuests = Number(formData.adult_count) + Number(formData.children_count) + Number(formData.teacher_count);
    return baseCost * totalGuests;
  };

  const calculateFinalCost = () => {
    const basePackageCost = calculatePackageCost();
    const discount = Number(formData.discount_percentage) || 0;
    const discountAmount = (discount / 100) * basePackageCost;
    return basePackageCost - discountAmount;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Calculate total guests
      const totalGuests = Number(formData.adult_count) + Number(formData.children_count) + Number(formData.teacher_count);
      
      // Calculate costs
      const basePackageCost = calculatePackageCost();
      const totalCost = basePackageCost;
      const discountedCost = calculateFinalCost();
      
      // Map the boolean payment_status to the expected enum values
      const dbPaymentStatus = formData.payment_status ? 'lunas' : 'belum_lunas';
      
      // Map form visit_type to DB visit_type
      const dbVisitType = formData.visit_type === 'INSTANSI' ? 'wisata_edukasi' : 'lainnya';
      
      // Prepare data for submission
      const submissionData = {
        responsible_person: formData.responsible_person,
        institution_name: formData.institution_name,
        phone_number: formData.phone_number,
        address: formData.address,
        visit_date: formData.visit_date,
        adult_count: Number(formData.adult_count),
        children_count: Number(formData.children_count),
        teacher_count: Number(formData.teacher_count),
        visit_type: dbVisitType,
        package_type: formData.package_type,
        notes: formData.notes || '',
        document_url: formData.document_url || '',
        total_cost: totalCost,
        discount_percentage: Number(formData.discount_percentage || 0),
        discounted_cost: discountedCost,
        down_payment: Number(formData.down_payment || 0),
        payment_date: formData.payment_date || null,
        bank_name: formData.bank_name || '',
        payment_status: dbPaymentStatus
      };

      let result;
      if (editId) {
        // Update existing record
        result = await supabase
          .from('guest_registrations')
          .update(submissionData)
          .eq('id', editId)
          .select();
      } else {
        // For new records, we don't need to include order_id as it's generated by the database
        result = await supabase
          .from('guest_registrations')
          .insert(submissionData)
          .select();
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editId ? 'Edit' : 'Create'} Guest Registration</CardTitle>
        <CardDescription>Form untuk {editId ? 'mengubah' : 'membuat'} data registrasi tamu.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="responsible_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penanggung Jawab</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Lengkap" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }} />
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
                  <FormLabel>Nama Instansi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Instansi" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }} />
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
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="08xxxxxxxxxx" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }} />
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
                    <Textarea placeholder="Alamat Lengkap" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visit_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Kunjungan</FormLabel>
                  <FormControl>
                    <DatePicker
                      onSelect={(date) => {
                        field.onChange(date);
                        handleDateChange("visit_date", date);
                      }}
                      defaultMonth={formData.visit_date}
                      mode="single"
                      captionLayout="dropdown"
                    />
                  </FormControl>
                  <FormDescription>
                    Pilih tanggal kunjungan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="adult_count"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Jumlah Dewasa</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children_count"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Jumlah Anak-anak</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacher_count"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Jumlah Guru</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="visit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kunjungan</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setFormData(prev => ({ ...prev, visit_type: value }));
                  }} defaultValue={formData.visit_type}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe kunjungan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INSTANSI">Instansi</SelectItem>
                      <SelectItem value="UMUM">Umum</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Paket</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setFormData(prev => ({ ...prev, package_type: value }));
                  }} defaultValue={formData.package_type}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe paket" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HEMAT">Hemat</SelectItem>
                      <SelectItem value="REGULER">Reguler</SelectItem>
                      <SelectItem value="LENGKAP">Lengkap</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Catatan Tambahan" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Dokumen</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="URL Dokumen" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="discount_percentage"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Diskon (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="down_payment"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Uang Muka</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pembayaran</FormLabel>
                  <FormControl>
                    <DatePicker
                      onSelect={(date) => {
                        field.onChange(date);
                        handleDateChange("payment_date", date);
                      }}
                      defaultMonth={formData.payment_date}
                      mode="single"
                      captionLayout="dropdown"
                      disabled={!formData.payment_status}
                    />
                  </FormControl>
                  <FormDescription>
                    Pilih tanggal pembayaran.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Bank</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nama Bank" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }} disabled={!formData.payment_status} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Pembayaran Lunas</FormLabel>
                    <FormDescription>
                      Centang jika pembayaran sudah lunas.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={formData.payment_status}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleCheckboxChange({ target: { name: 'payment_status', checked } } as any);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GuestRegistrationForm;
