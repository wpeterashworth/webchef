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

export function pointsForDifficulty(difficulty) {
  return LESSON_POINTS[difficulty] ?? LESSON_POINTS.beginner;
}

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

export function unlockRequirement(difficultyId) {
  if (difficultyId === "intermediate") {
    return `Reach level ${UNLOCK_LEVEL.intermediate} to unlock`;
  }
  if (difficultyId === "advanced") {
    return `Reach level ${UNLOCK_LEVEL.expert} to unlock`;
  }
  return "";
}

export function canViewLeaderboard(levelNumber) {
  return levelNumber >= UNLOCK_LEVEL.leaderboard;
}

export function canCreateLessons(levelNumber) {
  return levelNumber >= UNLOCK_LEVEL.createLessons;
}

export function canShareLessonsPublicly(levelNumber) {
  return levelNumber >= UNLOCK_LEVEL.shareLessons;
}

/** Cumulative XP to reach each level (index = level_number). Synced with DB. */
export const LEVEL_MIN_XP = [
  0, 10, 35, 65, 100, 140, 190, 250, 320, 400, 490, 590, 700, 820, 950, 1090,
  1245, 1415, 1600, 1800, 2020,
];

export const MAX_LEVEL = 20;

/** XP earned toward the next level vs XP required for that level-up step. */
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
