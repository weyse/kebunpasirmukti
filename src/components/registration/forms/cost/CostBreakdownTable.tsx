
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
  // Safe check to ensure we have valid data
  const hasPackages = calculationSummary?.packageBreakdown && calculationSummary.packageBreakdown.length > 0;
  
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Ringkasan Perhitungan</h3>
      
      {/* Package breakdown */}
      {hasPackages && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Detail Paket</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Dewasa</TableHead>
                <TableHead>Anak</TableHead>
                <TableHead>Guru</TableHead>
                <TableHead>Guru (Free)</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationSummary.packageBreakdown.map((pkg, index) => (
                <TableRow key={index}>
                  <TableCell>{pkg.packageName || `Paket ${index + 1}`}</TableCell>
                  <TableCell>{pkg.adults} (Rp {pkg.adultCost.toLocaleString()})</TableCell>
                  <TableCell>{pkg.children} (Rp {pkg.childrenCost.toLocaleString()})</TableCell>
                  <TableCell>{pkg.teachers} (Rp {pkg.teacherCost.toLocaleString()})</TableCell>
                  <TableCell>{pkg.free_teachers} (Rp 0)</TableCell>
                  <TableCell className="text-right font-medium">Rp {pkg.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Overall summary */}
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
            <TableCell>
              Guru
              {calculationSummary.freeTeachersCount > 0 && (
                <span className="block text-xs text-muted-foreground">
                  (+ {calculationSummary.freeTeachersCount} Guru Free of Charge)
                </span>
              )}
            </TableCell>
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
