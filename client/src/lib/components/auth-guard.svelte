<script>
  // Wraps content that only signed-in users may see. Renders its children when
  // a session exists, and sends everyone else to /login.
  //
  // Scope, honestly stated: this is a *client-side* gate. The app is a static
  // SPA, so the page's JavaScript — including the bundled lesson JSON — is
  // downloadable by anyone regardless of what this component renders. It
  // enforces the product rule ("lessons are for members"), not security. Data
  // that must actually be protected has to live behind RLS in Supabase, the way
  // `users` and `user_progress` already are.
  import { goto } from "$app/navigation";
  import { user, authReady } from "$lib/stores/auth.js";

  let { children } = $props();

  // Wait for `authReady` before deciding. On a fresh page load the session is
  // restored asynchronously, so `$user` is briefly null even for a signed-in
  // user — redirecting on that would bounce members straight out of their own
  // lessons on every refresh.
  $effect(() => {
    if ($authReady && !$user) {
      // replaceState so the back button doesn't land them right back here.
      goto("/login", { replaceState: true });
    }
  });
</script>

{#if !$authReady}
  <p class="status">Checking your session…</p>
{:else if $user}
  {@render children()}
{:else}
  <p class="status">Please log in to continue. Redirecting…</p>
{/if}

<style>
  .status {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    color: var(--text-color);
    background: var(--panel-color);
    border-radius: 16px;
  }
</style>
