<script>
    // DATA INPUT: Explicitly define props.
    // This allows the parent to inject data without the component
    // needing to manage internal state for these values.
    let { heroSrc, description, onAction } = $props();
</script>

<img id="heroImage" src={heroSrc} alt="Hero content" />
<h2 class="subheading">Welcome to WebChef</h2>
<p class="description">{description}</p>

<button onclick={() => onAction?.()}>Trigger Action</button>

<style>
    
</style>