
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

// Create a Supabase client instance if configured
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
    return { success: false, error: 'Invalid email format' };
  }
  
  // If Supabase is not configured, return a mock success for development
  if (!supabase) {
    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, mock: true };
  }
  
  try {
    // Format the data for insertion
    const emailData = { 
      email, 
      created_at: new Date().toISOString(),
      metadata 
    };
    
    // First check if the email already exists to handle duplicates cleanly
    const { data: existingData, error: checkError } = await supabase
      .from('deadpunch_email_capture')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    if (checkError) {
      throw new Error(`Error checking for existing email: ${checkError.message}`);
    }
    
    // If email already exists, return success with duplicate flag
    if (existingData && existingData.length > 0) {
      return { success: true, duplicate: true };
    }
    
    // Insert the new email
    const { error: insertError } = await supabase
      .from('deadpunch_email_capture')
      .insert([emailData]);
    
    if (insertError) {
      throw new Error(`Error inserting email: ${insertError.message}`);
    }
    
    // Successful insert with no errors
    return { success: true };
    
  } catch (error) {
    // Ensure we return a clean error object with consistent structure
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
