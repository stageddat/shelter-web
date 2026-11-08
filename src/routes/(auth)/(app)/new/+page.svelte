<script lang="ts">
	import AppPage from '$lib/components/app/AppPage.svelte';
	import { ArrowLeft, Check, X } from '@lucide/svelte';
	import { Button } from 'shelter-assets';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Editor from '$lib/components/app/editor/Editor.svelte';
	import { useCreateEntry } from '$lib/hooks/app/useCreateEntry.svelte';
	import { m } from '$lib/paraglide/messages';

	const entry = useCreateEntry();

	let contentRef = $state('');
	let isEditorEmpty = $state(true);
	let wordCount = $state(0);
	let charCount = $state(0);

	async function handleSaveAndRedirect() {
		try {
			const entryId = await entry.handleSave(contentRef, wordCount, charCount);
			if (entryId) {
				const resolved = resolve('/(auth)/(app)/entries/[id]', { id: entryId });
				goto(resolved, { replaceState: true });
			}
		} catch (err) {
			console.error('failed to save entry:', err);
		}
	}
</script>

<svelte:head>
	<title>{m['metadata.new.title']()}</title>
</svelte:head>

<AppPage class="h-full gap-4">
	<div class="flex items-center justify-between">
		<Button variant="ghost" class="-ml-2.5 lowercase" href={resolve('/')}>
			<ArrowLeft data-icon="inline-start" class="translate-y-px" />
			{m['app.sidebar.nav.home']()}
		</Button>

		<div class="flex gap-2">
			<Button variant="ghost" onclick={() => history.back()} size="icon" class="rounded-full">
				<X class="stroke-3" />
			</Button>
			<Button
				variant="default"
				onclick={handleSaveAndRedirect}
				disabled={entry.isSaving || !entry.title || isEditorEmpty}
				size="icon"
				class="rounded-full"
			>
				<Check class="stroke-3" />
			</Button>
		</div>
	</div>

	<input
		placeholder="untitled entry"
		type="text"
		value={entry.title}
		oninput={(e) => (entry.title = e.currentTarget.value)}
		class="w-full border-b bg-transparent pb-1 text-h3 outline-none placeholder:text-muted-foreground focus:border-primary"
	/>

	<div class="flex min-h-0 flex-1 flex-col rounded-xl border py-2">
		<Editor
			initialContent=""
			editable={true}
			onChange={(json) => (contentRef = json)}
			onEmptyChange={(isEmpty) => (isEditorEmpty = isEmpty)}
			onCountChange={(w, c) => {
				wordCount = w;
				charCount = c;
			}}
		/>
	</div>
</AppPage>
