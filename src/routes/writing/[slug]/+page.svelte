<script lang="ts">
    import CodeCopy from '$lib/components/code-copy.svelte';

    let { data } = $props();
    const Content = $derived(data.content);

    let hostEl = $state<HTMLElement>();
</script>
<svelte:head>
    <title>{data.meta.title} — vnce</title>
</svelte:head>

<article class="mx-auto w-full max-w-2xl px-6 pt-20 pb-16 typeset [--typeset-size:1rem]" bind:this={hostEl}>
    <header class="mb-12 not-typeset">
        <p class="text-muted text-sm tabular-nums mb-2">
            {new Date(data.meta.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 class="text-3xl font-bold tracking-tight">{data.meta.title}</h1>
    </header>
    <Content />
    <CodeCopy host={hostEl} />
    <p class="mt-16 not-typeset">
        <a
            class="underline decoration-muted hover:decoration-fg underline-offset-4 transition-colors"
            href="/writing"
        >
            ← all writing
        </a>
    </p>
</article>
