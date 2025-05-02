
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
  
  // Ensure all values are numbers
  const safeAdultCost = isNaN(calculationSummary.adultCost) ? 0 : calculationSummary.adultCost;
  const safeChildrenCost = isNaN(calculationSummary.childrenCost) ? 0 : calculationSummary.childrenCost;
  const safeChildrenDiscountAmount = isNaN(calculationSummary.childrenDiscountAmount) ? 0 : calculationSummary.childrenDiscountAmount;
  const safeTeacherCost = isNaN(calculationSummary.teacherCost) ? 0 : calculationSummary.teacherCost;
  const safeAccommodationCost = isNaN(calculationSummary.accommodationCost) ? 0 : calculationSummary.accommodationCost;
  const safeExtraBedCost = isNaN(calculationSummary.extraBedCost) ? 0 : calculationSummary.extraBedCost;
  const safeVenueCost = isNaN(calculationSummary.venueCost) ? 0 : calculationSummary.venueCost;
  const safeFreeTeachersCount = isNaN(calculationSummary.freeTeachersCount) ? 0 : calculationSummary.freeTeachersCount;
  const safeDiscountedCost = isNaN(discountedCost) ? 0 : discountedCost;
  const safeDiscountPercentage = isNaN(discountPercentage) ? 0 : discountPercentage;
  
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
              {calculationSummary.packageBreakdown.map((pkg, index) => {
                // Ensure all values are numbers
                const adultCost = isNaN(pkg.adultCost) ? 0 : pkg.adultCost;
                const childrenCost = isNaN(pkg.childrenCost) ? 0 : pkg.childrenCost;
                const teacherCost = isNaN(pkg.teacherCost) ? 0 : pkg.teacherCost;
                const total = isNaN(pkg.total) ? 0 : pkg.total;
                
                return (
                  <TableRow key={index}>
                    <TableCell>{pkg.packageName || `Paket ${index + 1}`}</TableCell>
                    <TableCell>{pkg.adults} (Rp {adultCost.toLocaleString()})</TableCell>
                    <TableCell>{pkg.children} (Rp {childrenCost.toLocaleString()})</TableCell>
                    <TableCell>{pkg.teachers} (Rp {teacherCost.toLocaleString()})</TableCell>
                    <TableCell>{pkg.free_teachers} (Rp 0)</TableCell>
                    <TableCell className="text-right font-medium">Rp {total.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
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
            <TableCell className="text-right">Rp {safeAdultCost.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Anak-anak
              {safeChildrenDiscountAmount > 0 && (
                <span className="block text-xs text-green-600">
                  Diskon {safeDiscountPercentage}% (- Rp {safeChildrenDiscountAmount.toLocaleString()})
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <span className={safeChildrenDiscountAmount > 0 ? "line-through text-muted-foreground" : ""}>
                Rp {safeChildrenCost.toLocaleString()}
              </span>
              {safeChildrenDiscountAmount > 0 && (
                <span className="block font-medium text-green-600">
                  Rp {(safeChildrenCost - safeChildrenDiscountAmount).toLocaleString()}
                </span>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Guru
              {safeFreeTeachersCount > 0 && (
                <span className="block text-xs text-muted-foreground">
                  (+ {safeFreeTeachersCount} Guru Free of Charge)
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">Rp {safeTeacherCost.toLocaleString()}</TableCell>
          </TableRow>
          {safeAccommodationCost > 0 && (
            <TableRow>
              <TableCell>Akomodasi</TableCell>
              <TableCell className="text-right">Rp {safeAccommodationCost.toLocaleString()}</TableCell>
            </TableRow>
          )}
          {safeExtraBedCost > 0 && (
            <TableRow>
              <TableCell>Extra Bed</TableCell>
              <TableCell className="text-right">Rp {safeExtraBedCost.toLocaleString()}</TableCell>
            </TableRow>
          )}
          {safeVenueCost > 0 && (
            <TableRow>
              <TableCell>Venue</TableCell>
              <TableCell className="text-right">Rp {safeVenueCost.toLocaleString()}</TableCell>
            </TableRow>
          )}
          <TableRow className="border-t-2">
            <TableCell className="font-medium">TOTAL</TableCell>
            <TableCell className="text-right font-bold">Rp {safeDiscountedCost.toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CostBreakdownTable;
