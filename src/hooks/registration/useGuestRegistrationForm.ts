
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ClassType } from '../types/registrationTypes';

// Define form schema
export const formSchema = z.object({
  id: z.string().optional(),
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
  free_of_charge_teacher_count: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, {
    message: "Jumlah guru free of charge harus berupa angka dan tidak boleh negatif.",
  }),
  notes: z.string().optional(),
  document_url: z.string().optional(),
  discount_percentage: z.string().optional(),
  down_payment: z.string().optional(),
  payment_date: z.date().optional().nullable(),
  bank_name: z.string().optional(),
  payment_status: z.boolean().default(false),
});

export type FormSchema = z.infer<typeof formSchema>;

export const useGuestRegistrationForm = (initialData?: Partial<FormSchema>) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      responsible_person: initialData?.responsible_person || "",
      institution_name: initialData?.institution_name || "",
      phone_number: initialData?.phone_number || "",
      address: initialData?.address || "",
      visit_date: initialData?.visit_date || new Date(),
      adult_count: initialData?.adult_count || "0",
      children_count: initialData?.children_count || "0",
      teacher_count: initialData?.teacher_count || "0",
      free_of_charge_teacher_count: initialData?.free_of_charge_teacher_count || "0",
      notes: initialData?.notes || "",
      document_url: initialData?.document_url || "",
      discount_percentage: initialData?.discount_percentage || "0",
      down_payment: initialData?.down_payment || "0",
      payment_date: initialData?.payment_date || null,
      bank_name: initialData?.bank_name || "",
      payment_status: initialData?.payment_status || false,
    },
  });

  return form;
};
