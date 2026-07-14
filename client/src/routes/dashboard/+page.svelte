<script>
  import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { getLessonCatalog } from "$lib/javascript/lessons.js";
  import { TODO, IN_PROGRESS, COMPLETED } from "$lib/javascript/progress.js";
  import {
    progress,
    progressReady,
    progressError,
  } from "$lib/stores/progress.js";
  import { profile, profileReady } from "$lib/stores/profile.js";
  import { canViewLeaderboard } from "$lib/javascript/points.js";

  // Progress rows only know a lesson by its slug, so pair each one back up with
  // the lesson it belongs to in order to show a title and a link.
  const lessons = getLessonCatalog();

  const byStatus = $derived.by(() => {
    const groups = { [TODO]: [], [IN_PROGRESS]: [], [COMPLETED]: [] };

    for (const lesson of lessons) {
      const row = $progress[lesson.lessonId];
      // No row means the lesson isn't tracked — it belongs in none of the lists.
      if (row) groups[row.status]?.push({ ...lesson, ...row });
    }

    return groups;
  });

  const dateFor = (row) =>
    new Date(row.completed_at ?? row.created_at).toLocaleDateString();
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
            <p class="hero-copy">
              Keep track of your lesson progress, upcoming recipes, and
              completed cooking challenges in one place.
            </p>
          </div>
          <div class="hero-pill">
            {#if $profileReady && $profile}
              Lv {$profile.level_number} · {$profile.level_title}<br />
              {$profile.xp} XP · 🔥 {$profile.current_streak} day streak
            {:else}
              🔥 Loading stats…
            {/if}
          </div>
        </header>

        {#if $profileReady && $profile && !canViewLeaderboard($profile.level_number)}
          <p class="unlock-hint">
            Earn 10 XP (complete a beginner lesson) to unlock the leaderboard.
          </p>
        {/if}

        {#if $profileReady && $profile && canViewLeaderboard($profile.level_number)}
          <p class="leaderboard-link">
            <a href="/leaderboard">View leaderboard →</a>
          </p>
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
                <a class="card" href={lesson.href}>
                  <h3>{lesson.title}</h3>
                  <p>Started on: {dateFor(lesson)}</p>
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
                <a class="card" href={lesson.href}>
                  <h3>{lesson.title}</h3>
                  <p>Added on: {dateFor(lesson)}</p>
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
                <a class="card" href={lesson.href}>
                  <h3>{lesson.title}</h3>
                  <p>
                    Completed on: {dateFor(lesson)}
                    {#if lesson.points_earned}
                      · {lesson.points_earned} XP
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
    /* max-width: 980px; */
    width: 70%;
    margin: 0 auto;
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
      margin: 0 0 0.4rem;
      font-size: 2rem;
    }

    & .hero-copy {
      margin: 0;
      max-width: 620px;
    }

    & .hero-pill {
      background: var(--panel-color);

      font-weight: 700;
      padding: 0.7rem 1rem;
      border-radius: 999px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

    & .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      & h2 {
        margin: 0;
        font-size: 1.2rem;
      }

      & span {
        font-size: 0.9rem;
        color: #777;
      }
    }

    & .card-box {
      display: block;

      & .lesson-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
        & .card {
          color: var(--text-color);
          background: var(--page-color);
          padding: 1rem 1.1rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;

          /* The cards are links now, so each one opens the lesson it names. */
          flex: 1;
          display: block;
          text-decoration: none;

          &:hover {
            border-color: var(--text-muted);
          }

          & h3 {
            margin: 0 0 0.35rem;
            font-size: 1rem;
          }

          & p {
            margin: 0;
          }
        }
        @media (min-width: 700px) {
          flex-direction: row;
        }
      }
    }

    .empty {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .load-error {
      margin: 0 0 1rem;
      padding: 0.6rem 0.9rem;
      border-radius: 10px;
      background: #fee2e2;
      color: #991b1b;
      font-size: 0.85rem;
    }

    .unlock-hint,
    .leaderboard-link {
      margin: 0 0 1rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .leaderboard-link a {
      color: #12b7ea;
      font-weight: 600;
      text-decoration: none;
    }
  }
</style>
