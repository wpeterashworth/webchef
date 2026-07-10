<script>
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabase/client.js";
  import { user, authReady, logout } from "$lib/stores/auth.js";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import ConfirmModal from "$lib/components/confirm-modal.svelte";

  // --- Route guard -----------------------------------------------------------
  // This page is only for signed-in users. Once we've checked for a session
  // ($authReady) and there's nobody logged in, bounce to the login page.
  $effect(() => {
    if ($authReady && !$user) {
      goto("/login");
    }
  });

  // --- Change password -------------------------------------------------------
  let currentPassword = $state("");
  let newPassword = $state("");
  let confirmNewPassword = $state("");
  let pwError = $state("");
  let pwInfo = $state("");
  let pwLoading = $state(false);

  async function handleChangePassword(event) {
    event.preventDefault();
    pwError = "";
    pwInfo = "";

    if (newPassword !== confirmNewPassword) {
      pwError = "New passwords do not match.";
      return;
    }

    pwLoading = true;

    // Supabase has no "verify my password" endpoint, so we re-sign-in with the
    // current password. If it fails, the current password was wrong.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: $user.email,
      password: currentPassword,
    });

    if (signInError) {
      pwLoading = false;
      pwError = "Your current password is incorrect.";
      return;
    }

    // Current password checked out — set the new one.
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    pwLoading = false;

    if (updateError) {
      pwError = updateError.message;
      return;
    }

    pwInfo = "Your password has been changed.";
    currentPassword = "";
    newPassword = "";
    confirmNewPassword = "";
  }

  // --- Delete account --------------------------------------------------------
  let deletePassword = $state("");
  let deleteError = $state("");
  let deleteLoading = $state(false);
  let showDeleteModal = $state(false);

  // Step 1: user typed their password and pressed "Delete my account".
  // Ask for a final confirmation before doing anything irreversible.
  function requestDelete(event) {
    event.preventDefault();
    deleteError = "";
    if (!deletePassword) {
      deleteError = "Enter your current password to delete your account.";
      return;
    }
    showDeleteModal = true;
  }

  // Step 2: they confirmed in the modal.
  async function confirmDelete() {
    showDeleteModal = false;
    deleteError = "";
    deleteLoading = true;

    // Verify the current password the same way as the password change.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: $user.email,
      password: deletePassword,
    });

    if (signInError) {
      deleteLoading = false;
      deleteError = "Your current password is incorrect.";
      return;
    }

    // Call the security-definer RPC that removes this user's own account.
    const { error: rpcError } = await supabase.rpc("delete_own_account");

    if (rpcError) {
      deleteLoading = false;
      deleteError = rpcError.message;
      return;
    }

    // Account is gone — clear the local session and head home.
    await logout();
    goto("/");
  }
</script>

<svelte:head>
  <title>Account · WebChef</title>
</svelte:head>

<Header />

<main class="account-main">
  {#if $user}
    <div class="account-page">
      <section class="card">
        <h1>Your Account</h1>
        <p class="email-line">
          Signed in as <strong>{$user.email}</strong>
        </p>
      </section>

      <!-- Change password ------------------------------------------------- -->
      <form class="card" onsubmit={handleChangePassword}>
        <h2>Change Password</h2>

        {#if pwError}
          <p class="error" role="alert">{pwError}</p>
        {/if}
        {#if pwInfo}
          <p class="info" role="status">{pwInfo}</p>
        {/if}

        <label>
          Current password
          <input
            type="password"
            bind:value={currentPassword}
            required
            autocomplete="current-password"
          />
        </label>

        <label>
          New password
          <input
            type="password"
            bind:value={newPassword}
            required
            minlength="6"
            autocomplete="new-password"
          />
        </label>

        <label>
          Confirm new password
          <input
            type="password"
            bind:value={confirmNewPassword}
            required
            minlength="6"
            autocomplete="new-password"
          />
        </label>

        <button type="submit" disabled={pwLoading}>
          {pwLoading ? "Saving…" : "Change Password"}
        </button>
      </form>

      <!-- Delete account -------------------------------------------------- -->
      <form class="card danger-card" onsubmit={requestDelete}>
        <h2>Delete Account</h2>
        <p class="warn">
          This permanently deletes your account and cannot be undone.
        </p>

        {#if deleteError}
          <p class="error" role="alert">{deleteError}</p>
        {/if}

        <label>
          Current password
          <input
            type="password"
            bind:value={deletePassword}
            autocomplete="current-password"
          />
        </label>

        <button type="submit" class="delete-button" disabled={deleteLoading}>
          {deleteLoading ? "Deleting…" : "Delete my account"}
        </button>
      </form>
    </div>
  {/if}
</main>

<Footer />

<ConfirmModal
  open={showDeleteModal}
  title="Delete your account?"
  message="This can't be undone. Your account will be permanently removed."
  confirmText="Delete account"
  danger={true}
  onconfirm={confirmDelete}
  oncancel={() => (showDeleteModal = false)}
/>

<style>
  .account-main {
    background: var(--page-color);
    min-height: 70vh;
    padding: 2rem 1rem;
  }

  .account-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.75rem;
    border-radius: 12px;
    background-color: var(--panel-color);
    color: var(--text-color);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  h1,
  h2 {
    margin: 0;
  }

  .email-line {
    margin: 0;
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
    margin-top: 0.25rem;
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

  .danger-card {
    border: 1px solid rgba(176, 0, 32, 0.5);
  }

  .warn {
    margin: 0;
    font-size: 0.9rem;
  }

  .delete-button {
    background-color: #b00020;
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
