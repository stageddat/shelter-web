<script lang="ts">
	import { page } from '$app/state';
	import settingsCategories from '$lib/types/app/settingsCategories';
	import { m } from '$lib/paraglide/messages';
	import { cn } from '$lib/utils';
	import { Button } from 'shelter-assets';

	let { children } = $props();

	let activeId = $derived(page.url.pathname.split('/').pop());

	const categoryTitles = $derived({
		general: m['app.settings.general.title'](),
		security: m['app.settings.security.title'](),
		editor: m['app.settings.editor.title'](),
		data: m['app.settings.data.title'](),
		about: m['app.settings.about.title']()
	});
</script>

<svelte:head>
	<title>{m['metadata.settings.title']()}</title>
</svelte:head>

<div class="flex h-screen overflow-hidden">
	<aside class="hidden h-full w-72 flex-col gap-6 overflow-hidden border-r bg-sidebar p-4 lg:flex">
		<h1 class="px-2.5">{m['app.settings.title']()}</h1>

		<!-- mismo estilo de links que el sidebar principal -->
		<nav class="flex flex-col">
			{#each settingsCategories as category (category.id)}
				{@const active = activeId === category.id}
				<Button
					variant="ghost"
					class={cn(
						'w-full justify-start p-0 text-lg font-light tracking-wide',
						active && 'font-semibold'
					)}
					href={`/settings/${category.id}`}
					aria-current={active ? 'page' : undefined}
				>
					<category.icon data-icon="inline-start" class={cn(active && 'stroke-[2.5]')} />
					{categoryTitles[category.id as keyof typeof categoryTitles]}
				</Button>
			{/each}
		</nav>
	</aside>

	<div class="flex-1 overflow-y-auto">
		<!-- padding comun de las paginas; en pc pt-5.75 pone el titulo en la linea base del h1 de al lado -->
		<div class="flex min-h-full flex-col gap-8 px-5 py-6 lg:px-12 lg:pt-5.75 lg:pb-9">
			{@render children?.()}
		</div>
	</div>
</div>
