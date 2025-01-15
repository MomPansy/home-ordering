import { createClient } from '@supabase/supabase-js';
import { type Database } from 'database.gen';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error('Missing env variable SUPABASE_URL');
}
if (!supabaseKey) {
    throw new Error('Missing env variable SUPABASE_ANON_KEY');
}
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase