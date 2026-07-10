<script>
  import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase/client.js";

  let email = $state("");
  let password = $state("");
  let errorMessage = $state("");
  let loading = $state(false);

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

<div class="auth-page">
  <form class="auth-card" on:submit={handleLogin}>
    <h1>Log In</h1>

    {#if errorMessage}
      <p class="error" role="alert">{errorMessage}</p>
    {/if}

    <label>
      Email
      <input type="email" bind:value={email} required autocomplete="email" />
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

<style>
  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    padding: 2rem 1rem;
  }

  .auth-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 360px;
    padding: 2rem;
    border-radius: 12px;
    background-color: var(--panel-color);
    color: var(--text-color);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  h1 {
    margin: 0 0 0.5rem;
    text-align: center;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-weight: 600;
  }

  input {
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--text-color);
    border-radius: 6px;
    font-size: 1rem;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.7rem;
    border: none;
    border-radius: 6px;
    background-color: var(--accent-color);
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .switch {
    margin: 0;
    text-align: center;
    font-size: 0.9rem;
  }

  .switch a {
    color: var(--text-hover-color);
    font-weight: 600;
  }

  .error {
    margin: 0;
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    background-color: rgba(220, 53, 69, 0.15);
    color: #b00020;
    font-size: 0.9rem;
  }
</style>
