<script>
  import { onMount } from "svelte";
  import { applyTheme, getInitialTheme } from "$lib/javascript/theme.js";

  let currentTheme = "light";

  function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
  }

  onMount(() => {
    currentTheme = getInitialTheme();
    applyTheme(currentTheme);
  });
</script>

<header>
  <nav class="navigation">
    <img
      id="logo"
      src="/images/penguinhero.webp"
      alt="WebChef penguin standing"
    />
    <h1>WebChef</h1>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/login">Login</a></li>
      <li><a href="/signup">Sign Up</a></li>
    </ul>
    <button id="theme-toggle" on:click={toggleTheme}>
      {currentTheme === "dark" ? "🌙" : "☀️"}
    </button>
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
  }</style>
