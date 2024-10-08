// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Ensure the environment variables are correctly loaded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anonymous key in environment variables');
}



const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;