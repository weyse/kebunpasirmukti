
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className={cn("flex-1 p-6", sidebarOpen ? "md:ml-64" : "")}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
