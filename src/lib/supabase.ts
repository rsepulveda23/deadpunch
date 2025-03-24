
import { createClient } from '@supabase/supabase-js';

// These environment variables would be set in your Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create a dummy client or real client based on configuration
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Specialized function for email subscriptions
export const saveEmailSubscription = async (email: string) => {
  // If Supabase is not configured, return a mock success for development
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using mock response for email subscription.');
    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, mock: true };
  }
  
  try {
    const { error } = await supabase!
      .from('email_subscriptions')
      .insert([{ email, created_at: new Date().toISOString() }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving email subscription:', error);
    return { success: false, error };
  }
};
