
import { supabase } from '@/lib/supabase';

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

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const setupAuthListener = (
  callback: (event: any, session: any | null) => void,
  options = {}
) => {
  return supabase.auth.onAuthStateChange(callback);
};
