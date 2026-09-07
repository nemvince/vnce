<script lang="ts">
    import GithubLogoIcon from "phosphor-svelte/lib/GithubLogoIcon";
    import LinkedinLogoIcon from "phosphor-svelte/lib/LinkedinLogoIcon";
    import MailboxIcon from "phosphor-svelte/lib/MailboxIcon";
    import MainLink from "./main-link.svelte";
    import CopyButton from "./copy-button.svelte";
    import ExternalLink from "./external-link.svelte";
</script>

<footer class="border-t p-3 px-4 flex justify-center items-end gap-4">
    <MainLink />
    <ExternalLink href="https://github.com/nemvince/vnce" class="group text-sm text-muted hover:text-fg flex gap-1 no-underline">
        <GithubLogoIcon class="text-accent group-hover:text-fg text-xl" />
        source
    </ExternalLink>
</footer>
