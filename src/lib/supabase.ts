import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNDQxNjcxNCwiZXhwIjoyMjQ1OTI4NzE0fQ.mock";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Admin client for backend operations (bypasses RLS)
export const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey as string, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
