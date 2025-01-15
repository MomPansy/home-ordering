import { createClient } from '@supabase/supabase-js';
import { type Database } from 'database.gen';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error('Missing env variable SUPABASE_URL');
}
if (!supabaseKey) {
    throw new Error('Missing env variable SUPABASE_ANON_KEY');
}
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase