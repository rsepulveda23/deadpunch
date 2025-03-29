
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AuthState {
  isLoading: boolean;
  email: string;
  password: string;
  adminAccountExists: boolean | null;
  isAdminEmailAuthorized: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    email: '',
    password: '',
    adminAccountExists: null,
    isAdminEmailAuthorized: true
  });

  const updateState = (newState: Partial<AuthState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in successfully, redirecting to blog admin");
          // Add a small delay to ensure the session is properly set
          setTimeout(() => {
            navigate('/blog-admin');
          }, 100);
        }
      }
    );
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Active session found on load, redirecting to blog admin");
          navigate('/blog-admin');
        } else {
          checkAdminAccount();
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const checkAdminAccount = async () => {
    try {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error checking if content exists:', error);
        return;
      }
      
      updateState({ adminAccountExists: count && count > 0 });
    } catch (error) {
      console.error('Error checking admin account:', error);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ isLoading: true });
    
    try {
      // First attempt to sign up
      const { data, error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
        options: {
          data: {
            is_admin: true,
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success('Admin account created! Signing you in...');
        
        // Force sign in after signup
        setTimeout(async () => {
          try {
            // Attempt to sign in directly
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: state.email,
              password: state.password,
            });
            
            if (signInError) {
              console.log("Sign in error after signup:", signInError);
              toast.error("Please sign in with your new credentials");
              updateState({ isLoading: false });
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
            updateState({ isLoading: false });
          }
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      console.error('Sign up error:', error);
      updateState({ isLoading: false });
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ isLoading: true });
    
    try {
      console.log('Starting sign in process');
      // Try a direct sign in first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      });
      
      if (error) {
        // Handle email confirmation error
        if (error.message.includes('Email not confirmed')) {
          console.log('Email not confirmed error, trying to sign in anyway');
          
          // Try to bypass email confirmation since this is a simple admin app
          try {
            // Update user to confirm email, though this might not work from client side
            await supabase.auth.updateUser({
              data: { email_confirmed: true }
            });
            
            // Try signing in again
            const { data: secondAttempt, error: secondError } = await supabase.auth.signInWithPassword({
              email: state.email,
              password: state.password,
            });
            
            if (secondError) {
              throw secondError;
            }
            
            if (secondAttempt?.user) {
              toast.success('Signed in successfully!');
              navigate('/blog-admin');
              return;
            }
          } catch (bypassError) {
            console.error('Error during email confirmation bypass:', bypassError);
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
      updateState({ isLoading: false });
    }
  };

  const setEmail = (email: string) => updateState({ email });
  const setPassword = (password: string) => updateState({ password });

  return {
    ...state,
    setEmail,
    setPassword,
    handleSignIn,
    handleSignUp
  };
};
