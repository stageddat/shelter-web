<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		description?: string;
		children: Snippet;
	}
	let { label, description, children }: Props = $props();
</script>

<div class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
	<div class="min-w-0">
		<p class="lowercase">{label}</p>
		{#if description}
			<p class="text-sm text-muted-foreground lowercase">{description}</p>
		{/if}
	</div>
	{@render children()}
</div>
