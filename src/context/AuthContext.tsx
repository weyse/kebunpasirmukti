
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
      
      let errorMessage = "Username atau password salah";
      if (authError.message.includes("Email not confirmed")) {
        errorMessage = "Email belum dikonfirmasi, silakan periksa kotak masuk email Anda";
      }
      
      toast({
        title: "Login gagal",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Signup function with improved error handling
  const signup = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Attempting to register with:", email);
      
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
        console.error("Signup error:", error);
        throw error;
      }

      toast({
        title: "Pendaftaran berhasil",
        description: "Silahkan cek email Anda untuk konfirmasi.",
      });

      navigate("/login");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Signup error details:", authError);
      
      let errorMessage = 'Terjadi kesalahan saat pendaftaran';
      
      // Handle specific error messages from Supabase
      if (authError.message) {
        if (authError.message.includes('already exists')) {
          errorMessage = 'Email tersebut sudah digunakan';
        } else if (authError.message.includes('format') || authError.message.includes('invalid')) {
          errorMessage = 'Format email tidak valid';
        }
      }
      
      toast({
        title: "Pendaftaran gagal",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function - improved error handling
  const logout = async () => {
    try {
      // First navigate away to prevent any deadlocks
      navigate("/login", { replace: true });
      
      // Then sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Logout gagal",
          description: "Terjadi kesalahan saat logout, tetapi sesi lokal telah dihapus",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout berhasil",
          description: "Sampai jumpa kembali!",
        });
      }
    } catch (error) {
      console.error("Logout exception:", error);
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
