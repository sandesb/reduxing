// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client using environment variables
const supabaseUrl = process.env.REDUXING_SUPABASE_URL;
const supabaseAnonKey = process.env.REDUXING_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;