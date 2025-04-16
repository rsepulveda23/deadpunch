
/**
 * Supabase Client Integration
 * 
 * This file sets up the Supabase client and provides utility functions
 * for interacting with the Supabase database, specifically for email
 * subscription management.
 * 
 * @module supabase
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { validateEmailFormat } from '@/utils/emailUtils';

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
 * Sends a welcome email to a newly subscribed user using the Supabase Edge Function
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
    
    console.log('[Email Service] Welcome email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('[Email Service] Unexpected error sending welcome email:', error);
    return false;
  }
};

/**
 * Triggers the Motion task creation for a new email subscription
 * 
 * @param {string} email - The subscriber's email address
 * @param {EmailMetadata} metadata - Optional metadata about the subscription
 * @returns {Promise<boolean>} Success status of the operation
 */
const createMotionTask = async (
  email: string,
  metadata: EmailMetadata = {}
): Promise<boolean> => {
  try {
    console.log('[Email Service] Creating Motion task for:', email);
    
    const { error } = await supabase.functions.invoke('motion-task', {
      body: { 
        email, 
        name: metadata.name || email,
        metadata 
      },
    });
    
    if (error) {
      console.error('[Email Service] Error creating Motion task:', error);
      return false;
    }
    
    console.log('[Email Service] Motion task created successfully for:', email);
    return true;
  } catch (error) {
    console.error('[Email Service] Unexpected error creating Motion task:', error);
    return false;
  }
};

/**
 * Saves an email subscription directly to the Supabase database
 * 
 * This function handles saving the email to the database and checking for duplicates.
 * It also triggers the welcome email sending process.
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
    
    // Directly trigger the Motion task creation after successful database insertion
    const motionTaskCreated = await createMotionTask(email, metadata);
    if (!motionTaskCreated) {
      console.warn('[Email Service] Failed to create Motion task for:', email);
      // We don't return an error since the subscription was saved successfully
    }
    
    // Also try to send welcome email for new subscriptions
    const emailSent = await sendWelcomeEmail(email, metadata);
    if (!emailSent) {
      console.warn('[Email Service] Failed to send welcome email to:', email);
      // We don't return an error here since the subscription was saved
      // The email sending is a secondary operation
    }
    
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
