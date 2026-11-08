<script lang="ts">
	import AppPage from '$lib/components/app/AppPage.svelte';
	import EntryView from '$lib/components/app/entry/EntryView.svelte';
	import LoadingText from '$lib/components/shared/LoadingText.svelte';
	import { useEntry } from '$lib/hooks/app/useEntry.svelte';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

	const entryState = $derived(useEntry(params.id));
</script>

<AppPage class="h-full gap-4">
	{#if !params.id}
		<p class="m-auto text-h3 text-muted-foreground">no id</p>
	{:else if entryState.error}
		<p class="m-auto text-h3 text-muted-foreground">{entryState.error}</p>
	{:else if entryState.isLoading}
		<p class="m-auto text-h3 text-muted-foreground"><LoadingText text="loading entry" /></p>
	{:else if !entryState.entry}
		<p class="m-auto text-h3 text-muted-foreground">entry not found</p>
	{:else}
		<EntryView entry={entryState.entry} />
	{/if}
</AppPage>
