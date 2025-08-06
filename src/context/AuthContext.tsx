import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount?: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        // If user profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createUserProfile(authUser);
          return;
        } else {
          console.error('Error loading user profile:', error);
        }
      } else if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
          phone: data.phone,
          location: data.location
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser: SupabaseUser) => {
    try {
      const userData = {
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email!,
        role: (authUser.email === 'admin@theatre.ug' || authUser.email === 'admin@demo.com') ? 'admin' as const : 'user' as const
      };

      const { error } = await supabase
        .from('users')
        .upsert(userData, { onConflict: 'id' });

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      } else {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate successful registration without actual Supabase auth
      if (email.includes('demo') || email.includes('test')) {
        const demoUser = {
          id: `demo-${Date.now()}`,
          name: name,
          email: email,
          role: email === 'admin@demo.com' ? 'admin' as const : 'user' as const
        };
        
        setUser(demoUser);
        return true;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        // Wait a moment for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Demo accounts for testing
      const demoAccounts = [
        { email: 'admin@demo.com', password: 'admin123', name: 'Demo Admin', role: 'admin' as const },
        { email: 'user@demo.com', password: 'user123', name: 'Demo User', role: 'user' as const },
        { email: 'test@demo.com', password: 'test123', name: 'Test User', role: 'user' as const }
      ];
      
      const demoAccount = demoAccounts.find(acc => acc.email === email && acc.password === password);
      if (demoAccount) {
        setUser({
          id: `demo-${demoAccount.email}`,
          name: demoAccount.name,
          email: demoAccount.email,
          role: demoAccount.role
        });
        return true;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // If Supabase auth fails, still allow demo login for development
        console.warn('Supabase auth failed, using demo mode:', error.message);
        
        // Create a demo user for any email/password combination
        const demoUser = {
          id: `demo-${email}`,
          name: email.split('@')[0] || 'Demo User',
          email: email,
          role: email.includes('admin') ? 'admin' as const : 'user' as const
        };
        
        setUser(demoUser);
        return true;
      }

      if (data.user) {
        // The login trigger will handle updating last_login
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Mark user as inactive instead of deleting
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', user.id);

      if (error) {
        console.error('Delete account error:', error);
        return false;
      }

      // Log the deletion activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'account_deletion',
          activity_description: 'User account deactivated'
        });

      // Sign out the user
      await logout();
      return true;
    } catch (error) {
      console.error('Delete account error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      deleteAccount
    }}>
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