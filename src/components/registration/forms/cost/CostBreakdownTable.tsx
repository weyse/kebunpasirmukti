
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CostCalculationSummary } from "@/hooks/registration/useCostCalculation";

interface CostBreakdownTableProps {
  calculationSummary: CostCalculationSummary;
  discountPercentage: number;
  discountedCost: number;
}

const CostBreakdownTable: React.FC<CostBreakdownTableProps> = ({ 
  calculationSummary, 
  discountPercentage, 
  discountedCost 
}) => {
  return (
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
                  Diskon {discountPercentage}% (- Rp {calculationSummary.childrenDiscountAmount.toLocaleString()})
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
  );
};

export default CostBreakdownTable;
