<script lang="ts">
	import AppPage from '$lib/components/app/AppPage.svelte';
	import EntryCard from '$lib/components/app/entry/EntryCard.svelte';
	import LoadingText from '$lib/components/shared/LoadingText.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { getAppContext } from '$lib/contexts/app.context.svelte';
	import * as m from '$lib/paraglide/messages';
	import { Button } from 'shelter-assets';

	const app = getAppContext();
</script>

<svelte:head>
	<title>{m['metadata.entries.title']()}</title>
</svelte:head>

{#if app.isLoading}
	<div class="flex h-full items-center justify-center text-h2 text-muted-foreground">
		<LoadingText />
	</div>
{:else}
	<AppPage
		class="h-full"
		title={m['app.entries.title']()}
		subtitle={`${app.entries.length} ${app.entries.length === 1 ? m['app.entries.entry']() : m['app.entries.entries']()}`}
	>
		{#if app.entries.length === 0}
			<div class="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
				<p class="text-h3 lowercase">{m['app.entries.noEntries']()}</p>
				<p class="text-h3">{m['app.entries.noEntriesEmoji']()}</p>
				<Button class="mt-2 lowercase" href="/new">{m['app.entries.beginStory']()}</Button>
			</div>
		{:else}
			<ScrollArea class="min-h-0 flex-1">
				<div class="mr-3 space-y-2">
					{#each app.entries as entry (entry.id)}
						<EntryCard {entry} />
					{/each}
				</div>
			</ScrollArea>
		{/if}
	</AppPage>
{/if}
