<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		title: string;
		subtitle?: string;
		class?: string;
		children: Snippet;
	}
	let { title, subtitle, class: className, children }: Props = $props();
</script>

<!--	padding comun de las paginas de la app + titulo -->
<div class={cn('flex min-h-full flex-col gap-6 px-5 py-6 lg:px-12 lg:pt-4 lg:pb-9', className)}>
	<header class="shrink-0">
		<h1 class="text-pretty">{title}</h1>
		{#if subtitle}
			<p class="text-muted-foreground">{subtitle}</p>
		{/if}
	</header>
	{@render children()}
</div>
