import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi di file .env"
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

export default supabase;