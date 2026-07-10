<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { applyTheme, getInitialTheme } from "$lib/javascript/theme.js";

  // Set the theme CSS variables (--page-color, --text-color, …) on every route.
  // These vars are applied by JS, so pages without the <Header /> (login, signup)
  // used to render unstyled on a hard refresh — the header's onMount never ran.
  // Doing it in the layout guarantees the theme is applied for every page.
  onMount(() => {
    applyTheme(getInitialTheme());
  });
</script>

<svelte:head>
  <link rel="icon" href="/favicon.ico" />
  <title>WebChef</title>
</svelte:head>

<slot />
