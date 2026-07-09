<script>
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase/client.js";

  let firstName = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let errorMessage = $state("");
  let infoMessage = $state("");
  let loading = $state(false);

  async function handleSignup(event) {
    event.preventDefault();
    errorMessage = "";
    infoMessage = "";

    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match.";
      return;
    }

    loading = true;
    // Stash the first name in Supabase Auth user metadata (options.data). It
    // rides along with the account — no separate table needed — and is later
    // read from user.user_metadata.first_name in the header.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName } },
    });
    loading = false;

    if (error) {
      errorMessage = error.message;
      return;
    }

    // If the project requires email confirmation there's no session yet.
    if (data.session) {
      goto("/");
    } else {
      infoMessage =
        "Account created! Check your email to confirm your address, then log in.";
    }
  }
</script>

<svelte:head>
  <title>Sign Up · WebChef</title>
</svelte:head>

<div class="auth-page">
  <form class="auth-card" on:submit={handleSignup}>
    <h1>Sign Up</h1>

    {#if errorMessage}
      <p class="error" role="alert">{errorMessage}</p>
    {/if}
    {#if infoMessage}
      <p class="info" role="status">{infoMessage}</p>
    {/if}

    <label>
      First name
      <input
        type="text"
        bind:value={firstName}
        required
        autocomplete="given-name"
      />
    </label>

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
        minlength="6"
        autocomplete="new-password"
      />
    </label>

    <label>
      Confirm Password
      <input
        type="password"
        bind:value={confirmPassword}
        required
        minlength="6"
        autocomplete="new-password"
      />
    </label>

    <button type="submit" disabled={loading}>
      {loading ? "Creating account…" : "Sign Up"}
    </button>

    <p class="switch">
      Already have an account? <a href="/login">Log in</a>
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
    background-color: var(--page-color);
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

  .info {
    margin: 0;
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    background-color: rgba(40, 167, 69, 0.15);
    color: #1b6b32;
    font-size: 0.9rem;
  }
</style>
