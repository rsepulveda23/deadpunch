
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
  
  /** Whether the email was already in the database */
  duplicate?: boolean;
  
  /** Error message if the operation failed */
  error?: string;
}

/**
 * Saves an email subscription via Supabase Edge Function
 * 
 * This function handles calling the Edge Function that saves the email to the database.
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
    console.log('[Email Service] Saving email subscription via Edge Function:', email);
    
    // Call the Supabase Edge Function to handle the email subscription
    const { data, error } = await supabase.functions.invoke('collect-email', {
      body: { email, metadata }
    });
    
    if (error) {
      console.error('[Email Service] Edge Function error:', error);
      return { 
        success: false, 
        error: `Function error: ${error.message}` 
      };
    }
    
    // Success response - data will now include the duplicate flag from the edge function
    console.log('[Email Service] Email subscription saved successfully:', email, data);
    return { 
      success: true,
      duplicate: data?.duplicate || false
    };
    
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
