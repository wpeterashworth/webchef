<script>
  import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
  import HeroSection from "$lib/components/landing.svelte";

  let description =
    "Come one come all! and learn about to the world of cooking with WebChef. The one stop shop for all your culinary needsfrom easy to hard lessons about ingreadients and cooking methods. Whether you are a beginner or a seasoned pro, WebChef has got you covered. Take da lessons or submit your own. We hope this site helps the cooking communtity prosper.";

  function handleHeroAction() {
    console.log("Action received from HeroSection");
  }
</script>

<Header />

<main class="main">
  <HeroSection
    heroSrc="/images/kitchenHero.webp"
    {description}
    onAction={handleHeroAction}
  />
</main>

<Footer />
