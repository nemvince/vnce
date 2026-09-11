<script lang="ts">
    import type { Snippet } from 'svelte';

    let { class: cls = '', children }: { class?: string; children?: Snippet } = $props();

    const EMAIL_B64 = 'aGlAdm5jZS5ldQ==';
    const email = atob(EMAIL_B64);

    let copied = $state(false);
    let copyTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
    let bounce = $state(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            copied = true;
            bounce = true;
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                copied = false;
                bounce = false;
            }, 1500);
        } catch { /* Clipboard unavailable */ }
    };
</script>

<button
    type="button"
    class="underline decoration-muted hover:decoration-fg underline-offset-4 transition-colors {cls}"
    onclick={copy}
    aria-label="Copy email address"
    class:animate-bounce={bounce}
>
    {@render children?.()}
    {#if !children}
        {copied ? 'copied' : email}
    {/if}
</button>
