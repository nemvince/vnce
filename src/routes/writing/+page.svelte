<script lang="ts">
    import { getPosts } from '$lib/posts';

    let { data } = $props();
    const posts = getPosts();
</script>

<div class="mx-auto w-full max-w-2xl px-6 flex flex-col">
    <section class="pt-20 pb-16">
        <h1 class="text-3xl font-bold tracking-tight mb-4">writing</h1>
        <p class="text-lg text-muted leading-relaxed mb-4">
            things i've learned, written down so i don't forget them.
        </p>
    </section>

    <section class="pb-16 flex flex-col gap-8">
        {#each posts as post (post.slug)}
            <article class="flex flex-col sm:flex-row sm:gap-8 gap-1">
                <span class="text-muted text-sm shrink-0 w-24 tabular-nums pt-1">
                    {new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}
                </span>
                <div class="flex flex-col gap-1">
                    <h2 class="font-bold">
                        <a
                            class="underline decoration-muted hover:decoration-fg underline-offset-4 transition-colors"
                            href="/writing/{post.slug}"
                        >
                            {post.title}
                        </a>
                    </h2>
                    {#if post.description}
                        <p class="text-muted leading-relaxed">{post.description}</p>
                    {/if}
                </div>
            </article>
        {:else}
            <p class="text-muted">nothing here yet. check back soon.</p>
        {/each}
    </section>
</div>
