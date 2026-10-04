import { createClient } from '@supabase/supabase-js';

const envUrl = (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL)) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL);
const envKey = (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = envUrl || 'https://fslpzikstscutxfrnxst.supabase.co';
const supabaseAnonKey = envKey || 'sb_publishable_0u-uFjMu-4oyzzG-rVhaHg_07QaW4BQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);