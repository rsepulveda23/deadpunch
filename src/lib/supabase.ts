
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials for this project
const supabaseUrl = 'https://yunwcbujnowcifbkfjmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bndjYnVqbm93Y2lmYmtmam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODg1NTksImV4cCI6MjA1ODM2NDU1OX0.KTz1o0xYgYjIqrB9K4up-bri-0dhl0irldPy2TcsQY4';

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Log configuration status (for debugging)
if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase environment variables are missing. Using mock mode.');
  console.warn('Please check SUPABASE_SETUP_GUIDE.md for configuration instructions.');
} else {
  console.log('✅ Supabase environment variables detected.');
}

// Create a dummy client or real client based on configuration
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Interface for metadata in email subscriptions
interface EmailSubscriptionMetadata {
  source?: string;
  category?: string;
  subcategory?: string;
  [key: string]: any;
}

// Specialized function for email subscriptions
export const saveEmailSubscription = async (email: string, metadata: EmailSubscriptionMetadata = {}) => {
  // If Supabase is not configured, return a mock success for development
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using mock response for email subscription.');
    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, mock: true };
  }
  
  try {
    console.log('Saving email to Supabase table: deadpunch_email_capture', { email, metadata });
    const { error, data } = await supabase!
      .from('deadpunch_email_capture')
      .insert([{ 
        email, 
        created_at: new Date().toISOString(),
        metadata: metadata
      }]);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Email saved successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Error saving email subscription:', error);
    return { success: false, error };
  }
};
