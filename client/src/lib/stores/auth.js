// Global auth state. Any component can `import { user } from "$lib/stores/auth"`
// and reactively read who is logged in (or null when signed out).
import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { supabase } from "$lib/supabase/client.js";

// Holds the current Supabase user object, or null when signed out.
export const user = writable(null);
// Flips to true once we've checked for an existing session, so the UI can
// avoid flickering between "logged out" and "logged in" on first paint.
export const authReady = writable(false);

// Only touch Supabase in the browser (this code also runs during SSR/build).
if (browser) {
  // Load any session that already exists (e.g. the user refreshed the page).
  supabase.auth.getSession().then(({ data }) => {
    user.set(data.session?.user ?? null);
    authReady.set(true);
  });

  // Keep the store in sync as the user logs in / out in this or another tab.
  supabase.auth.onAuthStateChange((_event, session) => {
    user.set(session?.user ?? null);
  });
}

// Sign the current user out and clear the store.
export async function logout() {
  await supabase.auth.signOut();
  user.set(null);
}
