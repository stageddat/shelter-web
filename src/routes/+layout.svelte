<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import { pwaInfo } from 'virtual:pwa-info';
	import { onMount } from 'svelte';
	import { BreakpointIndicator, watchThemePreference } from 'shelter-assets';
	import { dev } from '$app/environment';
	import { m } from '$lib/paraglide/messages';

	// seguir el tema si cambia en otra pestaña o en el sistema (con 'system')
	onMount(() => watchThemePreference());

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered() {},
				onRegisterError(err: Error) {
					console.error('failed to register service worker:', err);
				}
			});
		}
	});

	const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{m['metadata.app.title']()}</title>
	<meta name="description" content={m['metadata.app.description']()} />
	{#if !import.meta.env.DEV}
		<script
			defer
			src="https://stats.stageddat.dev/script.js"
			data-website-id="77c3d000-480e-4bd8-b2e0-47dfde39965b"
			data-performance="true"
		></script>
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifest}
</svelte:head>

{#if dev}
	<BreakpointIndicator />
{/if}
{@render children()}
