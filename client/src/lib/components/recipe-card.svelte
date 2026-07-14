<script>
  import { formatMinutes } from "$lib/javascript/recipes.js";

  let {
    id = "",
    title = "Recipe",
    description = "",
    image_url = null,
    ready_in_minutes = null,
    servings = null,
  } = $props();

  const time = $derived(formatMinutes(ready_in_minutes));
</script>

<article class="card">
  <a class="card-link" href={`/recipes/${id}`}>
    {#if image_url}
      <img class="photo" src={image_url} alt="" loading="lazy" />
    {:else}
      <div class="photo photo-fallback" aria-hidden="true">🍳</div>
    {/if}

    <div class="card-body">
      <h2>{title}</h2>

      {#if description}
        <p class="description">{description}</p>
      {/if}

      <div class="meta">
        {#if time}<span>⏱ {time}</span>{/if}
        {#if servings}<span>🍽 Serves {servings}</span>{/if}
      </div>
    </div>
  </a>
</article>

<style>
  .card {
    border: 4px solid var(--accent-color, #f59e0b);
    border-radius: 24px;
    background: var(--panel-color);
    overflow: hidden;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
    transition: transform 0.2s ease;
  }

  .card:hover {
    transform: translateY(-3px);
  }

  .card-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: var(--text-color);
    text-decoration: none;
  }

  .photo {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .photo-fallback {
    display: grid;
    place-items: center;
    font-size: 3rem;
    background: color-mix(in srgb, var(--page-color) 88%, var(--text-color));
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    flex: 1;
  }

  h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }

  .description {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--text-muted);
    flex: 1;

    /* Keep every card the same height regardless of summary length. */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
  }
</style>
