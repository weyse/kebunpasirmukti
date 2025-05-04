
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from 'react-hook-form';
import { DatePicker } from "@/components/ui/date-picker";

interface PaymentInformationFormProps {
  form: UseFormReturn<any>;
}

// List of banks in Indonesia
const bankOptions = [
  { value: 'bca', label: 'Bank Central Asia (BCA)' },
  { value: 'bni', label: 'Bank Negara Indonesia (BNI)' },
  { value: 'bri', label: 'Bank Rakyat Indonesia (BRI)' },
  { value: 'mandiri', label: 'Bank Mandiri' },
  { value: 'btn', label: 'Bank Tabungan Negara (BTN)' },
  { value: 'cimb', label: 'CIMB Niaga' },
  { value: 'danamon', label: 'Bank Danamon' },
  { value: 'permata', label: 'Bank Permata' },
  { value: 'panin', label: 'Bank Panin' },
  { value: 'ocbc', label: 'OCBC NISP' },
  { value: 'mega', label: 'Bank Mega' },
  { value: 'jago', label: 'Bank Jago' },
  { value: 'seabank', label: 'SeaBank' },
  { value: 'blu', label: 'BCA Digital (blu)' },
  { value: 'jenius', label: 'Jenius (BTPN)' },
  { value: 'line', label: 'LINE Bank (Hana)' },
  { value: 'allo', label: 'Bank Allo' },
  { value: 'neo', label: 'Neo Commerce (BNC)' },
  { value: 'bsi', label: 'Bank Syariah Indonesia (BSI)' },
  { value: 'muamalat', label: 'Bank Muamalat' },
  { value: 'mega_syariah', label: 'Bank Mega Syariah' },
  { value: 'dki', label: 'Bank DKI' },
  { value: 'bjb', label: 'Bank BJB (Jabar Banten)' },
  { value: 'jateng', label: 'Bank Jateng' },
  { value: 'jatim', label: 'Bank Jatim' },
  { value: 'sumut', label: 'Bank Sumut' },
  { value: 'sumsel', label: 'Bank Sumsel Babel' },
  { value: 'nagari', label: 'Bank Nagari (Sumbar)' },
  { value: 'kalbar', label: 'Bank Kalbar' },
];

const PaymentInformationForm: React.FC<PaymentInformationFormProps> = ({ form }) => {
  return (
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
                <SelectContent className="max-h-[300px]">
                  {bankOptions.map((bank) => (
                    <SelectItem key={bank.value} value={bank.value}>
                      {bank.label}
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
  );
};

export default PaymentInformationForm;
