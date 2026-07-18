<script>
  import {
    DIFFICULTY_LEVELS,
    countQuestionsForSkills,
  } from "$lib/javascript/lessons.js";
  import {
    difficultyUnlocked,
    pointsForDifficulty,
    unlockRequirement,
  } from "$lib/javascript/points.js";
  import {
    STATUS_LABEL,
    TODO,
    COMPLETED,
    IN_PROGRESS,
  } from "$lib/javascript/progress.js";
  import { progress, setStatus, clearStatus } from "$lib/stores/progress.js";
  import { profile } from "$lib/stores/profile.js";

  let {
    title = "Lesson Name",
    description = "",
    questionCount = 0,
    label = "",
    href = "#",
    lessonId = "",
    skills = [],
  } = $props();

  let selectedDifficulty = $state(DIFFICULTY_LEVELS[0].id);
  let saving = $state(false);

  const userLevel = $derived($profile?.level_number ?? 0);

  // undefined when the lesson isn't tracked at all — that's the fourth state,
  // and it's the absence of a row rather than a status of its own.
  const status = $derived($progress[lessonId]?.status);
  const savedDifficulty = $derived($progress[lessonId]?.difficulty);
  const statusAtSelectedDifficulty = $derived(
    status && selectedDifficulty === savedDifficulty ? status : null,
  );
  const onTodoAtSelectedDifficulty = $derived(
    status === TODO && selectedDifficulty === savedDifficulty,
  );
  const completedAtSelectedDifficulty = $derived(
    status === COMPLETED && selectedDifficulty === savedDifficulty,
  );
  const inProgressAtSelectedDifficulty = $derived(
    status === IN_PROGRESS && selectedDifficulty === savedDifficulty,
  );

  const actionLabel = $derived(
    completedAtSelectedDifficulty
      ? "Review"
      : inProgressAtSelectedDifficulty
        ? "Continue"
        : "Start Lesson",
  );

  $effect(() => {
    const savedDifficulty = $progress[lessonId]?.difficulty;
    if (savedDifficulty) {
      selectedDifficulty = savedDifficulty;
    }
  });

  /** @param {import("$lib/javascript/types-core.js").LessonDifficulty} levelId */
  async function selectDifficulty(levelId) {
    if (!difficultyUnlocked(userLevel, levelId)) return;

    selectedDifficulty = levelId;

    if (status === TODO) {
      saving = true;
      try {
        await setStatus(lessonId, TODO, levelId);
      } finally {
        saving = false;
      }
    }
  }

  async function toggleTodo() {
    saving = true;
    try {
      if (onTodoAtSelectedDifficulty) {
        await clearStatus(lessonId);
      } else {
        await setStatus(lessonId, TODO, selectedDifficulty);
      }
    } finally {
      saving = false;
    }
  }

  const activeLevel = $derived(
    DIFFICULTY_LEVELS.find((level) => level.id === selectedDifficulty) ??
      DIFFICULTY_LEVELS[0],
  );

  const displayQuestionCount = $derived(
    skills.length > 0
      ? countQuestionsForSkills(skills, selectedDifficulty)
      : questionCount,
  );

  const startHref = $derived(`${href}?difficulty=${selectedDifficulty}`);
</script>

<article
  class="card"
  style={`--accent-color: ${activeLevel.accentColor}; --card-bg: color-mix(in srgb, ${activeLevel.accentColor} 22%, var(--panel-color))`}
>
  <div class="card-inner">
    <div class="topline">
      <span class="label">{label}</span>
      <span class="count">{displayQuestionCount} Questions</span>
    </div>

    <h2>{title}</h2>

    {#if statusAtSelectedDifficulty}
      <span class="status-badge" data-status={statusAtSelectedDifficulty}>
        {STATUS_LABEL[statusAtSelectedDifficulty]}
      </span>
    {/if}

    <div class="description-scroll">
      <p class="description">{description}</p>
    </div>

    <div class="difficulty">
      <span class="difficulty-label">Difficulty</span>
      <div
        class="difficulty-options"
        role="group"
        aria-label="Choose difficulty"
      >
        {#each DIFFICULTY_LEVELS as level (level.id)}
          {@const unlocked = difficultyUnlocked(userLevel, level.id)}
          <button
            type="button"
            class:selected={selectedDifficulty === level.id}
            class:locked={!unlocked}
            style={`--level-color: ${level.accentColor}`}
            disabled={!unlocked}
            title={unlocked ? "" : unlockRequirement(level.id)}
            onclick={() => selectDifficulty(level.id)}
          >
            {level.label}
            {#if !unlocked}
              <span class="lock">🔒</span>
            {/if}
          </button>
        {/each}
      </div>
      <p class="difficulty-hint">
        {activeLevel.skillCount}
        {activeLevel.skillCount === 1 ? "skill" : "skills"} ·
        {activeLevel.questionsPerSkill} questions each ·
        {pointsForDifficulty(selectedDifficulty)} XP
      </p>
    </div>

    <div class="actions">
      <button
        type="button"
        class="todo-toggle"
        class:on={onTodoAtSelectedDifficulty}
        disabled={saving}
        aria-pressed={onTodoAtSelectedDifficulty}
        onclick={toggleTodo}
      >
        + To-Do
      </button>

      <a class="button" href={startHref}>
        {actionLabel}
      </a>
    </div>
  </div>
</article>

<style>
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 340px;
    border: 4px solid var(--accent-color);
    border-radius: 24px;
    background: var(--card-bg);
    max-width: 480px;
    overflow: hidden;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
    transition:
      border-color 0.2s ease,
      background 0.2s ease;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 12px;
      border-radius: inherit;
      background: url("/images/woodframe.webp") center/cover no-repeat;
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      z-index: 0;
    }

    .card-inner {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.75rem;
      min-height: 0;
      padding: 1rem;
      color: var(--text-color);
    }

    .topline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .description-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-right: 0.15rem;
    }

    .description-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .description-scroll::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: color-mix(in srgb, var(--text-muted) 45%, transparent);
    }

    .description {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.45;
    }

    .difficulty {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .difficulty-label {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .difficulty-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;

      button {
        border: 1px solid color-mix(in srgb, var(--text-color) 20%, transparent);
        border-radius: 999px;
        background: color-mix(
          in srgb,
          var(--page-color) 88%,
          var(--text-color)
        );
        color: var(--text-color);
        padding: 0.3rem 0.65rem;
        font-size: 0.72rem;
        font-weight: 600;
        cursor: pointer;
      }

      button.selected {
        background: var(--level-color);
        border-color: var(--level-color);
        color: #ffffff;
      }

      button.locked {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .lock {
        margin-left: 0.2rem;
        font-size: 0.65rem;
      }
    }

    .difficulty-hint {
      margin: 0;
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .status-badge {
      align-self: flex-start;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #ffffff;
    }

    .status-badge[data-status="todo"] {
      background: #6366f1;
    }

    .status-badge[data-status="in_progress"] {
      background: #eab308;
    }

    .status-badge[data-status="completed"] {
      background: #22c55e;
    }

    .actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .todo-toggle {
      padding: 0.35rem 0.7rem;
      border: 1px solid color-mix(in srgb, var(--text-color) 25%, transparent);
      border-radius: 999px;
      background: transparent;
      color: var(--text-color);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
    }

    .todo-toggle.on {
      background: #6366f1;
      border-color: #6366f1;
      color: #ffffff;
    }

    .todo-toggle:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    .button {
      margin-left: auto;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      background: var(--accent-color);
      color: #ffffff;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      transition: background 0.2s ease;
    }

    &:hover {
      filter: brightness(1.05);
    }
  }
</style>
