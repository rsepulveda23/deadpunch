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
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
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
 * Sends a welcome email to a newly subscribed user
 * 
 * @param {string} email - The subscriber's email address
 * @param {EmailMetadata} metadata - Optional metadata about the subscription
 * @returns {Promise<boolean>} Success status of the operation
 */
const sendWelcomeEmail = async (
  email: string,
  metadata: EmailMetadata = {}
): Promise<boolean> => {
  try {
    console.log('[Email Service] Sending welcome email to:', email);
    
    const { error } = await supabase.functions.invoke('send-welcome-email', {
      body: { email, metadata },
    });
    
    if (error) {
      console.error('[Email Service] Error sending welcome email:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Email Service] Unexpected error sending welcome email:', error);
    return false;
  }
};

/**
 * Saves an email subscription directly to the Supabase database
 * 
 * This function handles saving the email to the database and checking for duplicates.
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
    console.log('[Email Service] Saving email subscription:', email);
    
    // First check if the email already exists in the database
    const { data: existingEmails, error: checkError } = await supabase
      .from('deadpunch_email_capture')
      .select('email')
      .eq('email', email)
      .limit(1);
    
    if (checkError) {
      console.error('[Email Service] Error checking for existing email:', checkError);
      return { 
        success: false, 
        error: `Database error: ${checkError.message}` 
      };
    }
    
    // If email already exists, return success with duplicate flag
    if (existingEmails && existingEmails.length > 0) {
      console.log('[Email Service] Email already exists:', email);
      return { 
        success: true,
        duplicate: true
      };
    }
    
    // If email doesn't exist, insert it into the database
    const { error: insertError } = await supabase
      .from('deadpunch_email_capture')
      .insert([{ 
        email, 
        created_at: new Date().toISOString(),
        metadata 
      }]);
    
    if (insertError) {
      console.error('[Email Service] Error inserting email:', insertError);
      return { 
        success: false, 
        error: `Database error: ${insertError.message}` 
      };
    }
    
    // Send welcome email for new subscriptions
    // Note: We don't await this to keep the response fast
    // The email sending runs in the background
    sendWelcomeEmail(email, metadata)
      .then(success => {
        if (!success) {
          console.warn('[Email Service] Failed to send welcome email to:', email);
        }
      });
    
    // Success response
    console.log('[Email Service] Email subscription saved successfully:', email);
    return { 
      success: true,
      duplicate: false
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
