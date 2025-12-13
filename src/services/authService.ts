import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AuthError {
  message: string;
}

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const signUp = async (email: string, password: string) => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    
    if (error) throw error;
    
    // Send DEADPUNCH welcome email after successful signup
    if (data?.user) {
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: email,
            metadata: {
              source: 'auth_signup',
              category: 'account',
              timestamp: new Date().toISOString()
            }
          }
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't block signup if welcome email fails
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error resetting password:', error.message);
    return { data: null, error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error updating password:', error.message);
    return { data: null, error };
  }
};
