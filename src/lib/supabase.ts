
/**
 * Supabase Client Integration
 * 
 * This file sets up the Supabase client and provides utility functions
 * for interacting with the Supabase database, specifically for email
 * subscription management.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { validateEmailFormat } from '@/utils/emailUtils';

// Supabase connection credentials
// These values are public and safe to be in the client code
const supabaseUrl = 'https://yunwcbujnowcifbkfjmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bndjYnVqbm93Y2lmYmtmam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODg1NTksImV4cCI6MjA1ODM2NDU1OX0.KTz1o0xYgYjIqrB9K4up-bri-0dhl0irldPy2TcsQY4';

/**
 * Create a Supabase client instance with persistent auth session
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Email subscription interface for metadata
 */
interface EmailMetadata {
  source?: string;
  category?: string;
  subcategory?: string;
  timestamp?: string;
  [key: string]: any; // Allow additional metadata fields
}

/**
 * Response interface for email subscription operations
 */
interface EmailSubscriptionResponse {
  success: boolean;
  error?: string;
  duplicate?: boolean;
}

/**
 * Saves an email subscription to the Supabase 'deadpunch_email_capture' table
 * 
 * @param {string} email - The subscriber's email address
 * @param {EmailMetadata} metadata - Optional metadata about the subscription (source, category, etc.)
 * @returns {Promise<EmailSubscriptionResponse>} Object with success status and any errors
 */
export const saveEmailSubscription = async (
  email: string, 
  metadata: EmailMetadata = {}
): Promise<EmailSubscriptionResponse> => {
  // Input validation for email format
  if (!email) {
    return { 
      success: false, 
      error: 'Email is required' 
    };
  }
  
  try {
    // Prepare data for insertion with current timestamp
    const emailData = { 
      email, 
      created_at: new Date().toISOString(),
      metadata 
    };
    
    console.log('[Email Service] Checking for existing subscription:', email);
    
    // Using upsert with the unique constraint we've added to the email column
    // This will either insert a new record or do nothing if the email already exists
    const { data, error } = await supabase
      .from('deadpunch_email_capture')
      .upsert([emailData], { 
        onConflict: 'email',
        ignoreDuplicates: true // Don't update if record exists
      });
      
    if (error) {
      console.error('[Email Service] Database error when inserting email:', error);
      return { 
        success: false, 
        error: `Database error: ${error.message}` 
      };
    }
    
    // Fix for TypeScript null safety - properly handle both null and empty array cases
    // This addresses the error: Property 'length' does not exist on type 'never'
    // as well as the error: 'data' is possibly 'null'
    const isDuplicate = !data || (Array.isArray(data) && data.length === 0);
    
    if (isDuplicate) {
      console.log('[Email Service] Email already exists in database:', email);
      return { 
        success: true, 
        duplicate: true 
      };
    }
    
    console.log('[Email Service] Email subscription saved successfully:', email);
    return { success: true };
    
  } catch (error) {
    // Handle any unexpected errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Email Service] Unexpected error:', errorMessage);
    
    return { 
      success: false, 
      error: `Unexpected error: ${errorMessage}` 
    };
  }
};
