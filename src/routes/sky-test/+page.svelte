<script lang="ts">
	import { ThemeSelector } from 'shelter-assets';

	// ruta temporal para probar el cielo en degradado de cada tema
	const variants = [
		{ id: 'flat', label: 'flat (now)' },
		{ id: 'subtle', label: 'subtle' },
		{ id: 'sky', label: 'sky + horizon' },
		{ id: 'glow', label: 'warm glow' }
	] as const;

	let variant = $state<(typeof variants)[number]['id']>('sky');
</script>

<svelte:head>
	<title>sky test</title>
</svelte:head>

<div class="scene px-4 py-8 sm:px-8 sm:py-16" data-variant={variant}>
	<div class="toolbar">
		{#each variants as v (v.id)}
			<button
				class="rounded-md border px-3 py-1 text-sm {variant === v.id
					? 'bg-primary text-primary-foreground'
					: 'bg-card'}"
				onclick={() => (variant = v.id)}
			>
				{v.label}
			</button>
		{/each}
		<ThemeSelector label="theme" />
	</div>

	<!-- caja vacía con el mismo tamaño que la tarjeta de signup -->
	<div
		class="fake-card w-full max-w-md sm:max-w-lg sm:rounded-xl sm:border sm:bg-card sm:shadow-lg lg:max-w-xl"
	></div>
</div>

<style>
	/* light: beige cálido */
	:global(:root) {
		--sky-subtle-top: oklch(93% 0.03 75);
		--sky-subtle-bottom: var(--background);
		--sky-top: oklch(90% 0.035 230);
		--sky-bottom: oklch(95% 0.035 70);
		--glow-top: var(--background);
		--glow-bottom: oklch(90% 0.06 60);
	}

	/* dark: flexoki */
	:global(.dark) {
		--sky-subtle-top: oklch(20% 0.015 260);
		--sky-subtle-bottom: var(--background);
		--sky-top: oklch(17% 0.035 265);
		--sky-bottom: oklch(23% 0.03 45);
		--glow-top: var(--background);
		--glow-bottom: oklch(26% 0.05 50);
	}

	/* mocha lavender */
	:global([data-theme='mocha-lavender']) {
		--sky-subtle-top: oklch(20% 0.035 284);
		--sky-subtle-bottom: var(--background);
		--sky-top: oklch(18% 0.045 278);
		--sky-bottom: oklch(29% 0.05 320);
		--glow-top: var(--background);
		--glow-bottom: oklch(32% 0.06 300);
	}

	.toolbar {
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	/* alto medido de la tarjeta real de signup */
	.fake-card {
		height: 508px;
		flex-shrink: 0;
	}

	.scene {
		display: flex;
		min-height: 100dvh;
		align-items: center;
		justify-content: center;
		background: var(--background);
	}

	.scene[data-variant='subtle'] {
		background: linear-gradient(var(--sky-subtle-top), var(--sky-subtle-bottom));
	}

	.scene[data-variant='sky'] {
		background: linear-gradient(var(--sky-top), var(--sky-bottom));
	}

	.scene[data-variant='glow'] {
		background: linear-gradient(var(--glow-top) 40%, var(--glow-bottom));
	}
</style>
