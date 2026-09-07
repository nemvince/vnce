<script lang="ts">
    import { slide } from "svelte/transition";
    import CaretDownIcon from "phosphor-svelte/lib/CaretDownIcon";

    let {
        period,
        title,
        detail,
        open = false,
        ontoggle,
    }: {
        period: string;
        title: string;
        detail: string;
        open?: boolean;
        ontoggle: () => void;
    } = $props();
</script>

<button
    type="button"
    class="w-full text-left group"
    onclick={ontoggle}
    aria-expanded={open}
>
    <div class="flex flex-col gap-1">
        <span class="flex items-center gap-1.5">
            <CaretDownIcon
                class="text-muted text-xs transition-transform shrink-0 {open ? 'rotate-180' : ''}"
                weight="bold"
            />
            <span class="text-muted text-sm tabular-nums">{period}</span>
        </span>
        <span class="font-bold group-hover:text-accent transition-colors">{title}</span>
    </div>
    {#if open}
        <p
            transition:slide={{ duration: 150 }}
            class="text-muted text-sm leading-relaxed pb-2"
        >
            {detail}
        </p>
    {/if}
</button>
