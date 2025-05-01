
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from 'react-hook-form';
import { CostCalculationSummary } from "@/hooks/registration/useCostCalculation";
import CostSummary from './cost/CostSummary';
import CostBreakdownTable from './cost/CostBreakdownTable';
import DiscountForm from './cost/DiscountForm';
import PaymentInformationForm from './cost/PaymentInformationForm';

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
  const discountPercentage = Number(form.getValues("discount_percentage")) || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perhitungan Biaya</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost summary section */}
        <CostSummary 
          totalCost={totalCost}
          discountedCost={discountedCost}
          remainingBalance={remainingBalance}
        />
        
        {/* Detailed cost calculation table */}
        <CostBreakdownTable 
          calculationSummary={calculationSummary} 
          discountPercentage={discountPercentage}
          discountedCost={discountedCost}
        />
        
        {/* Discount form */}
        <DiscountForm 
          form={form} 
          childrenDiscountAmount={calculationSummary.childrenDiscountAmount}
        />
        
        {/* Payment information */}
        <PaymentInformationForm form={form} />
      </CardContent>
    </Card>
  );
};

export default CostCalculationForm;
