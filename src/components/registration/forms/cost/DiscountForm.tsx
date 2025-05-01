
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from 'react-hook-form';

interface DiscountFormProps {
  form: UseFormReturn<any>;
  childrenDiscountAmount: number;
}

const DiscountForm: React.FC<DiscountFormProps> = ({ form, childrenDiscountAmount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormField
        control={form.control}
        name="discount_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diskon untuk Anak-anak (%)</FormLabel>
            <FormControl>
              <Input type="number" {...field} min="0" max="100" />
            </FormControl>
            <FormMessage />
            <div className="text-right text-sm">
              <span className="text-muted-foreground">Potongan Diskon: </span>
              <span className="font-medium text-red-500">
                Rp {childrenDiscountAmount.toLocaleString()}
              </span>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default DiscountForm;
