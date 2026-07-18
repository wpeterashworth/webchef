<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase/client.js";
  import "$lib/styles/auth-pages.css";

  let email = $state("");
  let password = $state("");
  let errorMessage = $state("");
  let loading = $state(false);

  /** @param {SubmitEvent} event */
  async function handleLogin(event) {
    event.preventDefault();
    errorMessage = "";
    loading = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    loading = false;

    if (error) {
      errorMessage = error.message;
      return;
    }

    // Signed in — the auth store updates via onAuthStateChange. Go home.
    goto("/");
  }
</script>

<svelte:head>
  <title>Log In · WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-main">
    <div class="auth-page">
      <form class="auth-card" on:submit={handleLogin}>
        <h1>Log In</h1>

        {#if errorMessage}
          <p class="error" role="alert">{errorMessage}</p>
        {/if}

        <label>
          Email
          <input
            type="email"
            bind:value={email}
            required
            autocomplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            bind:value={password}
            required
            autocomplete="current-password"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log In"}
        </button>

        <p class="switch">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  </main>

  <Footer />
</div>
