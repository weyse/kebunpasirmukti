
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  CalendarCheck,
  Home,
  ListOrdered,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { 
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar';

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Daftar Kunjungan', path: '/visit-list', icon: ListOrdered },
    { name: 'Registrasi Baru', path: '/guest-registration/new', icon: UserPlus },
    { name: 'Kalender Kunjungan', path: '/calendar', icon: CalendarCheck },
  ];

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center justify-start p-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/f94a1b65-60bc-4c63-aed5-6543cbeca768.png" 
              alt="PasirMukti Logo" 
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/login">
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
