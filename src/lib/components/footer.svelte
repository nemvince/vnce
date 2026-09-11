<script lang="ts">
    import GithubLogoIcon from "phosphor-svelte/lib/GithubLogoIcon";
    import MainLink from "./main-link.svelte";
    import ExternalLink from "./external-link.svelte";
</script>

<footer class="border-t py-3 px-4 justify-between flex items-center">
    <div class="flex justify-center items-center gap-4">
        <MainLink />
        <ExternalLink
            href="https://github.com/nemvince/vnce"
            class="group text-sm text-muted hover:text-fg flex gap-1 no-underline"
        >
            <GithubLogoIcon class="text-accent group-hover:text-fg text-xl" />
            source
        </ExternalLink>
    </div>
        <p class="text-xs text-muted">
        this site uses self-hosted umami for tracking
    </p>
</footer>
