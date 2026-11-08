<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */

	import { getAuthContext } from '$lib/contexts/auth.context.svelte';
	import { Check } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants, Input } from 'shelter-assets';
	import { Label } from 'shelter-assets/interactive';
	import { changePassword } from '$lib/services/auth/changePassword.service';
	import { toast } from 'svelte-sonner';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	const auth = getAuthContext();

	// change password
	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let passwordLoading = $state(false);
	let showChangePassword = $state(false);
	// let passwordSuccess = $state(false);

	async function handleChangePassword() {
		passwordError = '';
		passwordLoading = true;
		// passwordSuccess = false;

		try {
			if (!auth.masterKey) throw new Error('not authenticated');
			await changePassword({
				oldPassword,
				newPassword,
				newPasswordConfirmation: confirmPassword,
				masterKey: auth.masterKey
			});
			// passwordSuccess = true;
			oldPassword = '';
			newPassword = '';
			confirmPassword = '';
			toast.success('password changed successfully');
			showChangePassword = false;
		} catch (err) {
			passwordError = err instanceof Error ? err.message : 'failed to change password';
		} finally {
			passwordLoading = false;
		}
	}

	// auto lock
	import { getAutoLockMinutes, setAutoLockMinutes } from '$lib/hooks/app/useAutoLock.svelte';

	const LOCK_OPTIONS = $derived([
		{ label: m['app.settings.security.options.lockOptions.never'](), value: 0 },
		{ label: m['app.settings.security.options.lockOptions.1min'](), value: 1 },
		{ label: m['app.settings.security.options.lockOptions.5min'](), value: 5 },
		{ label: m['app.settings.security.options.lockOptions.15min'](), value: 15 },
		{ label: m['app.settings.security.options.lockOptions.30min'](), value: 30 },
		{ label: m['app.settings.security.options.lockOptions.1hour'](), value: 60 }
	]);
	let selected = $state(getAutoLockMinutes());

	function handleSelect(value: number) {
		selected = value;
		auth.autoLockMinutes = value;
		setAutoLockMinutes(value);
	}

	import {
		generateRecoveryFile,
		downloadRecoveryFile
	} from '$lib/services/auth/recoveryKey.service';
	import SettingsPageHeader from '$lib/components/app/SettingsPageHeader.svelte';
	import SettingsRow from '$lib/components/app/SettingsRow.svelte';
	import SettingsSection from '$lib/components/app/SettingsSection.svelte';
	import { m } from '$lib/paraglide/messages';

	let showRecoveryKey = $state(false);
	let recoveryPhrase = $state('');
	let recoveryLoading = $state(false);
	let recoveryStep = $state<'generate' | 'show'>('generate');

	async function handleGenerateKeyFile() {
		if (!auth.masterKey || !auth.user) return;
		recoveryLoading = true;
		try {
			const phrase = await generateRecoveryFile(auth.masterKey);
			downloadRecoveryFile(phrase, auth.user.username);
			recoveryPhrase = phrase;
			recoveryStep = 'show';
		} catch (err) {
			console.error(err);
			toast.error('failed to generate recovery key');
		} finally {
			recoveryLoading = false;
		}
	}

	function handleCloseRecovery() {
		showRecoveryKey = false;
		recoveryPhrase = '';
		recoveryStep = 'generate';
	}
</script>

<svelte:head>
	<title>{m['metadata.settings_security.title']()}</title>
</svelte:head>

<SettingsPageHeader
	title={m['app.settings.security.title']()}
	description={m['app.settings.security.description']()}
/>

