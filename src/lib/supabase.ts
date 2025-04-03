
/**
 * Supabase Integration
 * 
 * This file sets up the Supabase client and provides utility functions
 * for interacting with Supabase services like database.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://yunwcbujnowcifbkfjmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bndjYnVqbm93Y2lmYmtmam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODg1NTksImV4cCI6MjA1ODM2NDU1OX0.KTz1o0xYgYjIqrB9K4up-bri-0dhl0irldPy2TcsQY4';

// Create a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Saves an email subscription to the Supabase database
 * 
 * @param {string} email - The subscriber's email address
 * @param {Object} metadata - Optional metadata about subscription
 * @returns {Promise<{success: boolean, error?: any, duplicate?: boolean}>} Success status and any errors
 */
export const saveEmailSubscription = async (email, metadata = {}) => {
  try {
    // Basic validation
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Invalid email format' };
    }
    
    // Format the data for insertion
    const emailData = { 
      email, 
      created_at: new Date().toISOString(),
      metadata 
    };
    
    console.log('Checking for existing email subscription:', email);
    
    // Check for existing email
    const { data: existingData, error: checkError } = await supabase
      .from('deadpunch_email_capture')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking for existing email:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // If email already exists, return success with duplicate flag
    if (existingData && existingData.length > 0) {
      console.log('Email already exists in database:', email);
      return { success: true, duplicate: true };
    }
    
    console.log('Inserting new email subscription:', emailData);
    
    // Insert the new email
    const { error: insertError } = await supabase
      .from('deadpunch_email_capture')
      .insert([emailData]);
    
    if (insertError) {
      console.error('Error inserting email:', insertError);
      return { success: false, error: insertError.message };
    }
    
    console.log('Email subscription saved successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Email subscription error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
