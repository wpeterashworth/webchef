
<script>
  export let title = "Lesson Name";
  export let description = "";
  export let questionCount = 0;
  export let difficulty = "Beginner";
  export let borderColor = "#22c55e";
  export let href = "#";
</script>

<article class="card" style={`--border-color: ${borderColor}`}>
  <div class="topline">
    <span class="label">{difficulty}</span>
    <span class="count">{questionCount} Questions</span>
  </div>

  <h2>{title}</h2>

  <p class="description">{description}</p>

  <a class="button" href={href}>Start Lesson</a>
</article>

<style>
  .card {
    border: 4px solid var(--border-color);
    border-radius: 24px;
    background: #ececec;
    padding: 1rem;
    min-height: 190px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  }

  .topline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #666;
  }

  h2 {
    margin: 0;
    font-size: 1rem;
    color: #222;
  }

  .description {
    margin: 0;
    font-size: 0.85rem;
    color: #666;
    flex: 1;
  }

  .button {
    align-self: flex-end;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    background: #12b7ea;
    color: white;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 600;
  }
</style>