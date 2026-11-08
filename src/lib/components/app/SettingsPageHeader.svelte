<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from '@lucide/svelte';

	interface Props {
		title: string;
		description?: string;
	}
	let { title, description }: Props = $props();
</script>

<!-- mobile, boton volver -->
<div class="mb-4 flex items-center gap-3 lg:hidden">
	<button
		onclick={() => goto('/settings')}
		class="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
	>
		<ArrowLeft class="size-5" />
		<span>settings</span>
	</button>
</div>

<!-- pc, solo titulo -->
<div>
	<h2 class="mb-1 font-semibold tracking-wide lowercase">{title}</h2>
	{#if description}
		<p class="text-muted-foreground lowercase">{description}</p>
	{/if}
</div>
