<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { applyTheme, getInitialTheme } from "$lib/javascript/theme.js";
  import { user, logout } from "$lib/stores/auth.js";
  import { profile } from "$lib/stores/profile.js";
  import {
    canViewLeaderboard,
    canCreateLessons,
  } from "$lib/javascript/points.js";
  import ConfirmModal from "$lib/components/confirm-modal.svelte";

  let currentTheme = $state("light");
  // Controls the "are you sure you want to log out?" dialog so a stray click
  // on Logout doesn't sign the user out by accident.
  let showLogoutModal = $state(false);
  let menuOpen = $state(false);

  function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  async function confirmLogout() {
    showLogoutModal = false;
    await logout();
    goto("/");
  }

  let headerEl = $state(null);

  onMount(() => {
    currentTheme = getInitialTheme();
    applyTheme(currentTheme);
  });

  $effect(() => {
    if (!headerEl) return;

    const updateHeaderOffset = () => {
      document.documentElement.style.setProperty(
        "--site-header-offset",
        `${headerEl.offsetHeight}px`,
      );
    };

    updateHeaderOffset();
    const observer = new ResizeObserver(updateHeaderOffset);
    observer.observe(headerEl);
    window.addEventListener("resize", updateHeaderOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderOffset);
      document.documentElement.style.removeProperty("--site-header-offset");
    };
  });
</script>

<header bind:this={headerEl}>
  <nav class="navigation">
    <a id="logo-and-title" href="/">
      <img
        id="logo"
        src="/images/penguinhero.webp"
        alt="WebChef penguin standing"
      />
      <h1>WebChef</h1>
    </a>

    <div class="nav-controls">
      <button id="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
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

      <button
        class="hamburger"
        onclick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {#if menuOpen}
          <img
            src="/peeledbanana.png"
            alt="Peeled banana menu open"
            width="36"
            height="36"
          />
        {:else}
          <img
            src="/banana.png"
            alt="Banana menu closed"
            width="36"
            height="36"
          />
        {/if}
      </button>
    </div>

    {#if menuOpen}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="backdrop" onclick={() => (menuOpen = false)}></div>
    {/if}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <ul class:open={menuOpen} onclick={() => (menuOpen = false)}>
      <li><a href="/">Home</a></li>
      <li><a href="/lesson">Lessons</a></li>
      <li><a href="/recipes">Recipes</a></li>
      {#if $user}
        <li><a href="/dashboard">Dashboard</a></li>
        {#if $profile && canViewLeaderboard($profile.level_number)}
          <li><a href="/leaderboard">Leaderboard</a></li>
        {/if}
        {#if $profile && canCreateLessons($profile.level_number)}
          <li><a href="/lesson/my-lessons">My Lessons</a></li>
        {/if}
        <li>
          <a href="/account">
            {$user.user_metadata?.first_name || $user.email}
          </a>
        </li>
        <li>
          <button class="link-button" onclick={() => (showLogoutModal = true)}>
            Logout
          </button>
        </li>
      {:else}
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign Up</a></li>
      {/if}
    </ul>
  </nav>
</header>

<ConfirmModal
  open={showLogoutModal}
  title="Log out?"
  message="You'll need to sign back in to continue your lessons."
  confirmText="Log out"
  onconfirm={confirmLogout}
  oncancel={() => (showLogoutModal = false)}
/>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    padding-bottom: 14px;
    box-sizing: border-box;
  }

  header::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 14px;
    background: url("/images/woodframe.webp") center bottom / cover no-repeat;
    pointer-events: none;
  }

  nav {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
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
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      max-width: 80vw;
      height: 100vh;
      background-color: var(--panel-color);
      box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
      border-left: 2px solid var(--accent-color);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      padding: 5rem 1.5rem 2rem 1.5rem;
      gap: 0;
      margin: 0;
      list-style-type: none;
      z-index: 200;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;

      &.open {
        transform: translateX(0);
      }

      & li {
        width: 100%;
        border-bottom: 1px solid rgba(128, 128, 128, 0.1);

        & a,
        & .link-button {
          display: block;
          padding: 1rem 0.5rem;
          width: 100%;
          text-align: left;
          box-sizing: border-box;
          font-size: 1.1rem;
          text-decoration: none;
          color: var(--text-color);

          &:hover {
            color: var(--text-color-hover);
          }
        }

        & .link-button {
          border: none;
          background: none;
          font: inherit;
          cursor: pointer;
        }
      }
    }
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    order: 3;
  }

  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: var(--text-color);
    border-radius: 4px;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;
    z-index: 201;

    &:hover {
      background-color: rgba(128, 128, 128, 0.15);
      color: var(--text-color-hover);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 199;
  }

  /* Desktop Styles */
  @media (min-width: 768px) {
    .hamburger {
      display: none;
    }

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
        position: static;
        width: auto;
        height: auto;
        max-width: none;
        background-color: transparent;
        box-shadow: none;
        border-left: none;
        flex-direction: row;
        align-items: center;
        padding: 0;
        gap: 0;
        z-index: auto;
        transform: none;
        transition: none;
        order: 2;
        margin-left: auto;

        & li {
          width: auto;
          border-bottom: none;
          padding: 15px;

          & a,
          & .link-button {
            display: inline;
            padding: 0;
            font-size: inherit;
            width: auto;
          }
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

  #logo-and-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    order: 1;
    text-decoration: none;
    color: inherit;
  }
</style>
