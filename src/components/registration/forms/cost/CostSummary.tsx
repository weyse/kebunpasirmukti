
import React from 'react';
import { Separator } from "@/components/ui/separator";

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
  return (
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
  );
};

export default CostSummary;
