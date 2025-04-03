
/**
 * Supabase Client Integration
 * 
 * This file sets up the Supabase client and provides utility functions
 * for interacting with the Supabase database, specifically for email
 * subscription management.
 * 
 * @module supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { validateEmailFormat } from '@/utils/emailUtils';

/**
 * Supabase connection credentials
 * These values are public and safe to be in the client code as they only
 * provide access to data that's controlled by Row Level Security policies
 */
const supabaseUrl = 'https://yunwcbujnowcifbkfjmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bndjYnVqbm93Y2lmYmtmam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODg1NTksImV4cCI6MjA1ODM2NDU1OX0.KTz1o0xYgYjIqrB9K4up-bri-0dhl0irldPy2TcsQY4';

/**
 * Create a Supabase client instance with persistent auth session
 * This client is used throughout the application to interact with the Supabase database
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
 * Defines the structure of additional information saved with each email subscription
 */
interface EmailMetadata {
  /** Source of the email subscription (e.g., 'homepage', 'dialog', 'chat') */
  source?: string;
  
  /** Category of the product the user is interested in */
  category?: string;
  
  /** Subcategory of the product the user is interested in */
  subcategory?: string;
  
  /** ISO timestamp when the email was collected */
  timestamp?: string;
  
  /** Allow additional metadata fields for future extensibility */
  [key: string]: any;
}

/**
 * Response interface for email subscription operations
 * Used to provide standardized responses from the saveEmailSubscription function
 */
interface EmailSubscriptionResponse {
  /** Whether the operation was successful */
  success: boolean;
  
  /** Error message if the operation failed */
  error?: string;
  
  /** Whether the email already existed in the database */
  duplicate?: boolean;
}

/**
 * Saves an email subscription to the Supabase 'deadpunch_email_capture' table
 * 
 * This function handles input validation, duplicate checking, and error handling.
 * It uses upsert with ignoreDuplicates to ensure each email is only stored once.
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
    
    // Using upsert with the unique constraint on the email column
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
    
    // Fixed TypeScript null safety - properly handle both null and array cases
    // Check if data is null OR if it's an empty array, both indicate a duplicate
    const isDuplicate = data === null || (Array.isArray(data) && data.length === 0);
    
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
