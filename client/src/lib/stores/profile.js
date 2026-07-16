import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { user } from "$lib/stores/auth.js";
import * as api from "$lib/javascript/profile.js";

export const profile = writable(null);
export const profileReady = writable(false);
export const profileError = writable(null);

if (browser) {
  user.subscribe(async (currentUser) => {
    if (!currentUser) {
      api.clearProfileCache();
      profile.set(null);
      profileError.set(null);
      profileReady.set(true);
      return;
    }

    profileReady.set(false);

    try {
      profile.set(await api.getProfile());
      profileError.set(null);
    } catch (error) {
      profile.set(null);
      profileError.set(error);
    } finally {
      profileReady.set(true);
    }
  });
}

/** Merge server-side gamification updates without a full reload. */
export function patchProfile(fields) {
  profile.update((current) => (current ? { ...current, ...fields } : current));
  api.clearProfileCache();
}

/** Save a cosmetic level title and update the profile store. */
export async function updateDisplayTitle(title) {
  const saved = await api.setDisplayTitle(title);
  patchProfile({ level_title: saved });
  return saved;
}
