import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useActivityLogger } from '../hooks/useActivityLogger';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount?: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize activity logger after user is set
  const logActivity = async (userId: string, activityType: string, description: string, metadata?: any) => {
    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_description: description,
          metadata: metadata || {}
        });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              avatar: profile.avatar
            });
            
            // Update last login
            await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', profile.id);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar: profile.avatar
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const userData = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar: profile.avatar
          };
          
          setUser(userData);
          
          // Log login activity
          await logActivity(profile.id, 'login', 'User logged in');
          
          // Update last login
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', profile.id);
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name,
            email,
            role: 'user',
            is_active: true
          });

        if (profileError) throw profileError;

        const userData = {
          id: data.user.id,
          name,
          email,
          role: 'user' as const
        };
        
        setUser(userData);
        
        // Log registration activity
        await logActivity(data.user.id, 'registration', 'User account created');
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    if (user) {
      // Log logout activity
      await logActivity(user.id, 'logout', 'User logged out');
    }
    
    await supabase.auth.signOut();
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user) return false;
    
    try {
      // Log account deletion
      await logActivity(user.id, 'account_deletion', 'User deleted their account');
      
      // Mark user as inactive instead of deleting
      await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', user.id);
      
      await supabase.auth.signOut();
      setUser(null);
      return true;
    } catch (error) {
      console.error('Account deletion failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}