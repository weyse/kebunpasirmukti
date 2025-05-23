
import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackageSelectionCard from '@/components/registration/PackageSelectionCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PackageParticipants } from '@/hooks/registration/useSelectionState';

interface Package {
  id: string;
  name: string;
  description?: string;
  price_per_adult: number;
  price_per_child: number;
  price_per_teacher: number;
}

interface PackageSelectionFormProps {
  packages: Package[];
  selectedPackages: string[];
  packageParticipants: PackageParticipants;
  onPackageChange: (packageId: string) => void;
  onParticipantChange: (packageId: string, type: 'adults' | 'children' | 'teachers' | 'free_teachers', count: number) => void;
  totalAdults: number;
  totalChildren: number;
  totalTeachers: number;
  totalFreeTeachers: number;
}

const PackageSelectionForm: React.FC<PackageSelectionFormProps> = ({ 
  packages,
  selectedPackages,
  packageParticipants,
  onPackageChange,
  onParticipantChange,
  totalAdults,
  totalChildren,
  totalTeachers,
  totalFreeTeachers
}) => {
  // Debug: Log when component renders with new props
  useEffect(() => {
    console.log('PackageSelectionForm rendered with:', { 
      selectedPackages, 
      packageParticipants
    });
  }, [selectedPackages, packageParticipants]);

  // Calculate allocated participants
  const allocatedCounts = useMemo(() => {
    const result = {
      adults: 0,
      children: 0,
      teachers: 0,
      free_teachers: 0
    };
    
    // Ensure packageParticipants is an object before using Object.values
    if (packageParticipants && typeof packageParticipants === 'object') {
      Object.entries(packageParticipants).forEach(([packageId, counts]) => {
        if (selectedPackages.includes(packageId)) {
          result.adults += counts.adults || 0;
          result.children += counts.children || 0;
          result.teachers += counts.teachers || 0;
          result.free_teachers += counts.free_teachers || 0;
        }
      });
    }
    
    return result;
  }, [packageParticipants, selectedPackages]);
  
  const remainingParticipants = {
    adults: totalAdults - allocatedCounts.adults,
    children: totalChildren - allocatedCounts.children,
    teachers: totalTeachers - allocatedCounts.teachers,
    free_teachers: totalFreeTeachers - allocatedCounts.free_teachers
  };
  
  const handleParticipantChange = (packageId: string, type: 'adults' | 'children' | 'teachers' | 'free_teachers', count: number) => {
    const currentCount = packageParticipants[packageId]?.[type] || 0;
    const difference = count - currentCount;
    
    // Check if we have enough remaining participants
    const remaining = type === 'adults' 
      ? remainingParticipants.adults 
      : type === 'children' 
        ? remainingParticipants.children 
        : type === 'teachers'
          ? remainingParticipants.teachers
          : remainingParticipants.free_teachers;
        
    if (difference > 0 && difference > remaining) {
      // Can't allocate more than available
      return;
    }
    
    onParticipantChange(packageId, type, count);
  };

  // Determine if any participants are unallocated
  const hasUnallocatedParticipants = 
    remainingParticipants.adults > 0 || 
    remainingParticipants.children > 0 || 
    remainingParticipants.teachers > 0 || 
    remainingParticipants.free_teachers > 0;
  
  // Only show alert if packages are selected but participants remain unallocated
  const showUnallocatedAlert = selectedPackages.length > 0 && hasUnallocatedParticipants;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilihan Paket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display remaining participants */}
        <div className="mb-4 p-4 bg-muted rounded-md">
          <h3 className="text-sm font-medium mb-2">Sisa Peserta Belum Teralokasi:</h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="font-semibold">{remainingParticipants.adults}</div>
              <div className="text-xs text-muted-foreground">Dewasa</div>
            </div>
            <div>
              <div className="font-semibold">{remainingParticipants.children}</div>
              <div className="text-xs text-muted-foreground">Anak-anak</div>
            </div>
            <div>
              <div className="font-semibold">{remainingParticipants.teachers}</div>
              <div className="text-xs text-muted-foreground">Guru</div>
            </div>
            <div>
              <div className="font-semibold">{remainingParticipants.free_teachers}</div>
              <div className="text-xs text-muted-foreground">Guru (Free)</div>
            </div>
          </div>
        </div>

        {/* Alert for unallocated participants */}
        {showUnallocatedAlert && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-sm">
              Masih terdapat peserta yang belum dialokasikan. Pastikan semua peserta telah dialokasikan ke paket.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map(pkg => {
            const isSelected = selectedPackages.includes(pkg.id);
            // Ensure we have participant data for this package
            const participants = packageParticipants[pkg.id] || { adults: 0, children: 0, teachers: 0, free_teachers: 0 };
            
            return (
              <PackageSelectionCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.name}
                description={pkg.description}
                price={pkg.price_per_adult}
                checked={isSelected}
                onCheckedChange={() => onPackageChange(pkg.id)}
                adults={participants.adults}
                children={participants.children}
                teachers={participants.teachers}
                free_teachers={participants.free_teachers}
                onParticipantChange={(type, count) => handleParticipantChange(pkg.id, type, count)}
                maxAdults={isSelected ? participants.adults + remainingParticipants.adults : totalAdults}
                maxChildren={isSelected ? participants.children + remainingParticipants.children : totalChildren}
                maxTeachers={isSelected ? participants.teachers + remainingParticipants.teachers : totalTeachers}
                maxFreeTeachers={isSelected ? participants.free_teachers + remainingParticipants.free_teachers : totalFreeTeachers}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageSelectionForm;
