import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useActivityLogger() {
  const { user } = useAuth();

  const logActivity = useCallback(async (
    activityType: string,
    description: string,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_description: description,
          metadata: metadata || {}
        });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, [user]);

  return { logActivity };
}