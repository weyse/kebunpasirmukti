import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SummaryItem, RoomVenueItem } from '@/hooks/registration/summary/types';

interface OrderSummaryProps {
  basicInfo: SummaryItem[];
  paymentInfo: SummaryItem[];
  costCalculation: {
    baseTotal: number;
    discountedTotal: number;
    remaining: number;
  };
  roomsInfo?: RoomVenueItem[];
  venuesInfo?: RoomVenueItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  basicInfo,
  paymentInfo,
  costCalculation,
  roomsInfo = [],
  venuesInfo = []
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

        {/* Rooms info section */}
        {roomsInfo.length > 0 && (
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Akomodasi
            </h3>
            <div className="space-y-1">
              {roomsInfo.map((room, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{room.name}:</span>
                  <span>
                    {room.count} kamar
                    {room.price ? ` (Rp ${room.price.toLocaleString()})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Venues info section */}
        {venuesInfo.length > 0 && (
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Venue
            </h3>
            <div className="space-y-1">
              {venuesInfo.map((venue, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{venue.name}:</span>
                  <span>{venue.price ? `Rp ${venue.price.toLocaleString()}` : 'Dipilih'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
