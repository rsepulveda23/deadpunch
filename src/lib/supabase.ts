
/**
 * Supabase Client Integration
 * 
 * This file sets up the Supabase client and provides utility functions
 * for interacting with the Supabase database, specifically for email
 * subscription management.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

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
  if (!email || !validateEmailFormat(email)) {
    return { 
      success: false, 
      error: 'Invalid email format' 
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
    
    // Check if email already exists to handle duplicates gracefully
    const { data: existingData, error: checkError } = await supabase
      .from('deadpunch_email_capture')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    if (checkError) {
      console.error('[Email Service] Database error when checking for existing email:', checkError);
      return { 
        success: false, 
        error: `Database error: ${checkError.message}` 
      };
    }
    
    // Return early with success if email already exists
    if (existingData && existingData.length > 0) {
      console.log('[Email Service] Email already exists in database:', email);
      return { 
        success: true, 
        duplicate: true 
      };
    }
    
    console.log('[Email Service] Inserting new email subscription:', email);
    
    // Insert the new email subscription - IMPORTANT: we're using upsert to avoid race conditions
    // and we're setting `onConflict: 'email'` to handle the case where the email already exists
    const { error: insertError } = await supabase
      .from('deadpunch_email_capture')
      .upsert([emailData], { onConflict: 'email' });
    
    if (insertError) {
      console.error('[Email Service] Database error when inserting email:', insertError);
      return { 
        success: false, 
        error: `Database error: ${insertError.message}` 
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

/**
 * Validates email format using regex
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format is valid
 */
const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
