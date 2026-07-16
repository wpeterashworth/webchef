<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { applyTheme, getInitialTheme } from "$lib/javascript/theme.js";
  import { user, logout } from "$lib/stores/auth.js";
  import ConfirmModal from "$lib/components/confirm-modal.svelte";

  let currentTheme = $state("light");
  // Controls the "are you sure you want to log out?" dialog so a stray click
  // on Logout doesn't sign the user out by accident.
  let showLogoutModal = $state(false);

  function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
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
    <img
      id="logo"
      src="/images/penguinhero.webp"
      alt="WebChef penguin standing"
    />
    <h1>WebChef</h1>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/lesson">Lessons</a></li>
      <li><a href="/recipes">Recipes</a></li>
      {#if $user}
        <li><a href="/dashboard">Dashboard</a></li>
        <li>
          <a href="/account" class="user-email">
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
