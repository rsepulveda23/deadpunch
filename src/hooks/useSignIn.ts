
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
          console.log('Email not confirmed error, trying to bypass...');
          
          // For blog admin purposes, we'll just tell the user to try again
          toast.warning('Email verification is required. Please check your email or contact support.');
          
          // Try to auto-verify for development purposes
          try {
            // Attempt another sign in - sometimes it works on second try if email confirmation is disabled
            const { data: secondAttempt, error: secondError } = await signInWithPassword(email, password);
            
            if (secondError) {
              throw secondError;
            }
            
            if (secondAttempt?.user) {
              toast.success('Signed in successfully!');
              navigate('/blog-admin');
              return;
            }
          } catch (bypassError) {
            console.error('Error during second attempt:', bypassError);
            throw error; // Throw original error if bypass fails
          }
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
