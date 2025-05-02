
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from '@/utils/formatters';

interface CostSummaryProps {
  totalCost: number;
  discountedCost: number;
  remainingBalance: number;
}

const CostSummary: React.FC<CostSummaryProps> = ({ 
  totalCost, 
  discountedCost, 
  remainingBalance 
}) => {
  // Ensure all values are valid numbers
  const safeTotalCost = isNaN(totalCost) ? 0 : totalCost;
  const safeDiscountedCost = isNaN(discountedCost) ? 0 : discountedCost;
  const safeRemainingBalance = isNaN(remainingBalance) ? 0 : remainingBalance;
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        <span>Total Biaya</span>
        <span className="font-medium">{formatCurrency(safeTotalCost)}</span>
      </div>
      <div className="flex justify-between">
        <span>Total Setelah Diskon</span>
        <span className="font-medium">{formatCurrency(safeDiscountedCost)}</span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <span className="font-semibold">Sisa Yang Harus Dibayar</span>
        <span className="font-bold">{formatCurrency(safeRemainingBalance)}</span>
      </div>
    </div>
  );
};

export default CostSummary;
