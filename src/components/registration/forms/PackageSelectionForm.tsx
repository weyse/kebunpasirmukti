
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackageSelectionCard from '@/components/registration/PackageSelectionCard';

interface Package {
  id: string;
  name: string;
  description?: string;
  price_per_adult: number;
}

interface PackageSelectionFormProps {
  packages: Package[];
  selectedPackage: string;
  onPackageChange: (packageId: string) => void;
}

const PackageSelectionForm: React.FC<PackageSelectionFormProps> = ({ 
  packages,
  selectedPackage,
  onPackageChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilihan Paket</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map(pkg => (
            <PackageSelectionCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.name}
              description={pkg.description}
              price={pkg.price_per_adult}
              checked={selectedPackage === pkg.id}
              onCheckedChange={() => onPackageChange(pkg.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageSelectionForm;
