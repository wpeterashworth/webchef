<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { profile, profileReady } from "$lib/stores/profile.js";
  import {
    canCreateLessons,
    canShareLessonsPublicly,
  } from "$lib/javascript/points.js";
  import {
    buildLessonContent,
    createUserLesson,
    emptyQuestion,
    getMyUserLessons,
    setUserLessonVisibility,
    updateUserLesson,
  } from "$lib/javascript/user-lessons.js";
  import "$lib/styles/auth-pages.css";

  let title = $state("");
  let description = $state("");
  let skillName = $state("");
  let introHeadline = $state("");
  let introBody = $state("");
  let questions = $state([emptyQuestion()]);
  let isPublic = $state(false);
  let editingSlug = $state(/** @type {string | null} */ (null));

  let saving = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");

  const canCreate = $derived(
    $profileReady && $profile ? canCreateLessons($profile.level_number) : false,
  );
  const canShare = $derived(
    $profileReady && $profile
      ? canShareLessonsPublicly($profile.level_number)
      : false,
  );

  onMount(async () => {
    const slug = $page.url.searchParams.get("slug");
    if (!slug) return;

    try {
      const rows = await getMyUserLessons();
      const existing = rows.find((row) => row.slug === slug);
      if (!existing) {
        errorMessage = "That lesson was not found in your library.";
        return;
      }

      editingSlug = slug;
      title = existing.title;
      description = existing.description ?? "";
      isPublic = existing.is_public;

      const section = existing.content?.sections?.[0];
      if (!section) return;

      skillName = section.skill ?? section.title ?? "";
      introHeadline = section.intro?.headline ?? "";
      introBody = section.intro?.body ?? "";
      questions = (section.questions ?? [emptyQuestion()]).map((question) => ({
        question: question.question ?? "",
        options: [...(question.options ?? ["", ""])],
        correctIndex: question.correct_index ?? 0,
        explanation: question.explanation ?? "",
        safetyTip: question.safety_tip ?? "",
      }));
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "Could not load your lesson.";
    }
  });

  function addQuestion() {
    questions = [...questions, emptyQuestion()];
  }

  /** @param {number} index */
  function removeQuestion(index) {
    if (questions.length <= 1) return;
    questions = questions.filter((_, i) => i !== index);
  }

  /** @param {number} questionIndex */
  function addOption(questionIndex) {
    questions = questions.map((entry, index) =>
      index === questionIndex
        ? { ...entry, options: [...entry.options, ""] }
        : entry,
    );
  }

  /** @param {number} questionIndex */
  function removeOption(questionIndex) {
    questions = questions.map((entry, index) => {
      if (index !== questionIndex || entry.options.length <= 2) return entry;

      const options = entry.options.slice(0, -1);
      let correctIndex = entry.correctIndex;
      if (correctIndex >= options.length) {
        correctIndex = options.length - 1;
      }

      return { ...entry, options, correctIndex };
    });
  }

  /** @param {SubmitEvent} event */
  async function handleSubmit(event) {
    event.preventDefault();
    errorMessage = "";
    successMessage = "";
    saving = true;

    try {
      const content = buildLessonContent({
        skillName,
        introHeadline,
        introBody,
        questions,
      });

      if (editingSlug) {
        await updateUserLesson(editingSlug, title, description, content);
        await setUserLessonVisibility(editingSlug, isPublic);
        successMessage = "Lesson updated.";
      } else {
        const created = await createUserLesson(title, description, content);
        if (isPublic && canShare) {
          await setUserLessonVisibility(created.slug, true);
        }
        goto(`/lesson/${created.slug}`);
        return;
      }
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "Could not save your lesson.";
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>{editingSlug ? "Edit Lesson" : "Create Lesson"} | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-main create-main">
    <AuthGuard>
      <section class="create-page">
        <header>
          <p class="eyebrow">Lesson builder</p>
          <h1>
            {editingSlug ? "Edit your lesson" : "Create a personal lesson"}
          </h1>
        </header>

        {#if !canCreate}
          <p class="locked">
            Reach level 1 (10 XP) to create personal lessons. Complete a
            beginner lesson to unlock this feature.
          </p>
        {:else}
          <form class="create-form" onsubmit={handleSubmit}>
            {#if errorMessage}
              <p class="error" role="alert">{errorMessage}</p>
            {/if}
            {#if successMessage}
              <p class="info" role="status">{successMessage}</p>
            {/if}

            <label>
              Lesson title
              <input type="text" bind:value={title} required maxlength="80" />
            </label>

            <label>
              Short description
              <textarea bind:value={description} rows="2" maxlength="240"
              ></textarea>
            </label>

            <label>
              Skill name
              <input
                type="text"
                bind:value={skillName}
                required
                maxlength="60"
              />
            </label>

            <label>
              Intro headline
              <input
                type="text"
                bind:value={introHeadline}
                required
                maxlength="100"
              />
            </label>

            <label>
              Intro body
              <textarea bind:value={introBody} required rows="3" maxlength="500"
              ></textarea>
            </label>

            <div class="questions-block">
              <h2>Quiz questions</h2>

              {#each questions as question, index (index)}
                <fieldset class="question-card">
                  <legend>Question {index + 1}</legend>

                  <label>
                    Prompt
                    <textarea bind:value={question.question} required rows="2"
                    ></textarea>
                  </label>

                  <div class="option-controls">
                    <span class="option-controls-label">Answer options</span>
                    <div class="option-stepper">
                      <button
                        type="button"
                        class="stepper-btn"
                        disabled={question.options.length <= 2}
                        aria-label="Remove an option"
                        onclick={() => removeOption(index)}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        class="stepper-btn"
                        aria-label="Add an option"
                        onclick={() => addOption(index)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {#each question.options as _, optionIndex (optionIndex)}
                    <label>
                      Option {optionIndex + 1}
                      <input
                        type="text"
                        bind:value={question.options[optionIndex]}
                        required
                      />
                    </label>
                  {/each}

                  <label>
                    Correct option
                    <select bind:value={question.correctIndex}>
                      {#each question.options as option, optionIndex (optionIndex)}
                        <option value={optionIndex}
                          >Option {optionIndex + 1}</option
                        >
                      {/each}
                    </select>
                  </label>

                  <label>
                    Explanation
                    <textarea bind:value={question.explanation} rows="2"
                    ></textarea>
                  </label>

                  <label>
                    Safety tip
                    <input type="text" bind:value={question.safetyTip} />
                  </label>

                  {#if questions.length > 1}
                    <button
                      type="button"
                      class="secondary"
                      onclick={() => removeQuestion(index)}
                    >
                      Remove question
                    </button>
                  {/if}
                </fieldset>
              {/each}

              <button type="button" class="secondary" onclick={addQuestion}>
                Add another question
              </button>
            </div>

            <label class="share-row">
              <input
                type="checkbox"
                bind:checked={isPublic}
                disabled={!canShare}
              />
              Share publicly on the main Lessons page
              {#if !canShare}
                <span class="hint">(unlocks at level 20)</span>
              {/if}
            </label>

            <button type="submit" disabled={saving}>
              {saving
                ? "Saving…"
                : editingSlug
                  ? "Save changes"
                  : "Create lesson"}
            </button>
          </form>
        {/if}
      </section>
    </AuthGuard>
  </main>

  <Footer />
</div>

<style>
  .create-main {
    align-items: flex-start;
    padding-top: 2rem;
    padding-bottom: 3rem;
  }

  .create-page {
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
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

  h1 {
    margin: 0 0 1.25rem;
  }

  .create-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 16px;
    background: var(--panel-color);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-weight: 600;
  }

  input,
  textarea,
  select {
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--input-border);
    border-radius: 6px;
    font-size: 1rem;
    background-color: var(--input-bg);
    color: var(--input-text);
    font-family: inherit;
  }

  .questions-block h2 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  .question-card {
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    border-radius: 12px;
    padding: 1rem;
    margin: 0 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .question-card legend {
    font-weight: 700;
    padding: 0 0.25rem;
  }

  .option-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .option-controls-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .option-stepper {
    display: flex;
    gap: 0.35rem;
  }

  .stepper-btn {
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 1px solid var(--text-muted);
    border-radius: 6px;
    background: var(--input-bg);
    color: var(--input-text);
    font-size: 1.25rem;
    line-height: 1;
    font-weight: 700;
    cursor: pointer;
  }

  .stepper-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    color: var(--text-muted);
    background: color-mix(
      in srgb,
      var(--panel-color) 80%,
      var(--text-muted) 20%
    );
  }

  button[type="submit"] {
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    background: #12b7ea;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
  }

  button.secondary {
    align-self: flex-start;
    padding: 0.5rem 0.85rem;
    border: 1px solid var(--text-muted);
    border-radius: 8px;
    background: transparent;
    color: var(--text-color);
    cursor: pointer;
  }

  .share-row {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .share-row input {
    width: auto;
  }

  .hint {
    color: var(--text-muted);
    font-weight: 500;
    font-size: 0.85rem;
  }

  .locked {
    color: var(--text-muted);
    line-height: 1.5;
  }

  .error {
    margin: 0;
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    background-color: rgba(220, 53, 69, 0.15);
    color: #b00020;
  }

  .info {
    margin: 0;
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    background-color: rgba(40, 167, 69, 0.15);
    color: #1b6b32;
  }
</style>
