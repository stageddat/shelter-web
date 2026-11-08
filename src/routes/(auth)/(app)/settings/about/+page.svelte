<script lang="ts">
	import packageJson from '$lib/../../package.json';
	import SettingsPageHeader from '$lib/components/app/SettingsPageHeader.svelte';
	import SettingsSection from '$lib/components/app/SettingsSection.svelte';
	import { m } from '$lib/paraglide/messages';
	import { landingUrl } from '$lib/utils/landing';
	import { Bug, Coffee, Globe, HouseHeart, Users } from '@lucide/svelte';
	import { Button } from 'shelter-assets';
</script>

<svelte:head>
	<title>{m['metadata.settings_about.title']()}</title>
</svelte:head>

<SettingsPageHeader
	title={m['app.settings.about.title']()}
	description={m['app.settings.about.description']()}
/>

<SettingsSection title={m['app.settings.about.whatIs.title']()}>
	<p class="lowercase">{m['app.settings.about.whatIs.description']()}</p>
</SettingsSection>

<SettingsSection title={m['app.settings.about.info.title']()}>
	<div class="flex flex-col gap-1">
		<p class="lowercase">
			{m['app.settings.about.info.version']()}
			<span class="text-muted-foreground">{packageJson.version}</span>
		</p>
		<p class="lowercase">
			{m['app.settings.about.info.source']()}
			<a
				href="https://github.com/Stageddat/shelter-web"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
			>
				github.com/Stageddat/shelter-web
			</a>
		</p>
		<p class="lowercase">
			{m['app.settings.about.info.website']()}
			<a
				href={landingUrl()}
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
			>
				shelter.cat
			</a>
		</p>
		<p>
			{m['app.settings.about.info.license']()}
			<a
				href="https://github.com/Stageddat/shelter-web/blob/main/LICENSE"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
			>
				GNU AFFERO GENERAL PUBLIC LICENSE v3.0
			</a>
		</p>
		<p class="lowercase">
			{m['app.settings.about.info.translations']()}
			<a
				href="https://i18n.stageddat.dev/projects/shelter-web/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
			>
				{m['app.settings.about.info.translationsLink']()}
			</a>
		</p>
	</div>
</SettingsSection>

<SettingsSection title={m['app.settings.about.credits.title']()}>
	<div>
		<p class="mb-4 lowercase">{m['app.settings.about.credits.description']()}</p>
		<Button
			variant="outline"
			class="w-full justify-between lowercase"
			href={landingUrl('/credits')}
			target="_blank"
			rel="noopener noreferrer"
		>
			{m['app.settings.about.credits.seeAll']()}
			<Users data-icon="inline-end" />
		</Button>
	</div>
</SettingsSection>

<SettingsSection title={m['app.settings.about.links.title']()}>
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
		<Button
			variant="outline"
			class="lowercase"
			href="https://github.com/Stageddat/shelter-web/issues"
			target="_blank"
			rel="noopener noreferrer"
		>
			<Bug data-icon="inline-start" class="translate-y-px" />
			{m['app.settings.about.links.reportBug']()}
		</Button>
		<Button
			variant="outline"
			class="lowercase"
			href="https://discord.gg/BntK5GbF2M"
			target="_blank"
			rel="noopener noreferrer"
		>
			<HouseHeart data-icon="inline-start" class="translate-y-px" />
			{m['app.settings.about.links.discord']()}
		</Button>
		<Button
			variant="outline"
			class="lowercase"
			href="https://ko-fi.com/stageddat"
			target="_blank"
			rel="noopener noreferrer"
		>
			<Coffee data-icon="inline-start" class="translate-y-px" />
			{m['app.settings.about.links.kofi']()}
		</Button>
		<Button
			variant="outline"
			class="lowercase"
			href="https://github.com/Stageddat/shelter-web/blob/main/CONTRIBUTING.md"
			target="_blank"
			rel="noopener noreferrer"
		>
			<Globe data-icon="inline-start" class="translate-y-px" />
			{m['app.settings.about.links.translate']()}
		</Button>
	</div>
</SettingsSection>
