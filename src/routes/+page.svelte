<script lang="ts">
    import type { PageData } from './$types';

    import CopyButton from "$lib/components/copy-button.svelte";
    import ExternalLink from "$lib/components/external-link.svelte";
    import Collapsible from "$lib/components/collapsible.svelte";
    import ArrowUpRightIcon from "phosphor-svelte/lib/ArrowUpRightIcon";
    import MailboxIcon from "phosphor-svelte/lib/MailboxIcon";
    import GithubLogoIcon from "phosphor-svelte/lib/GithubLogoIcon";
    import Heatmap from "$lib/components/heatmap.svelte";

    let { data }: { data: PageData } = $props();
    const contributions = $derived(data.contributions);

    const projects = [
        {
            name: 'filc',
            year: '2024',
            tags: 'typescript · react · iot',
            desc: 'timetable and substitution manager for my school, plus an IoT door lock for classrooms. open source.',
            href: 'https://github.com/filcdev/filc',
        },
        {
            name: 'petriktv',
            year: '2024',
            tags: 'typescript · kiosk · gtfs',
            desc: "a screen in the school hall showing daily substitutions and live public transport times, via BKK's GTFS feed.",
            href: 'https://github.com/nemvince/petriktv',
        },
        {
            name: 'axi',
            year: '2026',
            tags: 'bun · typescript · react',
            desc: 'a small full-stack framework for bun — pages, APIs, and websockets with one command.',
            href: 'https://github.com/nemvince/axi',
        },
    ];

    const work = [
        {
            period: '2024 & 2025',
            title: 'software developer intern, nokia',
            detail: 'two 6-week summer internships, both earned through a national competition (top-12 both times). built an internal testing tool in python and a pyqt frontend from scratch, working in scrum with jira and gitlab.',
        },
        {
            period: '2023 — 2024',
            title: 'react frontend developer, freelance',
            detail: 'designed and built a production-ready bakery management frontend with react and typescript.',
        },
    ];

    const wins = [
        {
            period: '2023 — 2025',
            title: 'szeresd a pingvint — 1st, three times',
            detail: 'national competition in linux server administration, user management, and file systems.',
        },
        {
            period: '2025',
            title: 'juniorskills, sysadmin — 1st',
            detail: 'national competition configuring windows and linux servers and clients.',
        },
        {
            period: '2025',
            title: 'nokia spring hackathon — 1st',
            detail: 'won for clean, maintainable code.',
        },
        {
            period: '2026',
            title: 'szegedi innovatív — 1st',
            detail: 'sziiv - national competition for innovative software by top high-school students.',
        },
    ];

    const identity: { k: string; v: string; href?: string; copy?: boolean }[] = [
        { k: 'location', v: 'budapest, hungary' },
        { k: 'school', v: 'petrik lajos', href: 'https://petrik.hu' },
        { k: 'email', v: 'hi@vnce.eu', copy: true },
        { k: 'github', v: 'nemvince', href: 'https://github.com/nemvince' },
    ];

    let openEntry = $state<string | null>(null);
    const toggleEntry = (key: string) =>
        (openEntry = openEntry === key ? null : key);
</script>

