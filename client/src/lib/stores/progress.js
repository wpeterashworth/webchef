// Global lesson-progress state, mirroring $lib/stores/auth.js.
//
// Loaded once when a user signs in and kept in memory, so a lesson card can ask
// "what's my status for this slug?" without a round trip per card. Writes go to
// Supabase first, then update the store, so what's on screen always reflects
// what's actually saved.

import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { user } from "$lib/stores/auth.js";
import * as api from "$lib/javascript/progress.js";

/** lesson slug -> progress row. Empty object when signed out. */
export const progress = writable({});

/** Flips true once progress has been fetched, so the UI can hold off on badges. */
export const progressReady = writable(false);

/** Set when a load or write fails, so pages can surface it instead of guessing. */
export const progressError = writable(null);

const bySlug = (rows) =>
  Object.fromEntries(rows.map((row) => [row.lesson_slug, row]));

if (browser) {
  // Reload whenever the signed-in user changes — including to null on logout,
  // which must clear the store so the next person never sees the last one's data.
  user.subscribe(async (currentUser) => {
    if (!currentUser) {
      progress.set({});
      progressError.set(null);
      progressReady.set(true);
      return;
    }

    progressReady.set(false);

    try {
      progress.set(bySlug(await api.getProgress()));
      progressError.set(null);
    } catch (error) {
      progress.set({});
      progressError.set(error);
    } finally {
      progressReady.set(true);
    }
  });
}

/** Save a status and reflect it in the store. */
export async function setStatus(lessonSlug, status) {
  const row = await api.setStatus(lessonSlug, status);
  progress.update((rows) => ({ ...rows, [lessonSlug]: row }));
}

/** Mark started, unless the lesson is already in progress or finished. */
export async function markStarted(lessonSlug, currentStatus) {
  const row = await api.markStarted(lessonSlug, currentStatus);
  if (row) progress.update((rows) => ({ ...rows, [lessonSlug]: row }));
}

/** Stop tracking a lesson — removes it from the to-do list. */
export async function clearStatus(lessonSlug) {
  await api.clearStatus(lessonSlug);
  progress.update((rows) => {
    const { [lessonSlug]: _removed, ...rest } = rows;
    return rest;
  });
}
