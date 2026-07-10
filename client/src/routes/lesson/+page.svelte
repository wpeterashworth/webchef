<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import LessonCard from "$lib/components/lesson-card.svelte";
  import recipeAdjust from "$lib/JSON/RecipeAdjust.json";
  import howToCook from "$lib/JSON/Howtocook.json";
  import ingredientSub from "$lib/JSON/IngredientSub.json";

  const allLessons = [...recipeAdjust, ...howToCook, ...ingredientSub];

  const cards = allLessons.map((lesson, index) => ({
    title: lesson.title,
    description: lesson.intro.body,
    questionCount: lesson.questions.length,
    difficulty: lesson.category,
    borderColor: ["#22c55e", "#facc15", "#ef4444", "#3b82f6"][index % 4],
    href: `/lesson/${lesson.lessonId}`
  }));
</script>

<Header />

<main class="lesson-grid">
  {#each cards as lesson}
    <LessonCard {...lesson} />
  {/each}
</main>

<Footer />

<style>
  .lesson-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
    padding: 2rem;
    align-items: start;
  }
</style>