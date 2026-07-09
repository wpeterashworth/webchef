<script>
    export let heroSrc = "/images/penguinhero.webp";
    export let description = "Bite-sized lessons, streaks, and XP to build cooking skills progressively.";
    export let onAction;
</script>

<section class="landing">
    <div class="landing-card">
        <img id="heroImage" src={heroSrc} alt="Hero content" />

        <div class="content">
            <h2 class="title">Welcome to WebChef</h2>
            <p class="description">{description}</p>
            <div class="actions">
                <button class="primary" on:click={() => onAction?.()}>Get Started</button>
                <a class="secondary" href="/signup">Sign up</a>
            </div>
        </div>
    </div>
</section>

<style>
    .landing {
        padding: 3rem 1rem;
        display: flex;
        justify-content: center;
    }

    .landing-card {
        width: 100%;
        max-width: 1100px;
        display: flex;
        gap: 2rem;
        align-items: center;
        padding: 2rem;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.02));
        box-shadow: 0 8px 24px rgba(2,6,23,0.35);
    }

    #heroImage {
        width: 40%;
        max-width: 360px;
        border-radius: 12px;
        object-fit: contain;
    }

    .content {
        flex: 1;
        color: var(--text-color);
    }

    .title {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        color: var(--text-color);
    }

    .description {
        margin: 0 0 1.25rem 0;
        line-height: 1.6;
        color: var(--text-color-muted, rgba(255,255,255,0.8));
    }

    .actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .primary {
        background: var(--accent-color, #ff7a18);
        color: white;
        border: none;
        padding: 0.75rem 1.25rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    .primary:hover {
        transform: translateY(-2px);
    }

    .secondary {
        color: var(--text-color);
        text-decoration: none;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.06);
    }

    /* Responsive: stack vertically on small screens */
    @media (max-width: 768px) {
        .landing-card {
            flex-direction: column;
            padding: 1.25rem;
            gap: 1rem;
        }

        #heroImage {
            width: 56%;
            max-width: 220px;
            margin: 0 auto;
        }

        .content {
            text-align: center;
        }

        .actions {
            justify-content: center;
        }
    }
</style>