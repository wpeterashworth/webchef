<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { applyTheme, getInitialTheme } from "$lib/javascript/theme.js";
  import { user, logout } from "$lib/stores/auth.js";

  let currentTheme = "light";

  function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
  }

  async function handleLogout() {
    await logout();
    goto("/");
  }

  onMount(() => {
    currentTheme = getInitialTheme();
    applyTheme(currentTheme);
  });
</script>

<header>
  <nav class="navigation">
    <button id="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
      <img
        id="theme-icon"
        src={currentTheme === "dark"
          ? "/moon-svgrepo-com.svg"
          : "/sun-svgrepo-com.svg"}
        alt={currentTheme === "dark" ? "Moon" : "Sun"}
        width="36"
        height="36"
      />
    </button>
    <img
      id="logo"
      src="/images/penguinhero.webp"
      alt="WebChef penguin standing"
    />
    <h1>WebChef</h1>
    <ul>
      <li><a href="/">Home</a></li>
      {#if $user}
        <li class="user-email">{$user.email}</li>
        <li><a href="/dash">Dashboard</a></li>
        <li>
          <button class="link-button" on:click={handleLogout}>Logout</button>
        </li>
      {:else}
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign Up</a></li>
      {/if}
    </ul>
  </nav>
</header>

<style>
  nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--panel-color);
    color: var(--text-color);

    & img {
      max-width: 100px;
      height: auto;
      order: 1;
    }

    & button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      & img {
        width: 36px;
        height: 36px;
        margin: 0px;
      }
    }

    & h1 {
      margin: 0;
      order: 2;
    }

    & ul {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      margin: 0;
      padding: 0;
      list-style-type: none;
      order: 3;

      & a {
        text-decoration: none;
        color: var(--text-color);

        &:hover {
          color: var(--text-color-hover);
        }
      }

      & .user-email {
        color: var(--text-color);
        opacity: 0.85;
      }

      & .link-button {
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        cursor: pointer;
        color: var(--text-color);

        &:hover {
          color: var(--text-color-hover);
        }
      }
    }
  }

  /* Desktop Styles */
  @media (min-width: 768px) {
    nav {
      flex-direction: row;
      justify-content: flex-start;
      padding: 0.5rem 2rem;

      & img {
        order: 1;
        margin-right: 1rem;
      }

      & h1 {
        order: 2;
      }

      & ul {
        order: 3;
        margin-left: auto;
        gap: 0;

        & li {
          padding: 15px;
        }
      }
    }
  }

  /* Theme toggle tweaks */
  #theme-toggle {
    padding: 4px;
  }

  #theme-icon {
    width: 36px;
    height: 36px;
    transform: translateY(-4px);
    display: block;
    object-fit: contain;
  }
</style>
