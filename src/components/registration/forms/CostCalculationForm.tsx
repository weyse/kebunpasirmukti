
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CostCalculationSummary } from "@/hooks/registration/useCostCalculation";

interface CostCalculationFormProps {
  form: UseFormReturn<any>;
  totalCost: number;
  discountedCost: number;
  remainingBalance: number;
  calculationSummary: CostCalculationSummary;
}

const CostCalculationForm: React.FC<CostCalculationFormProps> = ({ 
  form, 
  totalCost, 
  discountedCost, 
  remainingBalance,
  calculationSummary
}) => {
  return (
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
        
        {/* Detailed cost calculation table */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Ringkasan Perhitungan</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Komponen</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Dewasa</TableCell>
                <TableCell className="text-right">Rp {calculationSummary.adultCost.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  Anak-anak
                  {calculationSummary.childrenDiscountAmount > 0 && (
                    <span className="block text-xs text-green-600">
                      Diskon {form.getValues("discount_percentage")}% (- Rp {calculationSummary.childrenDiscountAmount.toLocaleString()})
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className={calculationSummary.childrenDiscountAmount > 0 ? "line-through text-muted-foreground" : ""}>
                    Rp {calculationSummary.childrenCost.toLocaleString()}
                  </span>
                  {calculationSummary.childrenDiscountAmount > 0 && (
                    <span className="block font-medium text-green-600">
                      Rp {(calculationSummary.childrenCost - calculationSummary.childrenDiscountAmount).toLocaleString()}
                    </span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Guru</TableCell>
                <TableCell className="text-right">Rp {calculationSummary.teacherCost.toLocaleString()}</TableCell>
              </TableRow>
              {calculationSummary.accommodationCost > 0 && (
                <TableRow>
                  <TableCell>Akomodasi</TableCell>
                  <TableCell className="text-right">Rp {calculationSummary.accommodationCost.toLocaleString()}</TableCell>
                </TableRow>
              )}
              {calculationSummary.extraBedCost > 0 && (
                <TableRow>
                  <TableCell>Extra Bed</TableCell>
                  <TableCell className="text-right">Rp {calculationSummary.extraBedCost.toLocaleString()}</TableCell>
                </TableRow>
              )}
              {calculationSummary.venueCost > 0 && (
                <TableRow>
                  <TableCell>Venue</TableCell>
                  <TableCell className="text-right">Rp {calculationSummary.venueCost.toLocaleString()}</TableCell>
                </TableRow>
              )}
              <TableRow className="border-t-2">
                <TableCell className="font-medium">TOTAL</TableCell>
                <TableCell className="text-right font-bold">Rp {discountedCost.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
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
                    Rp {calculationSummary.childrenDiscountAmount.toLocaleString()}
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
  );
};

export default CostCalculationForm;
