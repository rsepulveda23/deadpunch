
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
  console.log('🔍 Starting email subscription process...');
  
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
    console.log('📝 Attempting to save email:', email, 'with metadata:', metadata);
    
    // Test connection to Supabase before attempting to save
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
      console.error('🔴 Connection to Supabase failed:', connectionTest.error);
      throw new Error(`Failed to connect to Supabase: ${JSON.stringify(connectionTest.error)}`);
    }
    
    console.log('✅ Supabase connection verified');
    
    // Check if this email already exists to prevent duplicates
    try {
      console.log('🔍 Checking for existing email...');
      const { data: existingData, error: checkError } = await supabase
        .from('deadpunch_email_capture')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      if (checkError) {
        console.error('❌ Error checking for existing email:', checkError);
        throw checkError;
      }
      
      // If email already exists, return success without inserting
      if (existingData && existingData.length > 0) {
        console.log('⚠️ Email already exists, not saving duplicate:', email);
        return { success: true, duplicate: true };
      }
      
      console.log('✨ Email is new, proceeding with insert');
    } catch (checkError) {
      console.error('❌ Error checking for existing email:', checkError);
      throw checkError;
    }
    
    // Prepare data for insertion with detailed logging
    const emailData = { 
      email, 
      created_at: new Date().toISOString(),
      metadata 
    };
    
    console.log('📝 Inserting email data:', JSON.stringify(emailData));
    
    // Insert the new email with detailed logging
    const { error: insertError } = await supabase
      .from('deadpunch_email_capture')
      .insert([emailData]);
    
    if (insertError) {
      console.error('❌ Supabase insert error:', insertError);
      
      // Check if it's a permissions issue
      if (insertError.message?.includes('permission denied')) {
        return { success: false, error: 'Database permission denied. Please check table permissions.' };
      }
      
      // Check if it's a duplicate key error (in case the previous check missed it)
      if (insertError.message?.includes('duplicate key')) {
        console.log('⚠️ Duplicate email detected during insert, returning as success');
        return { success: true, duplicate: true };
      }
      
      throw insertError;
    }
    
    console.log('✅ Email saved successfully to deadpunch_email_capture table');
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving email subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
