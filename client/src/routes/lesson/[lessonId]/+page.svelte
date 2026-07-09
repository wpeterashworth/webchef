<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";

  // `data` comes from the load function in +page.js.
  let { data } = $props();
  const lesson = data.lesson;
</script>

<Header />

<main class="lesson">
  <a class="back" href="/lesson">← All lessons</a>

  <p class="category">{lesson.category}</p>
  <h1>{lesson.title}</h1>

  <p class="goal">{lesson.learningGoal}</p>
  <p class="meta">
    {lesson.questions.length} questions · about {lesson.estimatedMinutes} min
  </p>

  <section class="intro">
    <h2>{lesson.intro.headline}</h2>
    <p>{lesson.intro.body}</p>
  </section>

  <section class="questions">
    {#each lesson.questions as question, i}
      <article class="question">
        <h3>{i + 1}. {question.question}</h3>

        <ul class="options">
          {#each question.options as option, index}
            <li class:correct={index === question.correct_index}>{option}</li>
          {/each}
        </ul>

        <details>
          <summary>Show answer</summary>
          <p class="answer"><strong>Answer:</strong> {question.correct_answer}</p>
          <p><strong>Why:</strong> {question.explanation}</p>
          <p class="tip"><strong>Safety tip:</strong> {question.safety_tip}</p>
        </details>
      </article>
    {/each}
  </section>

  <section class="recap">
    <h2>Recap</h2>
    <ul>
      {#each lesson.recap as point}
        <li>{point}</li>
      {/each}
    </ul>
  </section>
</main>

<Footer />

<style>
  .lesson {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .back {
    display: inline-block;
    margin-bottom: 1rem;
    color: #12b7ea;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .category {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.75rem;
    color: #888;
  }

  h1 {
    margin: 0.25rem 0 0.5rem;
    color: #222;
  }

  .goal {
    margin: 0;
    color: #444;
  }

  .meta {
    margin: 0.25rem 0 1.5rem;
    color: #888;
    font-size: 0.85rem;
  }

  .intro {
    background: #f4f4f4;
    border-radius: 16px;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .intro h2 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
    color: #222;
  }

  .intro p {
    margin: 0;
    color: #555;
  }

  .question {
    border: 1px solid #e2e2e2;
    border-radius: 16px;
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
  }

  .question h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: #222;
  }

  .options {
    list-style: none;
    padding: 0;
    margin: 0 0 0.75rem;
    display: grid;
    gap: 0.4rem;
  }

  .options li {
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    background: #f4f4f4;
    font-size: 0.9rem;
    color: #333;
  }

  .options li.correct {
    background: #dcfce7;
    color: #166534;
    font-weight: 600;
  }

  details summary {
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    color: #12b7ea;
  }

  details p {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    color: #444;
  }

  .tip {
    color: #92400e;
  }

  .recap {
    margin-top: 2rem;
  }

  .recap h2 {
    color: #222;
  }

  .recap ul {
    color: #555;
    line-height: 1.6;
  }
</style>
