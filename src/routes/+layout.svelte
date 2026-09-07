<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "./layout.css";
	import { ModeWatcher } from "mode-watcher";
	import Footer from "$lib/components/footer.svelte";
    import Header from "$lib/components/header.svelte";

	let { children } = $props();
</script>

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
<main class="grow flex flex-col">{@render children()}</main>
<Footer />
<ModeWatcher disableTransitions={false} />
