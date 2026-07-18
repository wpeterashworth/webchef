// A single Supabase client for the whole app (browser side).
// The URL + anon key come from client/.env (PUBLIC_ vars are exposed to the
// browser by SvelteKit on purpose — the anon key is meant to be public).
import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";

const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL ?? "";
const PUBLIC_SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
);
