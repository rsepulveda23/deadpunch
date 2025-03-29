
import { supabase } from '@/lib/supabase';

// This file is kept minimal after removing blog and authentication functionality
// It could be removed completely in the future if not needed

export const getSession = async () => {
  return await supabase.auth.getSession();
};

