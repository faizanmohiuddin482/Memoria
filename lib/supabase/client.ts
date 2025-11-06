import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables. NEXT_PUBLIC_SUPABASE_URL: ${
      supabaseUrl ? "set" : "missing"
    }, NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "set" : "missing"}`
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    `Invalid Supabase URL format: "${supabaseUrl}". Must be a valid HTTP or HTTPS URL.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
