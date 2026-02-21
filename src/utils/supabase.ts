import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
}

// Use Service Role Key for backend admin bypass (ex: fetching full order details for Telegram)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
