<script>
  import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
  import HeroSection from "$lib/components/landing.svelte";
  import { user } from "$lib/stores/auth.js";

  let description =
    "Come one come all! and learn about to the world of cooking with WebChef. The one stop shop for all your culinary needsfrom easy to hard lessons about ingreadients and cooking methods. Whether you are a beginner or a seasoned pro, WebChef has got you covered. Take da lessons or submit your own. We hope this site helps the cooking communtity prosper.";

  // One button, two destinations: sign up if you're a visitor, straight to the
  // lessons if you're already a member. Mirrors how the header swaps its links.
  const actionHref = $derived($user ? "/lesson" : "/signup");
</script>

<Header />

<main class="main">
  <HeroSection heroSrc="/images/kitchenHero.webp" {description} {actionHref} />
</main>

<Footer />
