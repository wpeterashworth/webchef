<script>
  import { page } from "$app/state";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import { getRecipeById, formatMinutes } from "$lib/javascript/recipes.js";

  /**
   * @typedef {object} RecipeIngredient
   * @property {string=} original
   * @property {string=} name
   */

  /**
   * @typedef {object} Recipe
   * @property {string} id
   * @property {string} title
   * @property {string | null=} description
   * @property {string | null=} image_url
   * @property {number | null=} ready_in_minutes
   * @property {number | null=} servings
   * @property {string | null=} source_url
   * @property {RecipeIngredient[]=} ingredients
   * @property {string[]=} instructions
   */

  // Held as state rather than awaited in the markup, because <svelte:head> has
  // to sit at the top level of the component — it can't live inside an
  // {#await} or {#if} block, and the page title depends on the loaded recipe.
  let recipe = $state(/** @type {Recipe | null} */ (null));
  let loadError = $state(/** @type {Error | null} */ (null));
  let loading = $state(true);

  const recipeId = page.params.recipeId;

  if (!recipeId) {
    loadError = new Error("Recipe id is missing from the URL.");
    loading = false;
  } else {
    getRecipeById(recipeId)
      .then((result) => {
        recipe = /** @type {Recipe | null} */ (result);
      })
      .catch((error) => {
        loadError =
          error instanceof Error ? error : new Error("Could not load recipe.");
      })
      .finally(() => (loading = false));
  }
</script>

<svelte:head>
  <title>{recipe ? `${recipe.title} | WebChef` : "Recipe | WebChef"}</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    {#if loading}
      <p class="status">Loading recipe…</p>
    {:else if loadError}
      <p class="status error">{loadError.message}</p>
    {:else if recipe}
      <article class="recipe">
        <a class="back" href="/recipes">← All recipes</a>

        <header class="recipe-header">
          <h1>{recipe.title}</h1>

          <div class="meta">
            {#if recipe.ready_in_minutes}
              <span>⏱ {formatMinutes(recipe.ready_in_minutes)}</span>
            {/if}
            {#if recipe.servings}<span>🍽 Serves {recipe.servings}</span>{/if}
            {#if recipe.ingredients?.length}
              <span>🧺 {recipe.ingredients.length} ingredients</span>
            {/if}
            {#if recipe.source_url}
              <a
                class="source-link"
                href={recipe.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 Original source
              </a>
            {/if}
          </div>

          {#if recipe.description}
            <p class="description">{recipe.description}</p>
          {/if}
        </header>

        {#if recipe.image_url}
          <img class="photo" src={recipe.image_url} alt={recipe.title} />
        {/if}

        <div class="columns">
          <section class="ingredients">
            <h2>Ingredients</h2>
            <ul>
              {#each recipe.ingredients ?? [] as ingredient, i (i)}
                <li>{ingredient.original ?? ingredient.name}</li>
              {/each}
            </ul>
          </section>

          <section class="instructions">
            <h2>Instructions</h2>
            <div class="instructions-box">
              <ol>
                {#each recipe.instructions ?? [] as step, i (i)}
                  <li>{step}</li>
                {/each}
              </ol>
            </div>
          </section>
        </div>
      </article>
    {:else}
      <p class="status">
        That recipe doesn't exist. <a href="/recipes">Back to the library</a>
      </p>
    {/if}
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
    color: var(--text-color);
  }

  .recipe {
    max-width: 900px;
    margin: 0 auto;
  }

  .back {
    display: inline-block;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
    text-decoration: none;
  }

  .recipe-header h1 {
    margin: 0 0 0.6rem;
    font-size: 2rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .description {
    margin: 0.8rem 0 0;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .photo {
    width: 100%;
    max-height: 380px;
    object-fit: cover;
    border-radius: 20px;
    margin: 1.5rem 0;
  }

  .columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 1.5rem;
  }

  @media (min-width: 768px) {
    .columns {
      grid-template-columns: 1fr 2fr;
    }
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: 1.1rem;
  }

  .ingredients {
    background: var(--panel-color);
    border-radius: 16px;
    padding: 1.25rem;
    align-self: start;
  }

  .ingredients ul {
    margin: 0;
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  /* Pinned to the top of its grid cell, same as the ingredients panel, so a
     short recipe doesn't stretch the column and leave a gap beside ingredients. */
  .instructions {
    align-self: start;
  }

  /* The scrollable "textbox". Capped height means long recipes scroll inside
     this box instead of pushing the page down and leaving whitespace under the
     ingredients list. */
  .instructions-box {
    max-height: 60vh;
    overflow-y: auto;
    background: var(--panel-color);
    border-radius: 16px;
    padding: 1.25rem;
  }

  .instructions-box ol {
    margin: 0;
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    line-height: 1.6;
  }

  .instructions-box li {
    padding-left: 0.3rem;
  }

  /* Sits inline in the .meta row; inherits its size/weight, but stays underlined
     so it still reads as a link next to the plain stat spans. */
  .source-link {
    color: inherit;
    text-decoration: underline;
  }

  .source-link:hover {
    color: var(--text-color);
  }

  .status {
    margin: 0;
    padding: 2rem;
    text-align: center;
    background: var(--panel-color);
    border-radius: 16px;
  }

  .error {
    color: #ef4444;
  }
</style>
