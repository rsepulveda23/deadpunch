import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL: string = "https://yunwcbujnowcifbkfjmr.supabase.co";
const SUPABASE_API_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bndjYnVqbm93Y2lmYmtmam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODg1NTksImV4cCI6MjA1ODM2NDU1OX0.KTz1o0xYgYjIqrB9K4up-bri-0dhl0irldPy2TcsQY4";

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

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