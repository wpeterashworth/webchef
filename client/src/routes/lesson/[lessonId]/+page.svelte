<script>
  import { afterNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { applyDifficulty, normalizeDifficulty } from "$lib/javascript/lessons.js";
  import { COMPLETED } from "$lib/javascript/progress.js";
  import { progress, markStarted, setStatus } from "$lib/stores/progress.js";

  let { data } = $props();

  // Progress is saved best-effort: a failed write must not block the learner
  // mid-quiz, but it shouldn't fail silently either.
  let progressError = $state(null);

  const savedStatus = $derived($progress[data.lesson.id]?.status);

  let difficulty = $state("beginner");

  function syncDifficulty() {
    if (!browser) return;
    difficulty = normalizeDifficulty(
      new URL(window.location.href).searchParams.get("difficulty"),
    );
  }

  onMount(syncDifficulty);
  afterNavigate(syncDifficulty);

  const lesson = $derived(applyDifficulty(data.lesson, difficulty));

  /** @type {'intro' | 'quiz' | 'section-done' | 'complete'} */
  let phase = $state("intro");
  let sectionIndex = $state(0);
  let questionIndex = $state(0);
  let selectedOption = $state(null);
  let answered = $state(false);

  const currentSection = $derived(lesson.sections[sectionIndex]);
  const currentQuestion = $derived(currentSection?.questions[questionIndex]);

  $effect(() => {
    lesson.difficulty;
    phase = "intro";
    sectionIndex = 0;
    questionIndex = 0;
    selectedOption = null;
    answered = false;
  });

  function correctIndex(question) {
    if (typeof question.correct_index === "number") return question.correct_index;
    return question.options.indexOf(question.correct_answer);
  }

  function isCorrect(question, optionIndex) {
    return optionIndex === correctIndex(question);
  }

  function startQuiz() {
    phase = "quiz";
    questionIndex = 0;
    selectedOption = null;
    answered = false;

    // markStarted() won't downgrade a lesson that's already in progress or
    // completed, so replaying a finished lesson doesn't un-complete it.
    markStarted(data.lesson.id, savedStatus).catch((error) => {
      progressError = error;
    });
  }

  // Picking an option only *stages* it — the learner can change their mind as
  // often as they like. Nothing is revealed until they submit, so a stray click
  // can't burn a question.
  function selectOption(index) {
    if (answered) return;
    selectedOption = index;
  }

  // Committing the answer is what reveals the result. Guarded so an Enter key
  // on the focused button can't submit an empty answer.
  function submitAnswer() {
    if (answered || selectedOption === null) return;
    answered = true;
  }

  function nextStep() {
    if (phase === "quiz") {
      if (questionIndex < currentSection.questions.length - 1) {
        questionIndex += 1;
        selectedOption = null;
        answered = false;
        return;
      }

      phase = "section-done";
      return;
    }

    if (phase === "section-done") {
      if (sectionIndex < lesson.sections.length - 1) {
        sectionIndex += 1;
        questionIndex = 0;
        selectedOption = null;
        answered = false;
        phase = "intro";
        return;
      }

      phase = "complete";

      // The lesson counts as completed once every skill in it is done.
      setStatus(data.lesson.id, COMPLETED).catch((error) => {
        progressError = error;
      });
    }
  }
</script>

<svelte:head>
  <title>{lesson.title} | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="lesson">
    <AuthGuard>
    <a class="back" href="/lesson">← All lessons</a>

    <p class="category">{lesson.category}</p>
    <h1>{lesson.title}</h1>

    <p class="meta">
      {lesson.difficultyLabel} · {lesson.skillCount} skills · {lesson.totalQuestions}
      questions · about {lesson.estimatedMinutes} min
    </p>

    <div class="progress">
      Skill {sectionIndex + 1} of {lesson.skillCount}
      {#if phase === "quiz"}
        · Question {questionIndex + 1} of {currentSection.questions.length}
      {/if}
    </div>

    {#if progressError}
      <p class="save-error">
        Your progress couldn't be saved: {progressError.message}
      </p>
    {/if}

    {#if phase === "intro"}
      <section class="panel intro-panel">
        <p class="skill-label">{currentSection.skill}</p>
        <h2>{currentSection.intro.headline}</h2>
        <p>{currentSection.intro.body}</p>
        <p class="goal">{currentSection.learningGoal}</p>
        <button class="primary" onclick={startQuiz}>Start quiz</button>
      </section>
    {:else if phase === "quiz" && currentQuestion}
      <section class="panel quiz-panel">
        <p class="skill-label">{currentSection.skill}</p>
        <h2>{currentQuestion.question}</h2>

        <ul class="options">
          {#each currentQuestion.options as option, index}
            <li>
              <button
                type="button"
                disabled={answered}
                aria-pressed={selectedOption === index}
                class:selected={selectedOption === index}
                class:correct={answered && isCorrect(currentQuestion, index)}
                class:incorrect={answered &&
                  selectedOption === index &&
                  !isCorrect(currentQuestion, index)}
                onclick={() => selectOption(index)}
              >
                {option}
              </button>
            </li>
          {/each}
        </ul>

        {#if !answered}
          <button
            class="primary"
            disabled={selectedOption === null}
            onclick={submitAnswer}
          >
            Submit answer
          </button>

          {#if selectedOption === null}
            <p class="hint">Pick an answer, then submit.</p>
          {/if}
        {:else}
          <div class="feedback" class:success={isCorrect(currentQuestion, selectedOption)}>
            <p>
              <strong>
                {isCorrect(currentQuestion, selectedOption) ? "Correct!" : "Not quite."}
              </strong>
              {currentQuestion.explanation}
            </p>
            <p class="tip"><strong>Safety tip:</strong> {currentQuestion.safety_tip}</p>
          </div>

          <button class="primary" onclick={nextStep}>
            {questionIndex < currentSection.questions.length - 1
              ? "Next question"
              : "Finish skill"}
          </button>
        {/if}
      </section>
    {:else if phase === "section-done"}
      <section class="panel recap-panel">
        <p class="skill-label">{currentSection.skill}</p>
        <h2>Skill complete</h2>
        <ul>
          {#each currentSection.recap as point}
            <li>{point}</li>
          {/each}
        </ul>

        <button class="primary" onclick={nextStep}>
          {sectionIndex < lesson.sections.length - 1 ? "Next skill" : "Finish lesson"}
        </button>
      </section>
    {:else}
      <section class="panel complete-panel">
        <h2>Lesson complete</h2>
        <p>
          You finished all {lesson.skillCount} skills in {lesson.title} at
          {lesson.difficultyLabel.toLowerCase()} level. Nice work!
        </p>
        <a class="primary link-button" href="/lesson">Back to lessons</a>
      </section>
    {/if}
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

  .lesson {
    flex: 1;
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    width: 100%;
    color: var(--text-color);
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
    color: var(--text-muted);
    font-weight: 700;
  }

  h1 {
    margin: 0.25rem 0 0.5rem;
    color: var(--text-color);
  }

  .meta,
  .progress {
    margin: 0 0 1rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .progress {
    font-weight: 600;
  }

  .panel {
    background: var(--panel-color);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    color: var(--text-color);
  }

  .skill-label {
    margin: 0 0 0.35rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .panel h2 {
    margin: 0 0 0.75rem;
    font-size: 1.15rem;
    color: var(--text-color);
  }

  .panel p {
    margin: 0 0 0.75rem;
    line-height: 1.5;
    color: var(--text-color);
  }

  .goal {
    color: var(--text-muted);
  }

  .options {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
    display: grid;
    gap: 0.5rem;
  }

  .options button {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--text-color) 18%, transparent);
    background: color-mix(in srgb, var(--page-color) 90%, var(--text-color));
    color: var(--text-color);
    font: inherit;
    cursor: pointer;
  }

  .options button:hover:not(:disabled) {
    border-color: #12b7ea;
  }

  .options button.selected {
    border-color: #12b7ea;
    font-weight: 600;
  }

  .options button.correct {
    background: #dcfce7;
    border-color: #16a34a;
    color: #166534;
  }

  .options button.incorrect {
    background: #fee2e2;
    border-color: #dc2626;
    color: #991b1b;
  }

  .feedback {
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: color-mix(in srgb, var(--text-color) 8%, var(--panel-color));
    color: var(--text-color);
  }

  .feedback.success {
    background: color-mix(in srgb, #16a34a 18%, var(--panel-color));
    color: var(--text-color);
  }

  .tip {
    color: var(--text-muted);
    margin-top: 0.5rem;
  }

  .recap-panel ul {
    margin: 0 0 1.25rem;
    padding-left: 1.25rem;
    line-height: 1.6;
    color: var(--text-color);
  }

  .primary {
    border: none;
    border-radius: 999px;
    background: #12b7ea;
    color: white;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }

  /* Submit stays visible but inert until an option is picked, so the learner can
     see what the next step is before they've chosen one. */
  .primary:disabled {
    background: color-mix(in srgb, #12b7ea 35%, var(--panel-color));
    cursor: not-allowed;
  }

  .options button:disabled {
    cursor: default;
  }

  .hint {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .save-error {
    margin: 0 0 1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    background: #fee2e2;
    color: #991b1b;
    font-size: 0.85rem;
  }

  .link-button {
    margin-top: 0.5rem;
  }
</style>
