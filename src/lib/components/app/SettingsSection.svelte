<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		children: Snippet;
	}
	let { title, subtitle, children }: Props = $props();
</script>

<section>
	<h3 class="mb-2 tracking-widest uppercase">{title}</h3>
	{#if subtitle}
		<p class="mb-4 text-muted-foreground lowercase">{subtitle}</p>
	{/if}
	<!-- las filas de SettingsRow se separan solas con una linea -->
	<div class="flex flex-col divide-y divide-border/50">
		{@render children()}
	</div>
</section>
