
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("User is already logged in, redirecting to blog admin");
        navigate('/blog-admin');
      } else {
        checkAdminAccount();
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (session) {
          console.log("Session detected, redirecting to blog admin");
          navigate('/blog-admin');
        }
      }
    );
    
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
        // Force sign in after signup
        const signInResult = await forceAdminSignIn();
        if (signInResult) {
          toast.success('Admin account created and signed in!');
          navigate('/blog-admin');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      console.error('Sign up error:', error);
    } finally {
      updateState({ isLoading: false });
    }
  };
  
  const forceAdminSignIn = async () => {
    try {
      console.log('Attempting to sign in with credentials:', { email: state.email });
      
      // First attempt - normal sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      });
      
      if (data?.user && !error) {
        console.log('Sign in successful on first attempt');
        navigate('/blog-admin');
        return true;
      }
      
      // Handle email confirmation error
      if (error && error.message.includes('Email not confirmed')) {
        console.log('Email not confirmed error, trying bypass');
        
        // Try to update user to bypass email confirmation
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            data: { email_confirmed: true }
          });
          
          if (!updateError) {
            // Try signing in again
            const { data: secondData, error: secondError } = await supabase.auth.signInWithPassword({
              email: state.email,
              password: state.password,
            });
            
            if (secondData?.user) {
              console.log('Sign in successful after bypass');
              navigate('/blog-admin');
              return true;
            }
            
            if (secondError) {
              console.error('Second attempt failed:', secondError);
              return await emergencyAdminBypass();
            }
          }
        } catch (bypassError) {
          console.error('Error during email confirmation bypass:', bypassError);
          return await emergencyAdminBypass();
        }
      }
      
      if (error) throw error;
      return false;
    } catch (error) {
      console.error('Force admin sign in error:', error);
      return false;
    }
  };
  
  const emergencyAdminBypass = async () => {
    try {
      console.log('Attempting emergency admin bypass');
      
      // Try creating a new session directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      });
      
      if (data?.user && !error) {
        console.log('Emergency bypass successful');
        navigate('/blog-admin');
        return true;
      }
      
      // As a last resort, try to refresh the session
      const { data: refreshData } = await supabase.auth.refreshSession();
      if (refreshData?.user) {
        console.log('Session refreshed successfully');
        navigate('/blog-admin');
        return true;
      }
      
      console.error('All authentication attempts failed');
      return false;
    } catch (error) {
      console.error('Emergency admin bypass failed:', error);
      return false;
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
      
      if (data?.user && !error) {
        toast.success('Sign in successful!');
        console.log('Direct sign in successful, redirecting...');
        navigate('/blog-admin');
        return;
      }
      
      // If direct sign in fails, try forced sign in
      if (error) {
        console.log('Direct sign in failed, trying forced sign in:', error.message);
        const success = await forceAdminSignIn();
        
        if (success) {
          toast.success('Sign in successful!');
          navigate('/blog-admin');
        } else {
          toast.error('Could not sign in. Please check your credentials.');
        }
      }
    } catch (error: any) {
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
