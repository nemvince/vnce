<script lang="ts">
    import { toggleMode } from "mode-watcher";
    import { slide } from "svelte/transition";

    let open = $state(false);
    const toggleOpen = () => (open = !open);
</script>

{#snippet toggle(
    title: string,
    onclick: () => void,
    labels: [string, string][],
)}
    <div transition:slide={{ axis: "x" }} class="flex items-end">
        <span class="text-muted gap-1">{title}</span>
        <button {onclick}>
            {#each labels as [classname, label]}
                <span
                    class="{classname} hover:bg-accent transition-all cursor-pointer"
                    >{label}</span
                >
            {/each}
        </button>
    </div>
{/snippet}

<div class="flex gap-2">
    {#if open}
        {@render toggle("theme", toggleMode, [
            ["dark:hidden", "sun"],
            ["hidden dark:block", "moon"],
        ])}
    {/if}
    <button
        onclick={toggleOpen}
        aria-label="Toggle theme switcher"
        aria-expanded={open}
        type="button"
    >
        <span class="inline-block transition-all" class:rotate-180={open}
            >&gt;</span
        >
    </button>
</div>
