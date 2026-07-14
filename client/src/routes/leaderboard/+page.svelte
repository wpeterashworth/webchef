<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { getLeaderboard } from "$lib/javascript/profile.js";
  import { canViewLeaderboard } from "$lib/javascript/points.js";
  import { profile, profileReady } from "$lib/stores/profile.js";

  let rows = $state([]);
  let loadError = $state(null);
  let loading = $state(true);

  const canView = $derived(
    $profileReady && $profile ? canViewLeaderboard($profile.level_number) : false,
  );

  $effect(() => {
    if (!$profileReady) return;

    loading = true;
    loadError = null;

    if (!canViewLeaderboard($profile?.level_number ?? 0)) {
      rows = [];
      loading = false;
      return;
    }

    getLeaderboard()
      .then((data) => {
        rows = data;
      })
      .catch((error) => {
        loadError = error;
        rows = [];
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
        {:else if loading}
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
              {#each rows as row (row.username)}
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
    border-bottom: 1px solid color-mix(in srgb, var(--text-color) 12%, transparent);
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
