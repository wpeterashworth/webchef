// Point-system rules from point-system.txt (kept in sync with the DB migration).

export const LESSON_POINTS = {
  beginner: 10,
  intermediate: 25,
  advanced: 50,
};

/** Minimum user level_number required to unlock each feature. */
export const UNLOCK_LEVEL = {
  leaderboard: 1,
  intermediate: 2,
  expert: 5,
  createLessons: 20,
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
