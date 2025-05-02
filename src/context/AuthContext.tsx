
import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, AuthError } from '@supabase/supabase-js';
import { useRoleAuth, UserRole } from '@/hooks/auth/useRoleAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, isAdmin, isLoading } = useRoleAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user;

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!",
      });

      // Use from if available, otherwise go to home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      const authError = error as AuthError;
      console.error("Login error:", authError);
      toast({
        title: "Login gagal",
        description: authError.message || "Username atau password salah",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Pendaftaran berhasil",
        description: "Silahkan cek email Anda untuk konfirmasi.",
      });

      navigate("/login");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Signup error:", authError);
      toast({
        title: "Pendaftaran gagal",
        description: authError.message || "Terjadi kesalahan saat pendaftaran",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout gagal",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
    }
  };

  // Provide the auth context
  const value = {
    user,
    role,
    isAdmin,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
