<script>
    import Header from './Header.svelte';
    import HeroSection from './HeroSection.svelte';
    import Footer from './Footer.svelte';

    let description = $state("Come one come all! and learn about to the world of cooking with WebChef. The one stop shop for all your culinary needsfrom easy to hard lessons about ingreadients and cooking methods. Whether you are a beginner or a seasoned pro, WebChef has got you covered. Take da lessons or submit your own. We hope this site helps the cooking communtity prosper.");

    function handleHeroAction() {
        console.log("Action received from HeroSection");
    }
</script>

<Header />

<main class="main">
    <HeroSection 
        heroSrc="/images/hero.jpg" 
        {description} 
        onAction={handleHeroAction} 
    />
</main>

<Footer />