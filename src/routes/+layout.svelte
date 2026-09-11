<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { ModeWatcher } from "mode-watcher";
	import favicon from "$lib/assets/favicon.svg";
	import Footer from "$lib/components/footer.svelte";
    import Header from "$lib/components/header.svelte";
	import "./layout.css";
    import { PUBLIC_UMAMI, PUBLIC_UMAMI_SCRIPT_URL, PUBLIC_UMAMI_WEBSITE_ID } from '$env/static/public';
	
	let { children, data } = $props();
	const pathname = $derived(data.pathname)

</script>

{#if PUBLIC_UMAMI !== '0' && PUBLIC_UMAMI !== 'false'}
  <script
    defer
    src={PUBLIC_UMAMI_SCRIPT_URL}
    data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
  ></script>
{/if}

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>vnce — tamás vince</title>
	<meta
		name="description"
		content="tamás vince — it student in budapest: systems technician & software developer. typescript, python, linux, open source."
	/>
	<meta property="og:title" content="vnce — tamás vince" />
	<meta
		property="og:description"
		content="it student in budapest — systems technician & software developer. open-source school tools, home labs, and the occasional door lock."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://vnce.eu" />
	<meta name="twitter:card" content="summary" />
</svelte:head>
<Header />
{#key pathname}

	<main in:fade={{ easing: cubicOut, duration: 150, delay: 250 }}
		out:fade={{ easing: cubicIn, duration: 150 }} class="grow flex flex-col">{@render children()}</main>
{/key}
<Footer />
<ModeWatcher disableTransitions={false} />
