<!--
oh, hi there, looking around the code?

looks like there's nothing here :p, only you and me i guess,
well, i think i'm a useless page lost in the void of this app.

before you leave me alone in the dark, i would like to ask you something.
do you like this project? my creator put a lot of effort into it :3

...but this code sucks to be honest hahaha, my creator was a noob when
he made this, so please forgive him ;), i hope he gets better one day.

also ehmmm, i think i am an easter egg :3, so congrats on finding me!
lemme tell you a secret as a reward, did you know my creator is scared of spiders :D

muehehehe, now you must keep the secret!!
it would be a shame for my creator if this app ever gets popular
and everyone finds out :3

...although, between us, he'd also like the app to be used
by people who appreciate the project he started.
that would make him very happy :)

oh yea, this is beastie, say hi to beastie! isn't he a cutie?
⠀⠀⠀⠀⠀⠀⢀⡤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡏⠀⠀⠈⠳⣄⠀⠀⠀⠀⠀⣀⠴⠋⠉⠉⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠈⠉⠉⠙⠓⠚⠁⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣄⠀⠀⠀⠀
⠀⠀⠀⠀⡞⠀⠀⠀⠀⠀⠶⠀⠀⠀⠀⠀⠀⠶⠀⠀⠀⠀⠀⠸⡆⠀⠀⠀
⢠⣤⣶⣾⣧⣤⣤⣀⡀⠀⠀⠀⠀⠈⠀⠀⠀⢀⡤⠴⠶⠤⢤⡀⣧⣀⣀⠀
⠻⠶⣾⠁⠀⠀⠀⠀⠙⣆⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⢹⣿⣭⣽⠇
⠀⠀⠙⠤⠴⢤⡤⠤⠤⠋⠉⠉⠉⠉⠉⠉⠉⠳⠖⠦⠤⠶⠦⠞⠁⠀⠀⠀

...

ANYWAYS, i don't want to bother you more,
so have a nice day and bye bye!
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import settingsCategories from '$lib/types/app/settingsCategories';
	import { ChevronRight } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';

	const categoryLabels = $derived({
		general: {
			title: m['app.settings.general.title'](),
			description: m['app.settings.general.description']()
		},
		security: {
			title: m['app.settings.security.title'](),
			description: m['app.settings.security.description']()
		},
		editor: {
			title: m['app.settings.editor.title'](),
			description: m['app.settings.editor.description']()
		},
		data: {
			title: m['app.settings.data.title'](),
			description: m['app.settings.data.description']()
		},
		about: {
			title: m['app.settings.about.title'](),
			description: m['app.settings.about.description']()
		}
	});
</script>

<!--
		en pc redirige a settings/general,
    esta página es solo para móvil -->

<div class="flex flex-col px-4 py-6 lg:hidden">
	<h2 class="mb-6 text-3xl font-bold tracking-wide lowercase">{m['app.settings.title']()}</h2>
	<div class="flex flex-col gap-1">
		{#each settingsCategories as category (category.id)}
			<button
				onclick={() => goto(`/settings/${category.id}`)}
				class="flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors hover:bg-muted"
			>
				<div class="rounded-xl bg-muted p-2.5">
					<category.icon class="h-5 w-5" />
				</div>
				<div class="flex-1">
					<p class="text-lg font-semibold tracking-wide lowercase">
						{categoryLabels[category.id as keyof typeof categoryLabels]?.title}
					</p>
					<p class="text-sm tracking-wide opacity-60">
						{categoryLabels[category.id as keyof typeof categoryLabels]?.description}
					</p>
				</div>
				<ChevronRight class="h-4 w-4 opacity-40" />
			</button>
		{/each}
	</div>
</div>
