<script lang="ts">
	import { getAppContext } from '$lib/contexts/app.context.svelte';
	import { deleteEntry, type DecryptedEntry } from '$lib/services/app/entry.service';
	import { Button } from 'shelter-assets';
	import { Trash } from '@lucide/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		entry: DecryptedEntry;
		class?: string;
		enableDelete?: boolean;
	}
	let { entry, class: className = '', enableDelete = true }: Props = $props();

	const { removeEntry } = getAppContext();
	let showDialog = $state(false);

	async function handleConfirmDelete(id: string) {
		showDialog = false;
		removeEntry(id);
		await deleteEntry(id);
	}
</script>

<AlertDialog.Root bind:open={showDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="text-h3">
				{m['app.entryCard.deleteTitle']({ title: entry.title })}
			</AlertDialog.Title>
			<AlertDialog.Description class="text-base">
				{m['app.entryCard.deleteDescription']()}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{m['app.entryCard.cancel']()}
			</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive" onclick={() => handleConfirmDelete(entry.id)}>
				{m['app.entryCard.delete']()}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<a
	href={resolve(`/entries/${entry.id}`)}
	class="group flex items-center gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/50 {className}"
>
	<div class="min-w-0 flex-1">
		<p class="truncate">{entry.title}</p>
		<p class="text-sm text-muted-foreground">{entry.date} · {entry.time}</p>
	</div>

	{#if enableDelete}
		<!-- en pc, solo aparece al pasar el raton en la tarjeta -->
		<Button
			variant="ghost"
			size="icon"
			class="rounded-full hover:bg-destructive/10 hover:text-destructive-text lg:hidden lg:group-focus-within:inline-flex lg:group-hover:inline-flex"
			aria-label={m['app.entryCard.delete']()}
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				e.preventDefault();
				showDialog = true;
			}}
		>
			<Trash />
		</Button>
	{/if}
</a>
