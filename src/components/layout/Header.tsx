import React from 'react';
import { Moon, Sun, BellRing, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = () => {
    logout();
  };
  
  // Get initials from user's full name or email
  const getInitials = () => {
    if (!user) return 'G';
    
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      return fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    // Fallback to first letter of email
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/f94a1b65-60bc-4c63-aed5-6543cbeca768.png" 
          alt="PasirMukti Logo" 
          className="h-10"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon">
          <BellRing className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-pasirmukti-500 p-1">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>{user?.user_metadata?.full_name || user?.email}</span>
              {isAdmin && (
                <Badge className="ml-2 bg-pasirmukti-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem onClick={() => navigate('/admin/users')}>User Management</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
