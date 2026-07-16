<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase/client.js";
  import "$lib/styles/auth-pages.css";

  let firstName = $state("");
  let username = $state("");
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
      options: {
        data: {
          first_name: firstName,
          username: username.trim() || null,
        },
      },
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

<div class="page-shell">
  <Header />

  <main class="page-main">
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
          Leaderboard name
          <input
            type="text"
            bind:value={username}
            maxlength="30"
            autocomplete="nickname"
            placeholder="Optional — shown on the leaderboard"
          />
        </label>

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
  </main>

  <Footer />
</div>
