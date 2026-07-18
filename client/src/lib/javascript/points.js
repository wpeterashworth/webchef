// Point-system rules from point-system.txt (kept in sync with the DB migration).

export const LESSON_POINTS = {
  beginner: 10,
  intermediate: 25,
  advanced: 50,
};

/** Minimum user level_number required to unlock each feature. */
export const UNLOCK_LEVEL = {
  leaderboard: 1,
  createLessons: 1,
  shareLessons: 20,
  intermediate: 2,
  expert: 5,
};

/** @param {import("$lib/javascript/types.js").LessonDifficulty | string} difficulty */
export function pointsForDifficulty(difficulty) {
  const key =
    difficulty === "beginner" ||
    difficulty === "intermediate" ||
    difficulty === "advanced"
      ? difficulty
      : "beginner";
  return LESSON_POINTS[key];
}

/**
 * @param {number} levelNumber
 * @param {import("$lib/javascript/types.js").LessonDifficulty | string} difficultyId
 */
export function difficultyUnlocked(levelNumber, difficultyId) {
  if (difficultyId === "beginner") return true;
  if (difficultyId === "intermediate") {
    return levelNumber >= UNLOCK_LEVEL.intermediate;
  }
  if (difficultyId === "advanced") {
    return levelNumber >= UNLOCK_LEVEL.expert;
  }
  return false;
}

/** @param {import("$lib/javascript/types.js").LessonDifficulty | string} difficultyId */
export function unlockRequirement(difficultyId) {
  if (difficultyId === "intermediate") {
    return `Reach level ${UNLOCK_LEVEL.intermediate} to unlock`;
  }
  if (difficultyId === "advanced") {
    return `Reach level ${UNLOCK_LEVEL.expert} to unlock`;
  }
  return "";
}

/** @param {number} levelNumber */
export function canViewLeaderboard(levelNumber) {
  return levelNumber >= UNLOCK_LEVEL.leaderboard;
}

/** @param {number} levelNumber */
export function canCreateLessons(levelNumber) {
  return levelNumber >= UNLOCK_LEVEL.createLessons;
}

/** @param {number} levelNumber */
export function canShareLessonsPublicly(levelNumber) {
  return levelNumber >= UNLOCK_LEVEL.shareLessons;
}

/** First level at which each cosmetic title unlocks (synced with levels table). */
export const LEVEL_TITLE_TIERS = [
  { title: "Idiot Sandwitch", minLevel: 0 },
  { title: "Couch Potato", minLevel: 1 },
  { title: "Kitchen walker", minLevel: 5 },
  { title: "Lamb Sauce Finder", minLevel: 10 },
  { title: "Master Chef Dropout", minLevel: 16 },
];

/** Titles the user may display at their current level. */
/** @param {number} levelNumber */
export function unlockedLevelTitles(levelNumber) {
  return LEVEL_TITLE_TIERS.filter((tier) => levelNumber >= tier.minLevel).map(
    (tier) => tier.title,
  );
}

/** Cumulative XP to reach each level (index = level_number). Synced with DB. */
export const LEVEL_MIN_XP = [
  0, 10, 35, 65, 100, 140, 190, 250, 320, 400, 490, 590, 700, 820, 950, 1090,
  1245, 1415, 1600, 1800, 2020,
];

export const MAX_LEVEL = 20;

/** XP earned toward the next level vs XP required for that level-up step. */
/**
 * @param {number} xp
 * @param {number} levelNumber
 */
export function nextLevelProgress(xp, levelNumber) {
  if (levelNumber >= MAX_LEVEL) {
    return { current: xp, needed: LEVEL_MIN_XP[MAX_LEVEL], isMax: true };
  }

  const floor = LEVEL_MIN_XP[levelNumber] ?? 0;
  const ceiling = LEVEL_MIN_XP[levelNumber + 1];

  return {
    current: xp - floor,
    needed: ceiling - floor,
    isMax: false,
  };
}
