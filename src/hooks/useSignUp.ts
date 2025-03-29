
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithPassword } from '@/services/authService';
import { toast } from 'sonner';

export const useSignUp = (
  email: string, 
  password: string, 
  setLoading: (isLoading: boolean) => void
) => {
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First attempt to sign up
      const { data, error } = await signUp(email, password);
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success('Admin account created! Signing you in...');
        
        // Force sign in after signup
        try {
          const { data: signInData, error: signInError } = await signInWithPassword(email, password);
          
          if (signInError) {
            console.log("Sign in error after signup:", signInError);
            toast.error(signInError.message || "Please sign in with your new credentials");
            setLoading(false);
            return;
          }
          
          if (signInData?.user) {
            console.log("Successfully signed in after signup");
            toast.success('Signed in successfully! Redirecting to admin dashboard...');
            navigate('/blog-admin');
          }
        } catch (signInAttemptError) {
          console.error("Error in sign in attempt:", signInAttemptError);
          toast.error("Please try signing in manually");
          setLoading(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      console.error('Sign up error:', error);
      setLoading(false);
    }
  };

  return { handleSignUp };
};
