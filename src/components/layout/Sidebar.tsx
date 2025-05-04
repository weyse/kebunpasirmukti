import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
import { CalendarCheck, Home, ListOrdered, LogOut, UserPlus, Settings, Shield, Book } from 'lucide-react';
=======
import { CalendarCheck, Home, ListOrdered, LogOut, UserPlus, Settings, Shield } from 'lucide-react';
>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export function Sidebar() {
  const location = useLocation();
  const { logout, isAdmin } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Common menu items for all users
  const commonMenuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: Home
    },
    {
      name: 'Kalender Kunjungan',
      path: '/calendar',
      icon: CalendarCheck
    }
  ];
  
  // Management menu items (only for admin users)
  const managementItems = [
    {
      name: 'Daftar Kunjungan',
      path: '/visit-list',
      icon: ListOrdered
    },
    {
      name: 'Registrasi Baru',
      path: '/guest-registration/new',
      icon: UserPlus
<<<<<<< HEAD
    },
    {
      name: 'Laporan',
      path: '/laporan',
      icon: Book
=======
>>>>>>> df37da58018e5b43eed8d5346a150adc2c758b23
    }
  ];
  
  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center justify-start p-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/f94a1b65-60bc-4c63-aed5-6543cbeca768.png" 
              alt="PasirMukti Logo" 
              className="h-8 mr-2"
            />
            <span className="font-semibold text-lg">PasirMukti</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonMenuItems.map(item => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className={isActive(item.path) ? "bg-sidebar-accent" : ""}>
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Only show management section to admin users */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Management</span>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementItems.map(item => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild className={isActive(item.path) ? "bg-sidebar-accent" : ""}>
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