<SettingsSection title={m['app.settings.security.options.title']()}>
	<!-- change password -->
	<SettingsRow
		label={m['app.settings.security.options.changePassword']()}
		description={m['app.settings.security.options.changePasswordDescription']()}
	>
		<Dialog.Root bind:open={showChangePassword}>
			<form>
				<Dialog.Trigger type="button" class={buttonVariants({ variant: 'outline' })}>
					{m['app.settings.security.options.changePasswordButton']()}
				</Dialog.Trigger>
				<Dialog.Content class="w-[90vw] sm:max-w-106.25">
					<Dialog.Header class="gap-0.5!">
						<Dialog.Title class="text-h3"
							>{m['app.settings.security.options.changePasswordDialogTitle']()}</Dialog.Title
						>
						<Dialog.Description class="text-base"
							>{m[
								'app.settings.security.options.changePasswordDialogDescription'
							]()}</Dialog.Description
						>
					</Dialog.Header>
					<div class="grid gap-1">
						<div class="grid gap-1">
							<Label for="oldPassword"
								>{m['app.settings.security.options.changePasswordOld']()}</Label
							>
							<Input
								id="oldPassword"
								name="oldPassword"
								autocomplete="current-password"
								bind:value={oldPassword}
								type="password"
							/>
						</div>
						<div class="grid gap-1">
							<Label for="newPassword"
								>{m['app.settings.security.options.changePasswordNew']()}</Label
							>
							<Input
								id="newPassword"
								name="newPassword"
								autocomplete="new-password"
								bind:value={newPassword}
								type="password"
							/>
						</div>
						<div class="grid gap-1">
							<Label for="confirmPassword"
								>{m['app.settings.security.options.changePasswordConfirm']()}</Label
							>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								autocomplete="new-password"
								bind:value={confirmPassword}
								type="password"
							/>
						</div>
						{#if passwordError}
							<p class="text-sm text-destructive">{passwordError}</p>
						{/if}
					</div>
					<Dialog.Footer>
						<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}
							>{m['app.settings.security.options.changePasswordCancel']()}</Dialog.Close
						>
						<Button onclick={handleChangePassword} disabled={passwordLoading} type="submit">
							{passwordLoading
								? m['app.settings.security.options.changePasswordSubmitting']()
								: m['app.settings.security.options.changePasswordSubmit']()}
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</form>
		</Dialog.Root>
	</SettingsRow>

	<!-- auto lock -->
	<SettingsRow
		label={m['app.settings.security.options.autoLock']()}
		description={m['app.settings.security.options.autoLockDescription']()}
	>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline">
						{LOCK_OPTIONS.find((o) => o.value === selected)?.label ??
							m['app.settings.security.options.lockOptions.15min']()}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each LOCK_OPTIONS as option (option.value)}
					<DropdownMenu.Item onclick={() => handleSelect(option.value)} class="text-base">
						<span class="w-4 text-muted-foreground"
							>{#if selected === option.value}<Check />{/if}</span
						>
						{option.label}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</SettingsRow>

	<!-- recovery key -->
	<SettingsRow
		label={m['app.settings.security.options.recoveryKey']()}
		description={m['app.settings.security.options.recoveryKeyDescription']()}
	>
		<Dialog.Root
			bind:open={showRecoveryKey}
			onOpenChange={(o) => {
				if (!o) handleCloseRecovery();
			}}
		>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
				{m['app.settings.security.options.recoveryKeyGenerate']()}
			</Dialog.Trigger>
			<Dialog.Content class="w-[90vw] sm:max-w-lg">
				<Dialog.Header>
					<Dialog.Title class="text-h3"
						>{m['app.settings.security.options.recoveryKeyDialogTitle']()}</Dialog.Title
					>
					<Dialog.Description class="text-base">
						{#if recoveryStep === 'generate'}
							{@html m['app.settings.security.options.recoveryKeyDialogDescriptionGenerate']()}
						{:else}
							{@html m['app.settings.security.options.recoveryKeyDialogDescriptionShow']()}
						{/if}
					</Dialog.Description>
				</Dialog.Header>
				{#if recoveryStep === 'generate'}
					<p class="text-destructive-text">
						{m['app.settings.security.options.recoveryKeyWarning']()}
					</p>
					<Dialog.Footer>
						<Dialog.Close class={buttonVariants({ variant: 'outline' })}
							>{m['app.settings.security.options.recoveryKeyCancel']()}</Dialog.Close
						>
						<Button onclick={handleGenerateKeyFile} disabled={recoveryLoading}>
							{recoveryLoading
								? m['app.settings.security.options.recoveryKeyGenerating']()
								: m['app.settings.security.options.recoveryKeyGenerateDownload']()}
						</Button>
					</Dialog.Footer>
				{:else}
					<div class="rounded-lg border border-border/40 bg-secondary/60 p-4">
						<div class="grid grid-cols-3 gap-2">
							{#each recoveryPhrase.split(' ') as word, i (i)}
								<div class="flex items-center gap-2">
									<span class="text-sm text-muted-foreground select-none">{i + 1}.</span>
									<span class="font-mono">{word}</span>
								</div>
							{/each}
						</div>
					</div>
					<p class="text-muted-foreground">
						{m['app.settings.security.options.recoveryKeyFileDownloaded']()}
					</p>
					<Dialog.Footer>
						<Button onclick={handleCloseRecovery}
							>{m['app.settings.security.options.recoveryKeySaved']()}</Button
						>
					</Dialog.Footer>
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	</SettingsRow>
</SettingsSection>

<!-- info — estos valores son técnicos, los dejo hardcoded salvo los labels -->
<SettingsSection title={m['app.settings.security.info.title']()}>
	<SettingsRow label={m['app.settings.security.info.passwordDerivation']()}>
		PBKDF2 (SHA-256)
	</SettingsRow>
	<SettingsRow label={m['app.settings.security.info.derivationIterations']()}>600,000</SettingsRow>
	<SettingsRow label={m['app.settings.security.info.saltSize']()}>16 bytes</SettingsRow>
	<SettingsRow label={m['app.settings.security.info.encryptionAlgorithm']()}>
		AES-GCM (256 bits)
	</SettingsRow>
	<SettingsRow label={m['app.settings.security.info.iv']()}>12 bytes</SettingsRow>
	<SettingsRow label={m['app.settings.security.info.encryptionArchitecture']()}>
		{m['app.settings.security.info.hybridValue']()}
	</SettingsRow>
</SettingsSection>
