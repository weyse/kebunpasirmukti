
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
  );
};

export default PaymentInformationForm;
