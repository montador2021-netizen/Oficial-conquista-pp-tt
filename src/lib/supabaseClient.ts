import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Client-side functionality will be limited.");
}

// NOTE: This uses client-side environment variables. Ensure these keys are restricted to your domain in Supabase.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
