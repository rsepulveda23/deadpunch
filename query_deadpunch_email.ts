
import { supabase } from '@/integrations/supabase/client';

async function queryEmailCapture(): Promise<void> {
  const { data, error } = await supabase
    .from('deadpunch_email_capture')
    .select('*');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Results:', data);
  }
}

queryEmailCapture();
