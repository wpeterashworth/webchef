<script>
  import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
</script>

<svelte:head>
  <title>Dashboard | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <section class="dashboard">
      <header class="hero">
        <div>
          <p class="eyebrow">Your learning hub</p>
          <h1>Dashboard</h1>
          <p class="hero-copy">
            Keep track of your lesson progress, upcoming recipes, and completed
            cooking challenges in one place.
          </p>
        </div>
        <div class="hero-pill">🔥 7 day streak</div>
      </header>

  <div class="summary-grid">
    <article class="summary-card">
      <h2>Started</h2>
      <p>3 lessons</p>
    </article>
    <article class="summary-card">
      <h2>Planned</h2>
      <p>2 recipes</p>
    </article>
    <article class="summary-card">
      <h2>Completed</h2>
      <p>8 lessons</p>
    </article>
  </div>

  <section id="started-lessons" class="container">
    <div class="section-title">
      <h2>Started Lessons</h2>
      <span>In progress</span>
    </div>

    <div class="card-box">
      <div class="card">
        <h3>Lesson 1: How to make a penguin</h3>
        <p>Started on: 1/1/2023</p>
      </div>

      <div class="card">
        <h3>Lesson 2: How to make a penguin</h3>
        <p>Started on: 1/1/2023</p>
      </div>

      <div class="card">
        <h3>Lesson 3: How to make a penguin</h3>
        <p>Started on: 1/1/2023</p>
      </div>
    </div>
  </section>

  <section id="planned-lessons" class="container">
    <div class="section-title">
      <h2>Planned Lessons</h2>
      <span>Coming up</span>
    </div>

    <div class="card-box">
      <div class="card">
        <h3>Lesson 1: How to make a penguin</h3>
        <p>Planned for: 1/1/2023</p>
      </div>

      <div class="card">
        <h3>Lesson 2: How to make a penguin</h3>
        <p>Planned for: 1/1/2023</p>
      </div>

      <div class="card">
        <h3>Lesson 3: How to make a penguin</h3>
        <p>Planned for: 1/1/2023</p>
      </div>
    </div>
  </section>

  <section id="completed-lessons" class="container">
    <div class="section-title">
      <h2>Completed Lessons</h2>
      <span>Nice work</span>
    </div>

    <div class="card-box">
      <div class="card">
        <h3>Lesson 1: How to make a penguin</h3>
        <p>Completed on: 1/1/2023</p>
      </div>

      <div class="card">
        <h3>Lesson 2: How to make a penguin</h3>
        <p>Completed on: 1/1/2023</p>
      </div>

      <div class="card">
        <h3>Lesson 3: How to make a penguin</h3>
        <p>Completed on: 1/1/2023</p>
      </div>
    </div>
  </section>
</section>
  </main>

  <Footer />
</div>

<style>
  .dashboard {
    padding: 2rem;
    max-width: 980px;
    margin: 0 auto;
  }

  .hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    /* background: linear-gradient(135deg, #fff3c4, #ffe082); */
    background: var(--accent-color);
    border-radius: 20px;
    color: var(--text-color);
    padding: 1.5rem 1.75rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

    & .eyebrow {
      margin: 0 0 0.4rem;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    & h1 {
      margin: 0 0 0.4rem;
      font-size: 2rem;
    }

    & .hero-copy {
      margin: 0;
      max-width: 620px;
    }

    & .hero-pill {
      background: var(--panel-color);

      font-weight: 700;
      padding: 0.7rem 1rem;
      border-radius: 999px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 700px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .summary-card {
    padding: 1rem 1.2rem;
    background: var(--panel-color);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

    & h2 {
      margin: 0 0 0.3rem;
      font-size: 1rem;
    }

    & p {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
    }
  }

  .page-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .container {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    background: var(--panel-color);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

    & .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      & h2 {
        margin: 0;
        font-size: 1.2rem;
      }

      & span {
        font-size: 0.9rem;
        color: #777;
      }
    }

    & .card-box {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      & .card {
        color: var(--text-color);
        background: var(--page-color);
        padding: 1rem 1.1rem;
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 12px;

        & h3 {
          margin: 0 0 0.35rem;
          font-size: 1rem;
        }

        & p {
          margin: 0;
        }
      }
      @media (min-width: 700px) {
        flex-direction: row;
      }
    }
  }
</style>
