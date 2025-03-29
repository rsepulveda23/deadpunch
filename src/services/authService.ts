
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const checkAdminAccount = async () => {
  try {
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking if content exists:', error);
      return null;
    }
    
    return count && count > 0;
  } catch (error) {
    console.error('Error checking admin account:', error);
    return null;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          is_admin: true,
        },
        emailRedirectTo: window.location.origin + '/blog-admin'
      }
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const setupAuthListener = () => {
  return supabase.auth.onAuthStateChange((event, session) => {
    return { event, session };
  });
};
