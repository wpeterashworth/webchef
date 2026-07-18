<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { getLeaderboard, setUsername } from "$lib/javascript/profile.js";
  import { canViewLeaderboard } from "$lib/javascript/points.js";
  import { profile, profileReady, patchProfile } from "$lib/stores/profile.js";
  /** @typedef {{ rank: number, username: string, xp: number, level_number: number, level_title: string }} LeaderboardRow */

  let fetchedRows = $state(/** @type {LeaderboardRow[]} */ ([]));
  let loadError = $state(/** @type {Error | null} */ (null));
  let loading = $state(true);
  let usernameInput = $state("");
  let usernameError = $state("");
  let usernameSaving = $state(false);
  let usernameSaved = $state(false);

  const rows = $derived.by(() => {
    const current = $profile;
    if (!current?.username) return fetchedRows;

    return fetchedRows.map((row) =>
      row.username === current.username
        ? {
            ...row,
            level_number: current.level_number,
            level_title: current.level_title,
          }
        : row,
    );
  });

  const canView = $derived(
    $profileReady && $profile
      ? canViewLeaderboard($profile.level_number)
      : false,
  );

  $effect(() => {
    if ($profile?.username) {
      usernameInput = $profile.username;
    }
  });

  /** @param {SubmitEvent} event */
  async function saveUsername(event) {
    event.preventDefault();
    usernameError = "";
    usernameSaved = false;
    usernameSaving = true;

    try {
      const previous = $profile?.username;
      const next = await setUsername(usernameInput);
      patchProfile({ username: next });
      usernameInput = next;
      usernameSaved = true;
      fetchedRows = fetchedRows.map((row) =>
        row.username === previous ? { ...row, username: next } : row,
      );
    } catch (error) {
      usernameError =
        error instanceof Error ? error.message : "Could not save username.";
    } finally {
      usernameSaving = false;
    }
  }

  $effect(() => {
    if (!$profileReady) return;

    loading = true;
    loadError = null;

    if (!canViewLeaderboard($profile?.level_number ?? 0)) {
      fetchedRows = [];
      loading = false;
      return;
    }

    getLeaderboard()
      .then((data) => {
        fetchedRows = data.map((entry, index) => ({
          rank: index + 1,
          username: entry.username,
          xp: entry.xp,
          level_number: entry.level_number,
          level_title: entry.level_title,
        }));
      })
      .catch((error) => {
        loadError =
          error instanceof Error
            ? error
            : new Error("Could not load leaderboard.");
        fetchedRows = [];
      })
      .finally(() => {
        loading = false;
      });
  });
</script>

<svelte:head>
  <title>Leaderboard | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <AuthGuard>
      <section class="leaderboard-page">
        <header class="page-header">
          <p class="eyebrow">Top cooks</p>
          <h1>Leaderboard</h1>
        </header>

        {#if !canView}
          <p class="locked">
            Reach level 1 (10 XP) to unlock the leaderboard. Complete a beginner
            lesson to get started.
          </p>
        {:else}
          {#if $profile}
            <form class="username-form" onsubmit={saveUsername}>
              <label for="leaderboard-username">Your leaderboard name</label>
              <div class="username-row">
                <input
                  id="leaderboard-username"
                  type="text"
                  bind:value={usernameInput}
                  maxlength="30"
                  required
                  autocomplete="nickname"
                />
                <button type="submit" disabled={usernameSaving}>
                  {usernameSaving ? "Saving…" : "Save"}
                </button>
              </div>
              {#if usernameError}
                <p class="error" role="alert">{usernameError}</p>
              {:else if usernameSaved}
                <p class="saved" role="status">Username updated.</p>
              {:else}
                <p class="hint">
                  Anything goes — just pick a name nobody else has.
                </p>
              {/if}
            </form>
          {/if}

          {#if loading}
            <p class="status">Loading rankings…</p>
          {:else if loadError}
            <p class="error">{loadError.message}</p>
          {:else if rows.length === 0}
            <p class="status">No ranked players yet.</p>
          {:else}
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Chef</th>
                  <th>Level</th>
                  <th>XP</th>
                </tr>
              </thead>
              <tbody>
                {#each rows as row (row.rank)}
                  <tr class:me={row.username === $profile?.username}>
                    <td>#{row.rank}</td>
                    <td>{row.username}</td>
                    <td>{row.level_number} · {row.level_title}</td>
                    <td>{row.xp}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        {/if}
      </section>
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

  .page-content {
    flex: 1;
    padding: 2rem 1rem 3rem;
  }

  .leaderboard-page {
    max-width: 760px;
    margin: 0 auto;
    color: var(--text-color);
  }

  .page-header {
    margin-bottom: 1.5rem;
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
    margin: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--panel-color);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid
      color-mix(in srgb, var(--text-color) 12%, transparent);
  }

  th {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }

  tr.me {
    background: color-mix(in srgb, #12b7ea 12%, var(--panel-color));
    font-weight: 700;
  }

  .locked,
  .status,
  .hint {
    color: var(--text-muted);
    line-height: 1.5;
  }

  .username-form {
    margin-bottom: 1.5rem;
    padding: 1rem 1.1rem;
    border-radius: 12px;
    background: var(--panel-color);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  }

  .username-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .username-row {
    display: flex;
    gap: 0.5rem;
  }

  .username-row input {
    flex: 1;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--input-border);
    border-radius: 8px;
    background-color: var(--input-bg);
    color: var(--input-text);
    font-size: 1rem;
    font-family: inherit;
  }

  .username-row input::placeholder {
    color: var(--text-muted);
  }

  .username-row input:focus-visible {
    outline: 2px solid #12b7ea;
    outline-offset: 1px;
    border-color: #12b7ea;
  }

  .username-row input:-webkit-autofill,
  .username-row input:-webkit-autofill:hover,
  .username-row input:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--input-text);
    -webkit-box-shadow: 0 0 0 1000px var(--input-bg) inset;
    box-shadow: 0 0 0 1000px var(--input-bg) inset;
  }

  .username-row button {
    padding: 0.55rem 1rem;
    border: none;
    border-radius: 8px;
    background: #12b7ea;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }

  .username-row button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .username-form .hint,
  .username-form .saved {
    margin: 0.5rem 0 0;
    font-size: 0.85rem;
  }

  .saved {
    color: #166534;
  }

  .username-form .error {
    margin: 0.5rem 0 0;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .locked,
  .status {
    color: var(--text-muted);
    line-height: 1.5;
  }

  .error {
    color: #991b1b;
    background: #fee2e2;
    padding: 0.75rem 1rem;
    border-radius: 10px;
  }
</style>
