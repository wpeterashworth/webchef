// A single Supabase client for the whole app (browser side).
// The URL + anon key come from client/.env (PUBLIC_ vars are exposed to the
// browser by SvelteKit on purpose — the anon key is meant to be public).
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";

export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
);
