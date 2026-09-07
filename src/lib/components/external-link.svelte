<script lang="ts">
    import type { Snippet } from 'svelte';

    let { href, class: cls = '', children }: { href: string; class?: string; children: Snippet } = $props();

    let bounce = $state(false);
    let timeout: ReturnType<typeof setTimeout>;
    const click = () => {
        bounce = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => (bounce = false), 500);
    };
</script>

<a
    {href}
    target="_blank"
    rel="noopener noreferrer"
    onclick={click}
    class="underline decoration-muted hover:decoration-fg underline-offset-4 transition-colors {cls}"
    class:animate-bounce={bounce}
>
    {@render children()}
</a>
