
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryItem {
  label: string;
  value: string;
}

interface OrderSummaryProps {
  basicInfo: SummaryItem[];
  paymentInfo: SummaryItem[];
  costCalculation: {
    baseTotal: number;
    discountedTotal: number;
    remaining: number;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  basicInfo,
  paymentInfo,
  costCalculation
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">1. Informasi Dasar</h3>
          <div className="space-y-1">
            {basicInfo.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-muted-foreground">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {paymentInfo.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">2. Informasi Pembayaran</h3>
            <div className="space-y-1">
              {paymentInfo.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Perhitungan Biaya</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Biaya Dasar:</span>
              <span>Rp {costCalculation.baseTotal.toLocaleString()}</span>
            </div>
            {costCalculation.baseTotal !== costCalculation.discountedTotal && (
              <div className="flex justify-between text-green-600">
                <span>Diskon untuk Anak-anak:</span>
                <span>- Rp {(costCalculation.baseTotal - costCalculation.discountedTotal).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Setelah Diskon:</span>
              <span>Rp {costCalculation.discountedTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Sisa yang Harus Dibayar:</span>
              <span>Rp {costCalculation.remaining.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
