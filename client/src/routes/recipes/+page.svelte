<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import RecipeCard from "$lib/components/recipe-card.svelte";
  import { getRecipes, getCuisines, MEALS } from "$lib/javascript/recipes.js";

  let cuisine = $state(null);
  let meal = $state(null);

  let recipes = $state([]);
  let cuisines = $state([]);
  let loading = $state(true);
  let loadError = $state(null);

  // The cuisine options come from the data, so they're fetched once up front —
  // unlike the recipes themselves, they don't change as filters change.
  getCuisines()
    .then((result) => (cuisines = result))
    .catch(() => (cuisines = [])); // a missing filter bar is not worth an error page

  // Re-queries whenever a filter changes. Filtering happens in Postgres rather
  // than in the browser: the library is small today, but pushing the predicate
  // to the database is what keeps this correct as recipes are added.
  $effect(() => {
    const filters = { cuisine, meal };

    loading = true;
    loadError = null;

    getRecipes(filters)
      .then((result) => {
        recipes = result;
      })
      .catch((error) => {
        loadError = error;
      })
      .finally(() => {
        loading = false;
      });
  });

  // Clicking the active chip clears it, so the filters double as toggles.
  const toggle = (current, value) => (current === value ? null : value);

  const hasFilters = $derived(cuisine !== null || meal !== null);
</script>

<svelte:head>
  <title>Recipes | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <section class="recipes-page">
      <header class="page-header">
        <p class="eyebrow">Cook along</p>
        <h1>Recipe Library</h1>
        <p class="intro">
          Put your lessons to work. Every recipe lists its ingredients and walks
          you through the steps, one at a time.
        </p>
      </header>

      <div class="filters">
        <div class="filter-row" role="group" aria-label="Filter by meal">
          <span class="filter-label">Meal</span>
          {#each MEALS as option (option)}
            <button
              type="button"
              class="chip"
              class:selected={meal === option}
              aria-pressed={meal === option}
              onclick={() => (meal = toggle(meal, option))}
            >
              {option}
            </button>
          {/each}
        </div>

        {#if cuisines.length > 0}
          <div class="filter-row" role="group" aria-label="Filter by cuisine">
            <span class="filter-label">Cuisine</span>
            {#each cuisines as option (option)}
              <button
                type="button"
                class="chip"
                class:selected={cuisine === option}
                aria-pressed={cuisine === option}
                onclick={() => (cuisine = toggle(cuisine, option))}
              >
                {option}
              </button>
            {/each}
          </div>
        {/if}

        {#if hasFilters}
          <button
            type="button"
            class="clear"
            onclick={() => {
              cuisine = null;
              meal = null;
            }}
          >
            Clear filters
          </button>
        {/if}
      </div>

      {#if loading}
        <p class="status">Loading recipes…</p>
      {:else if loadError}
        <p class="status error">{loadError.message}</p>
      {:else if recipes.length > 0}
        <p class="count">
          {recipes.length}
          {recipes.length === 1 ? "recipe" : "recipes"}
        </p>

        <div class="recipe-grid">
          {#each recipes as recipe (recipe.id)}
            <RecipeCard {...recipe} />
          {/each}
        </div>
      {:else if hasFilters}
        <p class="status">
          No recipes match those filters. Try clearing one.
        </p>
      {:else}
        <p class="status">No recipes are available yet. Check back soon.</p>
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

  .recipes-page {
    max-width: 1100px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 1.5rem;
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
  }

  .intro {
    margin: 0;
    max-width: 640px;
    line-height: 1.5;
    color: var(--text-muted);
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--panel-color);
    border-radius: 16px;
  }

  .filter-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
  }

  .filter-label {
    min-width: 4.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .chip {
    border: 1px solid color-mix(in srgb, var(--text-color) 20%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--page-color) 88%, var(--text-color));
    color: var(--text-color);
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
    cursor: pointer;
  }

  .chip:hover {
    border-color: var(--text-color);
  }

  .chip.selected {
    background: #f59e0b;
    border-color: #f59e0b;
    color: #ffffff;
  }

  .clear {
    align-self: flex-start;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-decoration: underline;
    cursor: pointer;
  }

  .count {
    margin: 0 0 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    align-items: stretch;
  }

  .status {
    margin: 0;
    padding: 2rem;
    text-align: center;
    color: var(--text-color);
    background: var(--panel-color);
    border-radius: 16px;
  }

  .error {
    color: #ef4444;
  }
</style>
