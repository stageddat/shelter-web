<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { cn } from '$lib/utils';
	import {
		BookOpen,
		// Calendar,
		// ChartNoAxesColumn,
		House,
		Plus,
		Search,
		Settings
	} from '@lucide/svelte';
	import { Button } from 'shelter-assets';

	type NavLink = {
		href: string;
		label: string;
		icon: typeof House;
		desktopHref?: string;
	};

	// para esconder el navbar en configuración
	let inSettings = $derived(page.url.pathname.startsWith('/settings/'));

	const links: NavLink[] = [
		{ href: '/', label: m['app.sidebar.nav.home'](), icon: House },
		{ href: '/entries', label: m['app.sidebar.nav.entries'](), icon: BookOpen },
		// { href: '/calendar', label: 'calendar', icon: Calendar },
		// { href: '/stats', label: 'stats', icon: ChartNoAxesColumn },
		{ href: '/search', label: m['app.sidebar.nav.search'](), icon: Search },
		{
			href: '/settings',
			label: m['app.sidebar.nav.settings'](),
			icon: Settings,
			desktopHref: '/settings/general'
		}
	];

	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<!-- pc sidebar -->
<aside
	class="hidden h-screen w-72 flex-col gap-6 overflow-hidden border-r bg-sidebar p-4 text-sidebar-foreground lg:flex"
>
	<!-- logo -->
	<a href="/" class="block px-2.5">
		<span class="block text-h1">shelter</span>
		<!-- <span class="block text-muted-foreground">{m['app.sidebar.tagline']()}</span> -->
	</a>

	<!-- links -->
	<nav class="flex flex-col">
		{#each links as { href, label, icon: Icon, desktopHref } (href)}
			{@const active = isActive(href)}
			<Button
				variant="ghost"
				class={cn(
					'w-full justify-start p-0 text-lg font-light tracking-wide',
					active && 'font-semibold'
				)}
				href={desktopHref ?? href}
				aria-current={active ? 'page' : undefined}
			>
				<Icon data-icon="inline-start" class={cn(active && 'stroke-[2.5]')} />
				{label}
			</Button>
		{/each}
	</nav>

	<!-- new entry -->
	<Button class="mt-auto w-full lowercase" href="/new">{m['app.sidebar.newEntry']()}</Button>
</aside>

{#snippet mobileLink({ href, label, icon: Icon }: NavLink)}
	{@const active = isActive(href)}
	<a
		{href}
		class={cn(
			'flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-muted-foreground transition-colors',
			active && 'text-foreground'
		)}
		aria-current={active ? 'page' : undefined}
	>
		<Icon class={cn('size-5', active && 'stroke-[2.5]')} />
		<span class="text-xs lowercase">{label}</span>
	</a>
{/snippet}

<!-- mobile bottom nav -->
<nav
	class={cn(
		'fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center justify-around border-t bg-card/80 px-2 backdrop-blur-md lg:hidden',
		inSettings && 'hidden'
	)}
>
	{#each links.slice(0, 2) as link (link.href)}
		{@render mobileLink(link)}
	{/each}

	<!-- boton del medio, nueva entrada -->
	<Button
		size="icon-lg"
		class="-mt-2 rounded-full shadow-md"
		href="/new"
		aria-label={m['app.sidebar.newEntry']()}
	>
		<Plus class="size-5" />
	</Button>

	{#each links.slice(2) as link (link.href)}
		{@render mobileLink(link)}
	{/each}
</nav>
