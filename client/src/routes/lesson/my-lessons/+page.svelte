<script>
  import { onMount } from "svelte";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { profile, profileReady } from "$lib/stores/profile.js";
  import {
    canCreateLessons,
    canShareLessonsPublicly,
  } from "$lib/javascript/points.js";
  import {
    deleteUserLesson,
    getMyUserLessons,
    setUserLessonVisibility,
    userLessonRowToCard,
  } from "$lib/javascript/user-lessons.js";
  /** @typedef {import("$lib/svelte/types-routes.js").LessonCard} LessonCard */

  let lessons = $state(/** @type {LessonCard[]} */ ([]));
  let loadError = $state(/** @type {Error | null} */ (null));
  let loading = $state(true);
  let actionError = $state("");
  let busySlug = $state(/** @type {string | null} */ (null));

  const canCreate = $derived(
    $profileReady && $profile ? canCreateLessons($profile.level_number) : false,
  );
  const canShare = $derived(
    $profileReady && $profile
      ? canShareLessonsPublicly($profile.level_number)
      : false,
  );

  async function loadLessons() {
    loading = true;
    loadError = null;

    try {
      const rows = await getMyUserLessons();
      lessons = rows.map(userLessonRowToCard);
    } catch (error) {
      loadError =
        error instanceof Error
          ? error
          : new Error("Could not load your lessons.");
      lessons = [];
    } finally {
      loading = false;
    }
  }

  onMount(loadLessons);

  /**
   * @param {string} slug
   * @param {boolean} nextValue
   */
  async function toggleShare(slug, nextValue) {
    actionError = "";
    busySlug = slug;

    try {
      await setUserLessonVisibility(slug, nextValue);
      await loadLessons();
    } catch (error) {
      actionError =
        error instanceof Error
          ? error.message
          : "Could not update lesson visibility.";
    } finally {
      busySlug = null;
    }
  }

  /** @param {string} slug */
  async function removeLesson(slug) {
    if (!confirm("Delete this lesson permanently?")) return;

    actionError = "";
    busySlug = slug;

    try {
      await deleteUserLesson(slug);
      await loadLessons();
    } catch (error) {
      actionError =
        error instanceof Error ? error.message : "Could not delete lesson.";
    } finally {
      busySlug = null;
    }
  }
</script>

<svelte:head>
  <title>My Lessons | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <AuthGuard>
      <section class="my-lessons-page">
        <header class="page-header">
          <p class="eyebrow">Your library</p>
          <h1>My Lessons</h1>
          {#if canCreate}
            <a class="create-link" href="/lesson/create">+ Create a lesson</a>
          {/if}
        </header>

        {#if !canCreate}
          <p class="locked">Reach level 1 to create personal lessons.</p>
        {:else if loading}
          <p class="status">Loading your lessons…</p>
        {:else if loadError}
          <p class="error">{loadError.message}</p>
        {:else if lessons.length === 0}
          <p class="status">
            You have not created any lessons yet.
            <a href="/lesson/create">Build your first one</a>.
          </p>
        {:else}
          {#if actionError}
            <p class="error">{actionError}</p>
          {/if}

          <ul class="lesson-list">
            {#each lessons as lesson (lesson.lessonId)}
              <li class="lesson-item">
                <div>
                  <h2>{lesson.title}</h2>
                  <p>{lesson.description || "No description"}</p>
                  <p class="meta">
                    {lesson.questionCount} questions ·
                    {lesson.isPublic ? "Public" : "Personal only"}
                  </p>
                </div>

                <div class="actions">
                  <a class="button" href={lesson.href}>Play</a>
                  <a
                    class="button secondary"
                    href={`/lesson/create?slug=${lesson.lessonId}`}
                  >
                    Edit
                  </a>

                  <label class="share-toggle">
                    <input
                      type="checkbox"
                      checked={lesson.isPublic}
                      disabled={!canShare || busySlug === lesson.lessonId}
                      onchange={(event) =>
                        toggleShare(
                          lesson.lessonId,
                          /** @type {HTMLInputElement} */ (event.currentTarget)
                            .checked,
                        )}
                    />
                    Public
                  </label>

                  <button
                    type="button"
                    class="button danger"
                    disabled={busySlug === lesson.lessonId}
                    onclick={() => removeLesson(lesson.lessonId)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            {/each}
          </ul>
        {/if}

        {#if canCreate && !canShare}
          <p class="hint">
            Reach level 20 to share a lesson on the main Lessons page for
            everyone.
          </p>
        {/if}
      </section>
    </AuthGuard>
  </main>

  <Footer />
</div>

<style>
  .page-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .page-content {
    flex: 1;
    padding: 2rem 1rem 3rem;
  }

  .my-lessons-page {
    max-width: 820px;
    margin: 0 auto;
    color: var(--text-color);
  }

  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.75rem 1rem;
    margin-bottom: 1.5rem;
  }

  .eyebrow {
    width: 100%;
    margin: 0;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  h1 {
    margin: 0;
    flex: 1;
  }

  .create-link {
    color: #12b7ea;
    font-weight: 700;
    text-decoration: none;
  }

  .lesson-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .lesson-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.1rem;
    border-radius: 14px;
    background: var(--panel-color);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  }

  .lesson-item h2 {
    margin: 0 0 0.35rem;
    font-size: 1.1rem;
  }

  .lesson-item p {
    margin: 0;
  }

  .meta {
    margin-top: 0.35rem !important;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .button {
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    background: #12b7ea;
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
  }

  .button.secondary {
    background: transparent;
    color: var(--text-color);
    border: 1px solid var(--text-muted);
  }

  .button.danger {
    background: #dc2626;
  }

  .share-toggle {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .locked,
  .status,
  .hint {
    color: var(--text-muted);
    line-height: 1.5;
  }

  .error {
    color: #991b1b;
    background: #fee2e2;
    padding: 0.75rem 1rem;
    border-radius: 10px;
  }
</style>
