
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CalendarCheck, Home, ListOrdered, LogOut, UserPlus, Settings, Shield, Users, UserCog, ShieldCheck } from 'lucide-react';
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
  const { isAdmin, logout } = useAuth();
  
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
  
  // Admin-only menu items
  const adminMenuItems = [
    {
      name: 'Daftar Kunjungan',
      path: '/visit-list',
      icon: ListOrdered
    },
    {
      name: 'Registrasi Baru',
      path: '/guest-registration/new',
      icon: UserPlus
    }
  ];
  
  // Admin management menu items
  const adminManagementItems = [
    {
      name: 'Kelola Pengguna',
      path: '/admin/users',
      icon: Users
    },
    {
      name: 'Tambah Admin',
      path: '/admin/add-admin',
      icon: Shield
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
              
              {/* Always show Setup Admin for all users */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/setup-admin') ? "bg-sidebar-accent" : ""}>
                  <Link to="/setup-admin">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Setup Admin</span>
                    {!isAdmin && <Badge variant="outline" className="ml-auto bg-amber-100 text-amber-800">Direkomendasikan</Badge>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {isAdmin && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Management</span>
                  <Badge variant="outline" className="ml-auto">Admin</Badge>
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map(item => (
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
            
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Administration</span>
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminManagementItems.map(item => (
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
          </>
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
