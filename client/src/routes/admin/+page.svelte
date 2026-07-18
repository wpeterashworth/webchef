<script>
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import AuthGuard from "$lib/components/auth-guard.svelte";
  import { getAdminDashboard } from "$lib/javascript/profile.js";
  import { profile, profileReady } from "$lib/stores/profile.js";
  /**
   * @typedef {{
   *   counts?: Record<string, number>,
   *   recent_users?: Array<{ username: string, email: string, level_number: number, xp: number, is_admin: boolean, joined_at: string | number | Date }>,
   *   top_cooks?: Array<{ username: string, level_number: number, level_title: string, xp: number }>,
   *   generated_at?: string | number | Date
   * }} AdminDashboard
   */

  let dashboard = $state(/** @type {AdminDashboard | null} */ (null));
  let loading = $state(true);
  let loadError = $state("");
  let loadedFor = $state(/** @type {string | null} */ (null));

  $effect(() => {
    if (!$profileReady) return;

    if (!$profile?.is_admin) {
      dashboard = null;
      loading = false;
      loadError = "";
      loadedFor = null;
      return;
    }

    if (loadedFor === $profile.id) return;

    loading = true;
    loadError = "";

    getAdminDashboard()
      .then((data) => {
        dashboard = /** @type {AdminDashboard} */ (data);
        loadedFor = $profile.id;
      })
      .catch((error) => {
        dashboard = null;
        loadError =
          error instanceof Error
            ? error.message
            : "Could not load admin dashboard.";
      })
      .finally(() => {
        loading = false;
      });
  });

  const counts = $derived(dashboard?.counts ?? {});
  const recentUsers = $derived(dashboard?.recent_users ?? []);
  const topCooks = $derived(dashboard?.top_cooks ?? []);
  const refreshedAt = $derived(
    dashboard?.generated_at
      ? new Date(dashboard.generated_at).toLocaleString()
      : "",
  );

  /** @param {string | number | Date} value */
  const joinedAt = (value) => new Date(value).toLocaleDateString();
</script>

<svelte:head>
  <title>Admin page | WebChef</title>
</svelte:head>

<div class="page-shell">
  <Header />

  <main class="page-content">
    <AuthGuard>
      <section class="admin-page">
        <header class="page-header">
          <p class="eyebrow">Demo control room</p>
          <h1>Admin page</h1>
          <p class="intro">
            A private snapshot of activity across users, lessons, and recipes.
          </p>
        </header>

        {#if !$profileReady || loading}
          <p class="status">Loading admin dashboard…</p>
        {:else if !$profile?.is_admin}
          <section class="locked-card">
            <h2>Admin only</h2>
            <p>
              Your account is signed in, but it does not have the admin role.
            </p>
            <p class="hint">
              Promote your demo account in Supabase, then refresh this page.
            </p>
          </section>
        {:else if loadError}
          <p class="error" role="alert">{loadError}</p>
        {:else if dashboard}
          <div class="summary-grid">
            <article class="summary-card">
              <span>Total users</span>
              <strong>{counts.users ?? 0}</strong>
            </article>
            <article class="summary-card">
              <span>Course lessons</span>
              <strong>{counts.course_lessons ?? 0}</strong>
            </article>
            <article class="summary-card">
              <span>Community lessons</span>
              <strong>{counts.community_lessons ?? 0}</strong>
            </article>
            <article class="summary-card">
              <span>Recipe cards</span>
              <strong>{counts.recipes ?? 0}</strong>
            </article>
            <article class="summary-card">
              <span>Completed runs</span>
              <strong>{counts.completed_runs ?? 0}</strong>
            </article>
          </div>

          <div class="panel-grid">
            <section class="panel">
              <div class="panel-head">
                <h2>Newest users</h2>
                <span>Last 5 signups</span>
              </div>

              {#if recentUsers.length === 0}
                <p class="status">No user records yet.</p>
              {:else}
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Chef</th>
                        <th>Email</th>
                        <th>Level</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each recentUsers as row}
                        <tr>
                          <td>
                            {row.username}
                            {#if row.is_admin}
                              <span class="pill">Admin</span>
                            {/if}
                          </td>
                          <td>{row.email}</td>
                          <td>{row.level_number} · {row.xp} XP</td>
                          <td>{joinedAt(row.joined_at)}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </section>

            <section class="panel">
              <div class="panel-head">
                <h2>Top cooks</h2>
                <span>Fastest progress</span>
              </div>

              {#if topCooks.length === 0}
                <p class="status">No leaderboard data yet.</p>
              {:else}
                <ol class="top-list">
                  {#each topCooks as row}
                    <li>
                      <div>
                        <strong>{row.username}</strong>
                        <p>Level {row.level_number} · {row.level_title}</p>
                      </div>
                      <span>{row.xp} XP</span>
                    </li>
                  {/each}
                </ol>
              {/if}
            </section>
          </div>

          <p class="stamp">Snapshot generated {refreshedAt}</p>
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

  .admin-page {
    max-width: 1100px;
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
    font-size: clamp(2rem, 4vw, 3.25rem);
  }

  .intro {
    max-width: 42rem;
    margin: 0.75rem 0 0;
    color: var(--text-muted);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .summary-card,
  .panel,
  .locked-card {
    background: var(--panel-color);
    border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
    border-radius: 22px;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  }

  .summary-card {
    padding: 1rem 1.1rem;
  }

  .summary-card span {
    display: block;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .summary-card strong {
    display: block;
    margin-top: 0.35rem;
    font-size: 2rem;
  }

  .panel-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }

  .panel,
  .locked-card {
    padding: 1.2rem;
  }

  .panel-head {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  .panel-head h2,
  .locked-card h2 {
    margin: 0;
  }

  .panel-head span,
  .hint,
  .stamp,
  .status {
    color: var(--text-muted);
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.8rem 0.6rem;
    text-align: left;
    border-bottom: 1px solid
      color-mix(in srgb, var(--text-color) 10%, transparent);
    vertical-align: middle;
  }

  th {
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .pill {
    display: inline-flex;
    margin-left: 0.5rem;
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    background: #153e2f;
    color: #d7ffef;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .top-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .top-list li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--text-color) 10%, transparent);
  }

  .top-list li:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .top-list strong,
  .top-list p {
    margin: 0;
  }

  .top-list p {
    margin-top: 0.25rem;
    color: var(--text-muted);
  }

  .error {
    color: #c0392b;
  }

  .stamp {
    margin-top: 1rem;
    text-align: right;
  }

  @media (max-width: 820px) {
    .panel-grid {
      grid-template-columns: 1fr;
    }

    .panel-head {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
