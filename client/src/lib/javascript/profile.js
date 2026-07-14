import { supabase } from "$lib/supabase/client.js";

let cachedProfile = { authUserId: null, data: null };

/** Gamification fields for the signed-in user, or null when signed out. */
export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    cachedProfile = { authUserId: null, data: null };
    return null;
  }

  if (cachedProfile.authUserId === user.id) return cachedProfile.data;

  const { data, error } = await supabase
    .from("users")
    .select(
      "id, username, xp, level_number, level_title, current_streak, longest_streak",
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(`Could not load your profile: ${error.message}`);

  if (!data) {
    throw new Error(
      "Your account has no profile row. This usually means the signup trigger did not run.",
    );
  }

  cachedProfile = { authUserId: user.id, data };
  return data;
}

/** Top players — only includes users at level 1+ (server enforced). */
export async function getLeaderboard(limit = 50) {
  const { data, error } = await supabase.rpc("get_leaderboard", {
    p_limit: limit,
  });

  if (error) throw new Error(`Could not load the leaderboard: ${error.message}`);

  return data ?? [];
}

export function clearProfileCache() {
  cachedProfile = { authUserId: null, data: null };
}
