<script lang="ts">
	import { getAuthContext } from '$lib/contexts/auth.context.svelte';
	import { Copy, Check, X } from '@lucide/svelte';
	import { updateDisplayName } from '$lib/services/app/user.service';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { onMount } from 'svelte';
	import SettingsPageHeader from '$lib/components/app/SettingsPageHeader.svelte';
	import SettingsRow from '$lib/components/app/SettingsRow.svelte';
	import SettingsSection from '$lib/components/app/SettingsSection.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, isLocale, setLocale } from '$lib/paraglide/runtime';
	import {
		Button,
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput,
		LanguageSelector,
		ThemeSelector,
		type LanguageOption
	} from 'shelter-assets';

	const auth = getAuthContext();

	const languages: LanguageOption[] = [
		{ locale: 'en', label: 'english', official: true },
		{ locale: 'ca', label: 'català', official: true },
		{ locale: 'es', label: 'español', official: false },
		{ locale: 'de', label: 'deutsch', official: false },
		{ locale: 'da', label: 'dansk', official: false },
		{ locale: 'ru', label: 'русский', official: false }
	];

	// copy
	let copied = $state<'username' | 'id' | null>(null);

	function handleCopy(type: 'username' | 'id') {
		const value = type === 'username' ? auth.user?.username : auth.user?.id;
		navigator.clipboard.writeText(value ?? '');
		copied = type;
		setTimeout(() => (copied = null), 2000);
	}

	// display name
	let displayName = $state(auth.user?.displayName ?? auth.user?.username ?? '');

	async function handleSaveDisplayName() {
		if (!auth.user) return;
		if (displayName === auth.user.displayName) return;
		if (displayName.length === 0 || displayName.length > 20) return;
		await updateDisplayName(auth.user.id, displayName.trim());
		displayName = displayName.trim();
		auth.user = { ...auth.user, displayName };
	}

	// toggle analytics
	let analyticsEnabled = $state(false);

	onMount(() => {
		analyticsEnabled = localStorage.getItem('umami.disabled') !== '1';
	});

	function toggleAnalytics(value: boolean) {
		analyticsEnabled = value;
		if (value) {
			localStorage.removeItem('umami.disabled');
		} else {
			localStorage.setItem('umami.disabled', '1');
		}
	}
</script>

<svelte:head>
	<title>{m['metadata.settings_general.title']()}</title>
</svelte:head>

<SettingsPageHeader
	title={m['app.settings.general.title']()}
	description={m['app.settings.general.description']()}
/>

<SettingsSection title={m['app.settings.general.appearance.title']()}>
	<SettingsRow label={m['app.settings.general.appearance.theme']()}>
		<ThemeSelector
			label={m['app.settings.general.appearance.theme']()}
			labels={{
				system: m['app.settings.general.appearance.themes.system'](),
				light: m['app.settings.general.appearance.themes.light'](),
				dark: m['app.settings.general.appearance.themes.dark'](),
				'mocha-lavender': m['app.settings.general.appearance.themes.mochaLavender']()
			}}
		/>
	</SettingsRow>
	<SettingsRow
		label={m['app.settings.general.appearance.language']()}
		description={m['app.settings.general.appearance.languageWarning']()}
	>
		<LanguageSelector
			current={getLocale()}
			{languages}
			// usar onselect en lugar de href para guardar en localStorage
			onselect={(locale) => isLocale(locale) && setLocale(locale)}
			labels={{
				language: m['app.settings.general.appearance.language'](),
				official: m['app.settings.general.appearance.languageGroups.official'](),
				community: m['app.settings.general.appearance.languageGroups.community']()
			}}
		/>
	</SettingsRow>
</SettingsSection>

{#snippet copyButton(type: 'username' | 'id', value?: string)}
	<Button variant="outline" size="sm" class="min-w-0" onclick={() => handleCopy(type)}>
		<span class="max-w-32 truncate font-mono font-normal lg:max-w-none">{value}</span>
		{#if copied === type}<Check data-icon="inline-end" />{:else}<Copy data-icon="inline-end" />{/if}
	</Button>
{/snippet}

<SettingsSection title={m['app.settings.general.user.title']()}>
	<SettingsRow label={m['app.settings.general.user.displayName']()}>
		<InputGroup class="w-40 lg:w-sm">
			<InputGroupInput
				placeholder={m['app.settings.general.user.displayNamePlaceholder']()}
				bind:value={displayName}
				maxlength={20}
			/>
			<InputGroupAddon align="inline-end" class="gap-0">
				{#if displayName !== auth.user?.displayName}
					<InputGroupButton
						variant="ghost"
						onclick={() => (displayName = auth.user?.displayName ?? '')}
						class="p-1! text-red-500 hover:bg-red-500/10 hover:text-red-500 dark:text-red-400 dark:hover:bg-red-400/10"
					>
						<X class="size-5 p-0!" />
					</InputGroupButton>
					<InputGroupButton
						variant="ghost"
						onclick={handleSaveDisplayName}
						class="p-1! text-green-600 hover:bg-green-500/10 hover:text-green-600 dark:text-green-400 dark:hover:bg-green-400/10"
					>
						<Check class="size-5 p-0!" />
					</InputGroupButton>
				{/if}
			</InputGroupAddon>
		</InputGroup>
	</SettingsRow>
	<SettingsRow label={m['app.settings.general.user.username']()}>
		{@render copyButton('username', auth.user?.username)}
	</SettingsRow>
	<SettingsRow label={m['app.settings.general.user.userId']()}>
		{@render copyButton('id', auth.user?.id)}
	</SettingsRow>
</SettingsSection>

<SettingsSection title={m['app.settings.general.privacy.title']()}>
	<SettingsRow
		label={m['app.settings.general.privacy.analytics']()}
		description={m['app.settings.general.privacy.analyticsDescription']()}
	>
		<Switch id="analytics" checked={analyticsEnabled} onCheckedChange={toggleAnalytics} />
	</SettingsRow>
</SettingsSection>
