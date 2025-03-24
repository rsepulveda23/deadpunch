
import { createClient } from '@supabase/supabase-js';

// These environment variables would be set in your Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Specialized function for email subscriptions
export const saveEmailSubscription = async (email: string) => {
  try {
    const { error } = await supabase
      .from('email_subscriptions')
      .insert([{ email, created_at: new Date().toISOString() }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving email subscription:', error);
    return { success: false, error };
  }
};