<div class="mx-auto w-full max-w-2xl px-6 flex flex-col">
    <!-- intro -->
    <section class="pt-20 pb-16">
        <h1 class="text-3xl font-bold tracking-tight mb-6">tamás vince</h1>
        <p class="text-lg leading-relaxed mb-4">
            i'm an <em>it student</em> in budapest — systems technician and
            software developer. i build open-source tools that people around me
            actually use: <a class="underline decoration-muted hover:decoration-fg underline-offset-4 transition-colors" href="#projects">school software</a>,
            a home lab, the occasional door lock.
        </p>
        <p class="text-muted leading-relaxed">
            two summers in a row i've interned at nokia, and i'm finishing
            school at BMSZC Petrik Lajos.
            <CopyButton>write me</CopyButton>
        </p>
    </section>

    <!-- projects -->
    <section id="projects" class="py-16 border-t border-border/60">
        <h2 class="text-sm text-muted font-normal mb-8">things i've built</h2>
        <div class="flex flex-col gap-10">
            {#each projects as p (p.name)}
                <article class="flex flex-col sm:flex-row sm:gap-8 gap-2">
                    <span class="text-muted text-sm shrink-0 w-8 tabular-nums pt-1">{p.year}</span>
                    <div class="flex flex-col gap-1">
                        <h3 class="font-bold">
                            <ExternalLink href={p.href} class="inline-flex items-center gap-1">
                                {p.name} <ArrowUpRightIcon class="text-accent size-3.5" />
                            </ExternalLink>
                        </h3>
                        <p class="text-muted leading-relaxed">{p.desc}</p>
                        <p class="text-xs text-accent">{p.tags}</p>
                    </div>
                </article>
            {/each}
        </div>
    </section>

    <!-- experience + competitions -->
    <section class="py-16 border-t border-border/60 flex flex-col lg:flex-row lg:gap-6 gap-4">
        <div class="flex-1 flex flex-col gap-2">
            <h2 class="text-sm text-muted font-normal mb-2">where i've worked</h2>
            {#each work as e, i (`w${i}`)}
                <Collapsible
                    period={e.period}
                    title={e.title}
                    detail={e.detail}
                    open={openEntry === `w${i}`}
                    ontoggle={() => toggleEntry(`w${i}`)}
                />
            {/each}
        </div>
        <div class="flex-1 flex flex-col gap-2">
            <h2 class="text-sm text-muted font-normal mb-2">things i've won</h2>
            {#each wins as e, i (`c${i}`)}
                <Collapsible
                    period={e.period}
                    title={e.title}
                    detail={e.detail}
                    open={openEntry === `c${i}`}
                    ontoggle={() => toggleEntry(`c${i}`)}
                />
            {/each}
        </div>
    </section>

    <!-- about -->
    <section class="py-16 border-t border-border/60">
        <h2 class="text-sm text-muted font-normal mb-8">about</h2>
        <div class="flex flex-col md:flex-row gap-10">
            <p class="text-lg leading-relaxed flex-1">
                i like making things that people around me actually use.
                i've won a few national competitions in linux administration and
                software engineering, and i run a home lab with proxmox and
                docker for fun. when i'm not at a keyboard, i'm probably
                in nature, enjoying it. open for work, fast learner, hella motivated
                if we're talking about something interesting.
            </p>
            <dl class="text-sm flex flex-col gap-2 shrink-0 md:w-56">
                {#each identity as row (row.k)}
                    <div class="flex justify-between gap-4">
                        <dt class="text-muted">{row.k}</dt>
                        <dd class="text-right">
                            {#if row.copy}
                                <CopyButton class="inline-flex items-center gap-1">
                                    <MailboxIcon class="text-accent size-4" />
                                    {row.v}
                                </CopyButton>
                            {:else if row.href}
                                <ExternalLink href={row.href} class="inline-flex items-center gap-1">
                                    {#if row.k === 'github'}<GithubLogoIcon class="text-accent size-4" />{/if}
                                    {row.v}
                                </ExternalLink>
                            {:else}
                                {row.v}
                            {/if}
                        </dd>
                    </div>
                {/each}
            </dl>
        </div>
    </section>

    <!-- github -->
    <section class="py-16 border-t border-border/60">
        <h2 class="text-sm text-muted font-normal mb-8">commits, publicly</h2>
        <ExternalLink href="https://github.com/nemvince" class="block">
            <Heatmap data={contributions} />
        </ExternalLink>
    </section>

    <!-- writing -->
    <section class="py-16 border-t border-border/60">
        <h2 class="text-sm text-muted font-normal mb-8">words i've written</h2>
        <p class="text-lg leading-relaxed">
            occasionally i write things down so i don't forget them —
            <a
                class="underline decoration-muted hover:decoration-fg underline-offset-4 transition-colors"
                href="/writing"
            >read them here</a>.
        </p>
    </section>
</div>
