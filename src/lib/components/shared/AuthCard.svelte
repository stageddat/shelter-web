<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<main class="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
	<!-- en movil sin tarjeta, el formulario ocupa la pantalla -->
	<div
		class="w-full max-w-md sm:max-w-lg sm:rounded-xl sm:border sm:bg-card sm:px-8 sm:py-6 sm:shadow-lg lg:max-w-xl"
	>
		{@render children()}
	</div>
</main>
