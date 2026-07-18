// A single Supabase client for the whole app (browser side).
// The URL + anon key come from client/.env (PUBLIC_ vars are exposed to the
// browser by SvelteKit on purpose — the anon key is meant to be public).
import { browser } from "$app/environment";
import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";

const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL ?? "";
const PUBLIC_SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY ?? "";

function createServerStub() {
  const fail = () => {
    throw new Error("Supabase client is only available in the browser.");
  };

  return {
    auth: {
      getUser: fail,
      getSession: fail,
      onAuthStateChange: fail,
      signInWithPassword: fail,
      signUp: fail,
      signOut: fail,
      updateUser: fail,
    },
    from: fail,
    rpc: fail,
  };
}

export const supabase = browser
  ? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
  : /** @type {ReturnType<typeof createServerStub>} */ (createServerStub());
