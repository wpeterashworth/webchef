<script>
  import { onMount } from "svelte";
  import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { getDifficultyLevel } from "$lib/javascript/lessons.js";
  import { getLessonBankCatalogById } from "$lib/javascript/lesson-bank.js";
  import { TODO, IN_PROGRESS, COMPLETED } from "$lib/javascript/progress.js";
  import {
    progress,
    progressReady,
    progressError,
  } from "$lib/stores/progress.js";
  import { profile, profileReady, updateDisplayTitle } from "$lib/stores/profile.js";
  import {
    canViewLeaderboard,
    canCreateLessons,
    nextLevelProgress,
    unlockedLevelTitles,
  } from "$lib/javascript/points.js";
  import {
    getMyUserLessons,
    userLessonRowToCard,
  } from "$lib/javascript/user-lessons.js";

  let customLessons = $state({});
  let bankLessons = $state({});
  let titleSaving = $state(false);
  let titleError = $state("");

  const titleOptions = $derived(
    $profile ? unlockedLevelTitles($profile.level_number) : [],
  );

  const canCreate = $derived(
    $profileReady && $profile ? canCreateLessons($profile.level_number) : false,
  );

  const xpProgress = $derived(
    $profile
      ? nextLevelProgress($profile.xp, $profile.level_number)
      : null,
  );

  const catalogById = $derived.by(() => ({
    ...bankLessons,
    ...customLessons,
  }));

  const byStatus = $derived.by(() => {
    const groups = { [TODO]: [], [IN_PROGRESS]: [], [COMPLETED]: [] };

    for (const row of Object.values($progress)) {
      const meta = catalogById[row.lesson_slug] ?? {
        title: "Custom lesson",
        href: `/lesson/${row.lesson_slug}`,
        lessonId: row.lesson_slug,
      };

      groups[row.status]?.push({
        ...meta,
        ...row,
        lessonId: row.lesson_slug,
      });
    }

    return groups;
  });

  onMount(async () => {
    try {
      const [bank, rows] = await Promise.all([
        getLessonBankCatalogById(),
        getMyUserLessons(),
      ]);

      bankLessons = bank;
      customLessons = Object.fromEntries(
        rows.map((row) => [row.slug, userLessonRowToCard(row)]),
      );
    } catch {
      bankLessons = {};
      customLessons = {};
    }
  });

  const dateFor = (row) =>
    new Date(row.completed_at ?? row.created_at).toLocaleDateString();

  function difficultyMeta(difficulty) {
    if (!difficulty) return null;
    const level = getDifficultyLevel(difficulty);
    return level ? { label: level.label, color: level.accentColor } : null;
  }

  function lessonHref(href, difficulty) {
    if (!difficulty) return href;
    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}difficulty=${difficulty}`;
  }

  async function changeTitle(nextTitle) {
    if (!$profile || titleSaving || nextTitle === $profile.level_title) return;

    titleSaving = true;
    titleError = "";
    try {
      await updateDisplayTitle(nextTitle);
    } catch (error) {
      titleError = error.message;
    } finally {
      titleSaving = false;
    }
  }
</script>

<svelte:head>
  <title>Dashboard | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <AuthGuard>
      <section class="dashboard">
        <header class="hero">
          <div>
            <p class="eyebrow">Your learning hub</p>
            <h1>Dashboard</h1>

            {#if $profileReady && $profile && xpProgress}
              <div class="level-display">
                <span class="level-number">Lv {$profile.level_number}</span>
                {#if titleOptions.length > 1}
                  <select
                    class="title-select"
                    value={$profile.level_title}
                    disabled={titleSaving}
                    aria-label="Choose level title"
                    onchange={(event) => changeTitle(event.currentTarget.value)}
                  >
                    {#each titleOptions as title (title)}
                      <option value={title}>{title}</option>
                    {/each}
                  </select>
                {:else}
                  <span class="level-title">{$profile.level_title}</span>
                {/if}
              </div>
              {#if titleError}
                <p class="title-error" role="alert">{titleError}</p>
              {/if}
              <p class="xp-progress">
                {#if xpProgress.isMax}
                  {$profile.xp} XP · Max level
                {:else}
                  {xpProgress.current}/{xpProgress.needed} XP
                {/if}
              </p>
              <p class="streak-stats">
                🔥 {$profile.current_streak} day streak
              </p>
            {:else if $profileReady}
              <p class="level-loading">Loading stats…</p>
            {/if}

            <p class="hero-copy">
              Keep track of your lesson progress, upcoming recipes, and
              completed cooking challenges in one place.
            </p>
          </div>
        </header>

        {#if $profileReady && $profile && !canViewLeaderboard($profile.level_number)}
          <p class="unlock-hint">
            Earn 10 XP (complete a beginner lesson) to unlock the leaderboard.
          </p>
        {/if}

        {#if $profileReady && $profile && canViewLeaderboard($profile.level_number)}
          <div class="builder-actions">
            <a class="builder-btn secondary" href="/leaderboard">View leaderboard</a>
          </div>
        {/if}

        {#if $progressError}
          <p class="load-error">
            Your progress couldn't be loaded: {$progressError.message}
          </p>
        {/if}

        <div class="summary-grid">
          <article class="summary-card">
            <h2>Started</h2>
            <p>{byStatus[IN_PROGRESS].length} lessons</p>
          </article>
          <article class="summary-card">
            <h2>To-Do</h2>
            <p>{byStatus[TODO].length} lessons</p>
          </article>
          <article class="summary-card">
            <h2>Completed</h2>
            <p>{byStatus[COMPLETED].length} lessons</p>
          </article>
        </div>

        {#if canCreate}
          <div class="builder-actions">
            <a class="builder-btn primary" href="/lesson/create">Create a lesson</a>
            <a class="builder-btn secondary" href="/lesson/my-lessons">My lessons</a>
          </div>
        {/if}

        <section id="started-lessons" class="container">
          <div class="section-title">
            <h2>Started Lessons</h2>
            <span>In progress</span>
          </div>

          <div class="card-box">
            {#if !$progressReady}
              <p class="empty">Loading…</p>
            {:else if byStatus[IN_PROGRESS].length === 0}
              <p class="empty">
                Nothing in progress. Open a lesson to get going.
              </p>
            {:else}
              {#each byStatus[IN_PROGRESS] as lesson (lesson.lessonId)}
                {@const diff = difficultyMeta(lesson.difficulty)}
                <a class="progress-card" href={lessonHref(lesson.href, lesson.difficulty)}>
                  <div class="progress-card-top">
                    <h3>{lesson.title}</h3>
                    {#if diff}
                      <span
                        class="difficulty-pill"
                        style={`--pill-color: ${diff.color}`}
                      >
                        {diff.label}
                      </span>
                    {/if}
                  </div>
                  <p class="progress-meta">Started on {dateFor(lesson)}</p>
                </a>
              {/each}
            {/if}
          </div>
        </section>

        <section id="planned-lessons" class="container">
          <div class="section-title">
            <h2>To-Do Lessons</h2>
            <span>Coming up</span>
          </div>

          <div class="card-box">
            {#if !$progressReady}
              <p class="empty">Loading…</p>
            {:else if byStatus[TODO].length === 0}
              <p class="empty">
                Your to-do list is empty. Add a lesson from the
                <a href="/lesson">lessons page</a>.
              </p>
            {:else}
              {#each byStatus[TODO] as lesson (lesson.lessonId)}
                {@const todoDifficulty = lesson.difficulty ?? "beginner"}
                {@const diff = difficultyMeta(todoDifficulty)}
                <a
                  class="progress-card"
                  href={lessonHref(lesson.href, todoDifficulty)}
                >
                  <div class="progress-card-top">
                    <h3>{lesson.title}</h3>
                    {#if diff}
                      <span
                        class="difficulty-pill"
                        style={`--pill-color: ${diff.color}`}
                      >
                        {diff.label}
                      </span>
                    {/if}
                  </div>
                  <p class="progress-meta">Added on {dateFor(lesson)}</p>
                </a>
              {/each}
            {/if}
          </div>
        </section>

        <section id="completed-lessons" class="container">
          <div class="section-title">
            <h2>Completed Lessons</h2>
            <span>Nice work</span>
          </div>

          <div class="card-box">
            {#if !$progressReady}
              <p class="empty">Loading…</p>
            {:else if byStatus[COMPLETED].length === 0}
              <p class="empty">No lessons finished yet.</p>
            {:else}
              {#each byStatus[COMPLETED] as lesson (lesson.lessonId)}
                {@const diff = difficultyMeta(lesson.difficulty)}
                <a class="progress-card" href={lessonHref(lesson.href, lesson.difficulty)}>
                  <div class="progress-card-top">
                    <h3>{lesson.title}</h3>
                    {#if diff}
                      <span
                        class="difficulty-pill"
                        style={`--pill-color: ${diff.color}`}
                      >
                        {diff.label}
                      </span>
                    {:else}
                      <span class="difficulty-pill muted">Completed</span>
                    {/if}
                  </div>
                  <p class="progress-meta">
                    Finished {dateFor(lesson)}
                    {#if lesson.points_earned}
                      · <strong>{lesson.points_earned} XP</strong>
                    {/if}
                    {#if typeof lesson.score === "number"}
                      · Score {lesson.score}%
                    {/if}
                  </p>
                </a>
              {/each}
            {/if}
          </div>
        </section>
      </section>
    </AuthGuard>
  </main>

  <Footer />
</div>

<style>
  .dashboard {
    padding: 2rem;
    width: 70%;
    max-width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @media (max-width: 700px) {
    .dashboard {
      width: 100%;
      padding: 1rem;
    }
  }

  .hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    /* background: linear-gradient(135deg, #fff3c4, #ffe082); */
    background: var(--accent-color);
    border-radius: 20px;
    color: var(--text-color);
    padding: 1.5rem 1.75rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

    & .eyebrow {
      margin: 0 0 0.4rem;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    & h1 {
      margin: 0 0 0.35rem;
      font-size: 2rem;
    }

    & .level-display {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.35rem 0.75rem;
      margin: 0 0 0.35rem;
    }

    & .level-number {
      font-size: clamp(1.75rem, 4vw, 2.35rem);
      font-weight: 800;
      line-height: 1.1;
      color: #fff9f0;
      letter-spacing: -0.02em;
    }

    & .level-title {
      font-size: clamp(1.75rem, 4vw, 2.35rem);
      font-weight: 700;
      line-height: 1.1;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    & .title-select {
      appearance: none;
      -webkit-appearance: none;
      max-width: 100%;
      margin: 0;
      padding: 0 1.6rem 0 0;
      border: none;
      border-radius: 0;
      background-color: transparent;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right center;
      background-size: 1rem;
      font: inherit;
      font-size: clamp(1.75rem, 4vw, 2.35rem);
      font-weight: 700;
      line-height: 1.1;
      color: #ffffff;
      letter-spacing: -0.01em;
      cursor: pointer;
    }

    & .title-select:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 3px;
    }

    & .title-select:disabled {
      opacity: 0.7;
      cursor: wait;
    }

    & .title-select option {
      color: var(--text-color);
      background: var(--panel-color);
      font-size: 1rem;
      font-weight: 600;
    }

    & .title-error {
      margin: 0 0 0.35rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #fee2e2;
    }

    & .xp-progress {
      margin: 0 0 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(255, 249, 240, 0.82);
    }

    & .level-loading {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: rgba(255, 249, 240, 0.9);
    }

    & .streak-stats {
      margin: 0 0 0.75rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: rgba(255, 249, 240, 0.78);
    }

    & .hero-copy {
      margin: 0;
      max-width: 620px;
    }

    @media (max-width: 700px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .summary-card {
    padding: 1rem 1.2rem;
    background: var(--panel-color);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

    & h2 {
      margin: 0 0 0.3rem;
      font-size: 1rem;
    }

    & p {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
    }
  }

  .builder-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0 0 1.25rem;
  }

  .builder-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    font: inherit;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.2;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .builder-btn:focus-visible {
    outline: 2px solid #12b7ea;
    outline-offset: 2px;
  }

  .builder-btn.primary {
    background: #12b7ea;
    color: #fff;
    border: 1px solid #0ea5d8;
    box-shadow: 0 2px 6px rgba(18, 183, 234, 0.25);
  }

  .builder-btn.primary:visited {
    color: #fff;
  }

  .builder-btn.primary:hover {
    background: #0ea5d8;
  }

  .builder-btn.secondary {
    background: var(--input-bg);
    color: var(--text-color);
    border: 1px solid var(--input-border);
  }

  .builder-btn.secondary:visited {
    color: var(--text-color);
  }

  .builder-btn.secondary:hover {
    border-color: #12b7ea;
  }

  .page-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .container {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    background: var(--panel-color);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    & .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.35rem 0.75rem;
      margin-bottom: 0.75rem;

      & h2 {
        margin: 0;
        font-size: 1.2rem;
      }

      & span {
        font-size: 0.9rem;
        color: var(--text-muted);
      }
    }

    & .card-box {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
      gap: 0.75rem;
      min-width: 0;
    }

    & .progress-card {
      display: block;
      min-width: 0;
      max-width: 100%;
      padding: 1rem 1.1rem;
      border-radius: 12px;
      background: var(--page-color);
      border: 1px solid color-mix(in srgb, var(--text-color) 14%, transparent);
      text-decoration: none;
      color: var(--text-color);
      box-sizing: border-box;
      overflow: hidden;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;

      &:hover {
        border-color: var(--text-muted);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }
    }

    & .progress-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.6rem;
      margin-bottom: 0.45rem;
      min-width: 0;
    }

    & .progress-card h3 {
      margin: 0;
      flex: 1 1 auto;
      min-width: 0;
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.35;
      color: var(--text-color);
      overflow-wrap: anywhere;
    }

    & .progress-meta {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.45;
      color: var(--text-muted);
      overflow-wrap: anywhere;
    }

    & .progress-meta strong {
      color: var(--text-color);
      font-weight: 700;
    }

    & .difficulty-pill {
      flex-shrink: 0;
      padding: 0.22rem 0.55rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: color-mix(in srgb, var(--pill-color) 24%, var(--page-color));
      color: var(--text-color);
      border: 1px solid color-mix(in srgb, var(--pill-color) 50%, transparent);
    }

    & .difficulty-pill.muted {
      background: var(--panel-color);
      border-color: color-mix(in srgb, var(--text-muted) 35%, transparent);
      color: var(--text-muted);
      text-transform: none;
      font-weight: 600;
      font-size: 0.72rem;
    }

    .empty {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.9rem;

      & a {
        color: #12b7ea;
        font-weight: 600;
        text-decoration: none;
      }
    }

    .load-error {
      margin: 0 0 1rem;
      padding: 0.6rem 0.9rem;
      border-radius: 10px;
      background: #fee2e2;
      color: #991b1b;
      font-size: 0.85rem;
    }

    .unlock-hint {
      margin: 0 0 1rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  }

  @media (max-width: 700px) {
    .container {
      padding: 1rem;
    }

    .container .card-box {
      grid-template-columns: 1fr;
    }
  }
</style>
