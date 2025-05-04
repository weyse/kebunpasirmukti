import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ListChecks,
  Calendar,
  Lock,
  ClipboardList
} from "lucide-react"
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  children?: React.ReactNode;
}

const navigationItems = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    href: '/dashboard',
    requiresRole: null,
  },
  {
    title: 'Pendaftaran Tamu',
    icon: <UserPlus className="mr-2 h-4 w-4" />,
    href: '/guest-registration/new',
    requiresRole: null,
  },
  {
    title: 'Daftar Kunjungan',
    icon: <ListChecks className="mr-2 h-4 w-4" />,
    href: '/visits',
    requiresRole: null,
  },
  {
    title: 'Kalender',
    icon: <Calendar className="mr-2 h-4 w-4" />,
    href: '/calendar',
    requiresRole: null,
  },
  {
    title: 'Laporan',
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
    href: '/laporan',
    requiresRole: null,
  },
  {
    title: 'Admin',
    icon: <Lock className="mr-2 h-4 w-4" />,
    href: '/admin',
    requiresRole: 'admin',
  },
];

export function Sidebar({ children }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.requiresRole) {
      return true;
    }
    return user?.role === item.requiresRole;
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2">
          Menu
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Pilih menu yang ingin Anda tuju.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {filteredNavigationItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${
                  isActive ? 'font-bold' : ''
                }`
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
          <Separator className="my-2" />
          <Accordion type="single" collapsible>
            <AccordionItem value="admin">
              <AccordionTrigger>
                <Users className="mr-2 h-4 w-4" />
                <span>Manajemen Pengguna</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2">
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `block rounded-md p-2 text-sm font-medium hover:underline ${
                        isActive ? 'font-bold' : ''
                      }`
                    }
                  >
                    Daftar Pengguna
                  </NavLink>
                  <NavLink
                    to="/admin/add-admin"
                    className={({ isActive }) =>
                      `block rounded-md p-2 text-sm font-medium hover:underline ${
                        isActive ? 'font-bold' : ''
                      }`
                    }
                  >
                    Tambah Admin
                  </NavLink>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
