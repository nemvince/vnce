<script lang="ts">
    import { page } from '$app/state';
    import MainLink from "./main-link.svelte";
    import ModeToggle from "./mode-toggle.svelte";

    const links = [
        { href: '/', label: 'home' },
        { href: '/writing', label: 'writing' },
    ];
    const isActive = (href: string) =>
        href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header class="border-b p-3 px-4 flex justify-between gap-4 items-center">
    <div class="flex gap-4 items-center">
        <MainLink />
        <nav class="flex gap-4 text-sm" aria-label="main">
            {#each links as link (link.href)}
                <a
                    class="transition-colors {isActive(link.href)
                        ? 'text-fg underline decoration-accent underline-offset-4'
                        : 'text-muted hover:text-fg'}"
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                >
                    {link.label}
                </a>
            {/each}
        </nav>
    </div>
    <ModeToggle />
</header>
