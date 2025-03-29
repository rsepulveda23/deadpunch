
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
    isAdminEmailAuthorized: false
  });

  const updateState = (newState: Partial<AuthState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/blog-admin');
      } else {
        checkAdminAccount();
        checkAdminEmailAuthorization();
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const checkAdminEmailAuthorization = async () => {
    try {
      // Use a more generalized query approach to avoid type errors
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('email')
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin authorization:', error);
        return;
      }
      
      if (data) {
        updateState({
          email: data.email,
          isAdminEmailAuthorized: true
        });
      }
    } catch (error) {
      console.error('Error checking admin email authorization:', error);
    }
  };
  
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
      // Use a more generalized query approach to avoid type errors
      const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('email')
        .eq('email', state.email)
        .maybeSingle();
      
      if (adminError) {
        toast.error('Error checking admin authorization');
        console.error('Admin authorization check error:', adminError);
        updateState({ isLoading: false });
        return;
      }
      
      if (!adminData) {
        toast.error('This email is not authorized to create an admin account');
        updateState({ isLoading: false });
        return;
      }
      
      // Sign up with auto-confirm enabled
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
        // Immediately sign in after signup to bypass confirmation
        await handleDirectSignIn();
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      console.error('Sign up error:', error);
      updateState({ isLoading: false });
    }
  };
  
  // Direct sign in without requiring email confirmation
  const handleDirectSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success('Sign in successful!');
        navigate('/blog-admin');
      }
    } catch (error: any) {
      // If this is specifically an email confirmation error, try to sign in anyway
      if (error.message && error.message.includes('Email not confirmed')) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          toast.success('Sign in successful!');
          navigate('/blog-admin');
          return;
        }
      }
      
      toast.error(error.message || 'An error occurred during sign in');
      console.error('Sign in error:', error);
    } finally {
      updateState({ isLoading: false });
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ isLoading: true });
    
    try {
      await handleDirectSignIn();
    } catch (error) {
      // Error handling is done in handleDirectSignIn
      console.error('Outer sign in error:', error);
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
