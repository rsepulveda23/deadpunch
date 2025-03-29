
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPassword } from '@/services/authService';
import { toast } from 'sonner';

export const useSignIn = (
  email: string, 
  password: string, 
  setLoading: (isLoading: boolean) => void
) => {
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Starting sign in process');
      // Try a direct sign in first
      const { data, error } = await signInWithPassword(email, password);
      
      if (error) {
        // Try to handle email confirmation error gracefully
        if (error.message.includes('Email not confirmed')) {
          console.log('Email not confirmed error, showing instructions to user');
          
          toast.warning(
            'Email verification is required. For development, you can disable this requirement in the Supabase Dashboard under Authentication > Email.',
            { duration: 6000 }
          );
          
          // Give specific instructions
          toast.info(
            'To disable email confirmation: Go to Supabase Dashboard > Authentication > Providers > Email, and uncheck "Confirm email"', 
            { duration: 10000 }
          );

          setLoading(false);
          return;
        } else {
          throw error;
        }
      }
      
      if (data?.user) {
        toast.success('Signed in successfully!');
        console.log('Direct sign in successful, redirecting...');
        navigate('/blog-admin');
      }
    } catch (error: any) {
      // If we get here, all attempts failed
      toast.error(error.message || 'An error occurred during sign in');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSignIn };
};
