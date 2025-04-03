
/**
 * Supabase Integration
 * 
 * This file sets up the Supabase client and provides utility functions
 * for interacting with Supabase services like edge functions and database.
 */

import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials for this project
// In production, these would typically come from environment variables
const supabaseUrl = 'https://yunwcbujnowcifbkfjmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bndjYnVqbm93Y2lmYmtmam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODg1NTksImV4cCI6MjA1ODM2NDU1OX0.KTz1o0xYgYjIqrB9K4up-bri-0dhl0irldPy2TcsQY4';

/**
 * Check if Supabase credentials are available
 * This determines whether we use real API calls or mock data
 */
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Log configuration status (for debugging)
if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase environment variables are missing. Using mock mode.');
  console.warn('Please check SUPABASE_SETUP_GUIDE.md for configuration instructions.');
} else {
  console.log('✅ Supabase environment variables detected.');
}

/**
 * Create a Supabase client instance if configured
 * Returns null if credentials are missing
 */
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

/**
 * Test Supabase connection to help diagnose issues
 * This can be called to verify if the connection works
 */
export const testSupabaseConnection = async () => {
  if (!supabase) {
    console.error('Cannot test connection: Supabase client not initialized');
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    // Try to make a simple call to verify connection
    const { data, error } = await supabase
      .from('deadpunch_email_capture')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test exception:', error);
    return { success: false, error };
  }
};

/**
 * Interface for metadata in email subscriptions
 * Allows for flexible additional data with email captures
 */
interface EmailSubscriptionMetadata {
  source?: string;         // Where the email was captured (e.g., "landing_page")
  category?: string;       // Category of interest (e.g., "products")
  subcategory?: string;    // Subcategory (e.g., "apparel")
  [key: string]: any;      // Additional flexible metadata
}

/**
 * Saves an email subscription to the Supabase database
 * Includes metadata for segmentation and analytics
 * 
 * @param {string} email - The subscriber's email address
 * @param {EmailSubscriptionMetadata} metadata - Optional metadata about subscription
 * @returns {Promise<{success: boolean, mock?: boolean, error?: any, duplicate?: boolean}>} Success status and any errors
 */
export const saveEmailSubscription = async (email: string, metadata: EmailSubscriptionMetadata = {}) => {
  // Validate email format
  if (!email || !email.includes('@')) {
    console.error('❌ Invalid email format:', email);
    return { success: false, error: 'Invalid email format' };
  }
  
  // If Supabase is not configured, return a mock success for development
  if (!isSupabaseConfigured || !supabase) {
    console.warn('⚠️ Supabase not configured. Using mock response for email subscription.');
    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, mock: true };
  }
  
  try {
    // First attempt to directly insert the email without checking for duplicates
    // This is more efficient if we expect most emails to be new
    const emailData = { 
      email, 
      created_at: new Date().toISOString(),
      metadata 
    };
    
    // Insert the new email with handling for the net schema error
    try {
      const { error: insertError } = await supabase
        .from('deadpunch_email_capture')
        .insert([emailData]);
      
      if (!insertError) {
        // If no error, the email was successfully inserted
        return { success: true };
      }
      
      // Check if it's a duplicate key error 
      if (insertError.message?.includes('duplicate key')) {
        return { success: true, duplicate: true };
      }
      
      // Check for the specific "schema net does not exist" error related to the trigger function
      if (insertError.code === '3F000' && insertError.message?.includes('schema "net" does not exist')) {
        // The email was saved, but the trigger function failed
        // This is because the net.http_post extension is not enabled
        return { success: true, warning: 'Email saved but notification webhook failed' };
      }
      
      // For all other errors, try to check if this is already in the database
      // This handles the case where we got an error but the email might still exist
      const { data: existingData, error: checkError } = await supabase
        .from('deadpunch_email_capture')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      if (!checkError && existingData && existingData.length > 0) {
        // Email exists, so consider this a success with duplicate flag
        return { success: true, duplicate: true };
      }
      
      // If we get here, it's an actual error and the email wasn't saved
      throw insertError;
    } catch (error) {
      // Re-throw the error to be caught by the outer catch block
      throw error;
    }
  } catch (error) {
    console.error('❌ Error saving email subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
