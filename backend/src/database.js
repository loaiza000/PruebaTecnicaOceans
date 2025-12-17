import "./config/env.js";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.API_KEY_SUPABASE;

if (!supabaseUrl) {
  throw new Error("supabase_url no esta definida en el archivo .env");
}

if (!supabaseKey) {
  throw new Error("api_key_supabase no esta definida en el archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
