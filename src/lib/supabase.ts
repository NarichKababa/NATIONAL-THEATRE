import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'user' | 'admin';
          avatar?: string;
          phone?: string;
          location?: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          last_login?: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role?: 'user' | 'admin';
          avatar?: string;
          phone?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          last_login?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'user' | 'admin';
          avatar?: string;
          phone?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          last_login?: string;
        };
      };
      shows: {
        Row: {
          id: string;
          title: string;
          date: string;
          time: string;
          venue: string;
          duration: string;
          genre: string;
          description: string;
          image: string;
          price_vip: number;
          price_premium: number;
          price_regular: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          time: string;
          venue: string;
          duration: string;
          genre: string;
          description: string;
          image: string;
          price_vip: number;
          price_premium: number;
          price_regular: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          time?: string;
          venue?: string;
          duration?: string;
          genre?: string;
          description?: string;
          image?: string;
          price_vip?: number;
          price_premium?: number;
          price_regular?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          show_id: string;
          seats: string[];
          total_amount: number;
          booking_date: string;
          status: 'confirmed' | 'pending' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          show_id: string;
          seats: string[];
          total_amount: number;
          booking_date?: string;
          status?: 'confirmed' | 'pending' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          show_id?: string;
          seats?: string[];
          total_amount?: number;
          booking_date?: string;
          status?: 'confirmed' | 'pending' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          show_id: string;
          rating: number;
          comment: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          show_id: string;
          rating: number;
          comment: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          show_id?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          activity_description: string;
          metadata?: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          activity_description: string;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          activity_description?: string;
          metadata?: any;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_ids: string[];
          subject: string;
          content: string;
          message_type: 'news' | 'announcement' | 'personal';
          sent_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_ids: string[];
          subject: string;
          content: string;
          message_type?: 'news' | 'announcement' | 'personal';
          sent_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_ids?: string[];
          subject?: string;
          content?: string;
          message_type?: 'news' | 'announcement' | 'personal';
          sent_at?: string;
          created_at?: string;
        };
      };
    };
  };
};