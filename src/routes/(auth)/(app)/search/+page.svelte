<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuthContext } from '$lib/contexts/auth.context.svelte';
	import { getAppContext } from '$lib/contexts/app.context.svelte';
	import { getEntry } from '$lib/services/app/entry.service';
	import { buildSearchIndex, searchEntries } from '$lib/search';
	import type { SearchResult } from 'minisearch';
	import { Search } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';
	import AppPage from '$lib/components/app/AppPage.svelte';
	import { InputGroup, InputGroupAddon, InputGroupInput } from 'shelter-assets';

	const auth = getAuthContext();
	const appContext = getAppContext();

	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		if (!auth?.masterKey || !appContext) {
			isLoading = false;
			return;
		}

		try {
			isLoading = true;
			const fullEntries = await Promise.all(
				appContext.entries.map(async (entry) => {
					if (entry.content !== undefined) return entry;
					return await getEntry(entry.id, auth.masterKey!);
				})
			);

			appContext.entries = fullEntries;
			buildSearchIndex(fullEntries);
		} catch (error) {
			console.error('failed to build search index:', error);
		} finally {
			isLoading = false;
		}
	});

	$effect(() => {
		if (!isLoading) {
			const raw = searchEntries(query);
			results = raw.map((r) => ({
				...r,
				highlightTokens: getHighlightTokens(r.content, query)
			}));
		}
	});

	// i dont understand what the fuck is this shit but it somehow works
	// thanks claude, i hope this works
	function getHighlightTokens(
		plainText: string | undefined,
		searchTerm: string
	): { text: string; highlight: boolean }[] {
		if (!searchTerm.trim() || !plainText) return [];

		try {
			const normalizedText = plainText
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '');
			const normalizedSearch = searchTerm
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '');

			const index = normalizedText.indexOf(normalizedSearch);
			if (index === -1) {
				return [{ text: plainText.slice(0, 120) + '...', highlight: false }];
			}

			const start = Math.max(0, index - 40);
			const end = Math.min(plainText.length, index + searchTerm.length + 80);

			let snippet = plainText.slice(start, end);
			if (start > 0) snippet = '...' + snippet;
			if (end < plainText.length) snippet = snippet + '...';

			const escapedSearch = searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
			const regex = new RegExp(`(${escapedSearch})`, 'gi');
			const parts = snippet.split(regex);

			return parts.map((part) => ({
				text: part,
				highlight: regex.test(part)
			}));
		} catch {
			return [];
		}
	}
</script>

<svelte:head>
	<title>{m['metadata.search.title']()}</title>
</svelte:head>

<AppPage title={m['app.search.title']()}>
	<InputGroup>
		<InputGroupAddon>
			<Search />
		</InputGroupAddon>
		<InputGroupInput
			type="text"
			bind:value={query}
			disabled={isLoading}
			aria-label={m['app.search.title']()}
			placeholder={isLoading ? m['app.search.placeholderLoading']() : m['app.search.placeholder']()}
		/>
	</InputGroup>

	{#if isLoading}
		<p class="animate-pulse text-center text-muted-foreground">
			{m['app.search.preparingEngine']()}
		</p>
	{:else}
		<div class="flex flex-col gap-2">
			{#each results as result, i (i)}
				<div class="flex flex-col gap-2 rounded-xl border p-4">
					<div>
						<p>{result.title}</p>
						<p class="text-sm text-muted-foreground">{result.date}</p>
					</div>

					{#if query.trim() !== ''}
						<p class="rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
							{#each result.highlightTokens as token, i (i)}
								{#if token.highlight}
									<strong class="font-semibold text-foreground">{token.text}</strong>
								{:else}
									{token.text}
								{/if}
							{/each}
						</p>
					{/if}

					<a
						href="/entries/{result.id}"
						class="self-start text-sm underline underline-offset-2 hover:text-muted-foreground"
					>
						{m['app.search.openEntry']()}
					</a>
				</div>
			{:else}
				{#if query.trim() !== ''}
					<p class="py-8 text-center text-muted-foreground">
						{m['app.search.noResults']({ query })}
					</p>
				{/if}
			{/each}
		</div>
	{/if}
</AppPage>
