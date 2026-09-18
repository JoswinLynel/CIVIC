import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

export const createAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase URL or Service Key missing. Admin client will not work.");
  }
  return createClient(supabaseUrl || 'http://localhost:54321', supabaseServiceKey || 'fake-key');
};
