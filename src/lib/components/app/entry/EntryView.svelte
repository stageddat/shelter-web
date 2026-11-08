<script lang="ts">
	import Editor from '$lib/components/app/editor/Editor.svelte';
	import { Button } from 'shelter-assets';
	import { getAuthContext } from '$lib/contexts/auth.context.svelte';
	import { getAppContext } from '$lib/contexts/app.context.svelte';
	import { ArrowLeft, Pencil, X, Check } from '@lucide/svelte';
	import { updateEntry, type DecryptedEntry } from '$lib/services/app/entry.service';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		entry: DecryptedEntry;
	}

	let { entry: initialEntry }: Props = $props();

	const { masterKey } = getAuthContext();
	const { refreshEntries } = getAppContext();

	let isEditing = $state(false);
	let title = $state('');
	let displayedEntry = $state<DecryptedEntry | null>(null);
	let currentContent = $state('');
	let editorRef = $state<Editor | null>(null);
	let wordCount = $state(0);
	let charCount = $state(0);

	$effect(() => {
		title = initialEntry.title;
		displayedEntry = initialEntry;
		currentContent = initialEntry.content ?? '';
		wordCount = initialEntry.wordCount ?? 0;
		charCount = initialEntry.charCount ?? 0;
	});

	const handleSave = async () => {
		if (!masterKey || !displayedEntry) return;
		await updateEntry(initialEntry.id, masterKey, title, currentContent, wordCount, charCount);
		await refreshEntries();
		displayedEntry = {
			...displayedEntry,
			title,
			content: currentContent,
			updatedAt: new Date().toISOString()
		};
		isEditing = false;
	};

	const handleCancel = () => {
		if (!displayedEntry) return;
		title = displayedEntry.title;
		currentContent = displayedEntry.content ?? '';
		editorRef?.resetContent(displayedEntry.content ?? '');
		isEditing = false;
	};
</script>

<div class="flex items-center justify-between">
	<Button variant="ghost" class="-ml-2.5" href={resolve('/entries')}>
		<ArrowLeft data-icon="inline-start" class="translate-y-px" />
		{m['app.sidebar.nav.entries']()}
	</Button>

	{#if isEditing}
		<div class="flex gap-2">
			<Button variant="ghost" onclick={handleCancel} size="icon" class="rounded-full">
				<X class="stroke-3" />
			</Button>
			<Button variant="default" onclick={handleSave} size="icon" class="rounded-full">
				<Check class="stroke-3" />
			</Button>
		</div>
	{:else}
		<Button variant="default" onclick={() => (isEditing = true)} size="icon" class="rounded-full">
			<Pencil class="stroke-3" />
		</Button>
	{/if}
</div>

<input
	placeholder="untitled entry"
	type="text"
	value={title}
	disabled={!isEditing}
	oninput={(e) => (title = e.currentTarget.value)}
	class="w-full border-b bg-transparent pb-1 text-h3 outline-none placeholder:text-muted-foreground focus:border-primary"
/>

<div class="flex min-h-0 flex-1 flex-col rounded-xl border py-2">
	{#if displayedEntry}
		<Editor
			bind:this={editorRef}
			initialContent={displayedEntry.content ?? ''}
			editable={isEditing}
			onChange={(json) => (currentContent = json)}
			date={displayedEntry.date}
			time={displayedEntry.time}
			onCountChange={(w, c) => {
				wordCount = w;
				charCount = c;
			}}
			onEmptyChange={(isEmpty) => {
				if (isEmpty) {
					isEditing = true;
				}
			}}
		/>
	{/if}
</div>
