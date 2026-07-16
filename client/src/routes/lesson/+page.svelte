<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import LessonCard from "$lib/components/lesson-card.svelte";
  import { onMount } from "svelte";
  import { getLessonCatalog } from "$lib/javascript/lessons.js";
  import {
    getPublicUserLessons,
    userLessonRowToCard,
  } from "$lib/javascript/user-lessons.js";

  const builtInCards = getLessonCatalog();

  let communityCards = $state([]);
  let loadingCommunity = $state(true);
  let communityError = $state(null);

  const cards = $derived([...builtInCards, ...communityCards]);

  onMount(async () => {
    try {
      const rows = await getPublicUserLessons();
      communityCards = rows.map(userLessonRowToCard);
    } catch (error) {
      communityError = error;
      communityCards = [];
    } finally {
      loadingCommunity = false;
    }
  });
</script>

<svelte:head>
  <title>Lessons | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <AuthGuard>
      <section class="lessons-page">
        <header class="page-header">
          <p class="eyebrow">Choose a topic</p>
          <h1>Lessons</h1>
          <p class="intro">
            Each lesson walks you through several skills — pick a difficulty, read
            a short intro, take the quiz, then move on to the next topic.
          </p>
        </header>

        {#if communityError}
          <p class="banner-error">{communityError.message}</p>
        {/if}

        {#if cards.length > 0}
          <div class="lesson-grid">
            {#each cards as card (card.lessonId)}
              <LessonCard {...card} />
            {/each}
          </div>
        {:else if !loadingCommunity}
          <p class="empty-state">No lessons are available yet. Check back soon.</p>
        {:else}
          <div class="lesson-grid">
            {#each builtInCards as card (card.lessonId)}
              <LessonCard {...card} />
            {/each}
          </div>
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

  .lessons-page {
    max-width: 1100px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2rem;
    color: var(--text-color);
  }

  .eyebrow {
    margin: 0 0 0.4rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .page-header h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    color: var(--text-color);
  }

  .intro {
    margin: 0;
    max-width: 640px;
    line-height: 1.5;
    color: var(--text-muted);
  }

  .banner-error {
    margin: 0 0 1rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: #fee2e2;
    color: #991b1b;
  }

  .lesson-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    align-items: stretch;
  }

  .empty-state {
    margin: 0;
    padding: 2rem;
    text-align: center;
    color: var(--text-color);
    background: var(--panel-color);
    border-radius: 16px;
  }
</style>
