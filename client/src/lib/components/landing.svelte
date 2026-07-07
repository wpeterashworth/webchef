<script>
    // DATA INPUT: Explicitly define props.
    // This allows the parent to inject data without the component
    // needing to manage internal state for these values.
    let { heroSrc, description, onAction } = $props();
</script>

<div class="landing">
    <img id="heroImage" src={heroSrc} alt="Hero content" />
    <h2 class="subheading">Welcome to WebChef</h2>
    <p class="description">{description}</p>
    <button onclick={() => onAction?.()}>Trigger Action</button>
</div>

<style>
    
    .landing{
        background-color: var(--page-color);
        
        & img {
            display: flex;
            margin: 0 auto;
            justify-content: center;
            Width: 34%;
            height: 58%;

        }
    
    }
</style>