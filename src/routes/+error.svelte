<script lang="ts">
    import { page } from '$app/state';
</script>

<div class="mx-auto w-full max-w-2xl px-6 pt-20 pb-16">
    <h1 class="text-3xl font-bold mb-4">{page.status}</h1>
    <p class="text-lg leading-relaxed mb-4">
        {#if page.status === 404}
            this page doesn't exist. i probably moved it, or never made it.
        {:else}
            something broke on my end, not yours. try again in a bit.
        {/if}
    </p>
    <a
        class="underline decoration-muted hover:decoration-fg underline-offset-4 transition-colors"
        href="/"
    >
        back home
    </a>
</div>
