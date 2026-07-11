<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import LessonCard from "$lib/components/lesson-card.svelte";
  import { getLessonCatalog } from "$lib/javascript/lessons.js";

  const cards = getLessonCatalog();
</script>

<svelte:head>
  <title>Lessons | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <section class="lessons-page">
      <header class="page-header">
        <p class="eyebrow">Choose a topic</p>
        <h1>Lessons</h1>
        <p class="intro">
          Each lesson walks you through several skills — pick a difficulty, read a
          short intro, take the quiz, then move on to the next topic.
        </p>
      </header>

      {#if cards.length > 0}
        <div class="lesson-grid">
          {#each cards as card (card.href)}
            <LessonCard {...card} />
          {/each}
        </div>
      {:else}
        <p class="empty-state">No lessons are available yet. Check back soon.</p>
      {/if}
    </section>
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

  .lesson-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    align-items: start;
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
