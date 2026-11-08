<script lang="ts">
	import { exportFullBackup } from '$lib/services/backup/export.service';
	import { checkImportCompatibility, importFullBackup } from '$lib/services/backup/import.service';
	import { purgeAllData } from '$lib/services/app/db.service';
	import { getAuthContext } from '$lib/contexts/auth.context.svelte';
	import { Trash2, FileUp, FileDown } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import SettingsPageHeader from '$lib/components/app/SettingsPageHeader.svelte';
	import SettingsSection from '$lib/components/app/SettingsSection.svelte';
	import { m } from '$lib/paraglide/messages';
	import { Button } from 'shelter-assets';

	const auth = getAuthContext();
	let exporting = $state(false);
	let importing = $state(false);
	let purging = $state(false);
	let fileInput = $state<HTMLInputElement>();

	async function handleExport() {
		exporting = true;
		try {
			const buffer = await exportFullBackup();
			const blob = new Blob([buffer], { type: 'application/octet-stream' });
			const date = new Date().toISOString().slice(0, 16).replace('T', '_');
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = `backup-${date}-${auth.user?.username}.shelter`;
			a.click();
			URL.revokeObjectURL(a.href);
			toast.success('backup exported successfully');
		} catch (err) {
			console.error(err);
			toast.error('failed to export backup :(');
		} finally {
			exporting = false;
		}
	}

	function handleImportClick() {
		const ok = confirm(m['app.settings.data.importExport.importConfirm']());

		if (!ok) return;
		fileInput?.click();
	}

	async function handleImport(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		importing = true;
		try {
			const buffer = await file.arrayBuffer();
			const check = checkImportCompatibility(buffer);
			if (!check.ok) {
				const messages = {
					invalid_file: m['app.settings.data.importExport.importErrors.invalid_file'](),
					corrupted_file: m['app.settings.data.importExport.importErrors.corrupted_file'](),
					format_incompatible:
						m['app.settings.data.importExport.importErrors.format_incompatible'](),
					schema_incompatible:
						m['app.settings.data.importExport.importErrors.schema_incompatible'](),
					export_mode_not_supported:
						m['app.settings.data.importExport.importErrors.export_mode_not_supported']()
				};
				toast.error(messages[check.reason]);
				return;
			}
			if (check.warning === 'backup_from_newer_app') {
				const ok = confirm(m['app.settings.data.importExport.importNewerWarning']());

				if (!ok) return;
			}
			await importFullBackup(buffer);
			window.alert(m['app.settings.data.importExport.importSuccess']());
			toast.success(m['app.settings.data.importExport.importSuccess']());
			setTimeout(() => auth.logout(), 3000);
		} catch (err) {
			console.error(err);
			toast.error(m['app.settings.data.importExport.importError']());
		} finally {
			importing = false;
		}
	}

	async function handlePurge() {
		const ok = confirm(m['app.settings.data.dangerZone.purgeConfirm']());

		if (!ok) return;
		purging = true;
		try {
			await purgeAllData();
			alert(m['app.settings.data.dangerZone.purgeSuccess']());
			auth.logout();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'unknown error');
		} finally {
			purging = false;
		}
	}
</script>

<svelte:head>
	<title>{m['metadata.settings_data.title']()}</title>
</svelte:head>

<input bind:this={fileInput} type="file" accept=".shelter" class="hidden" onchange={handleImport} />

<SettingsPageHeader
	title={m['app.settings.data.title']()}
	description={m['app.settings.data.description']()}
/>

<SettingsSection
	title={m['app.settings.data.importExport.title']()}
	subtitle={m['app.settings.data.importExport.subtitle']()}
>
	<div class="flex w-full flex-col gap-4 lg:flex-row">
		<div class="flex w-full flex-col rounded-xl border p-5 lg:w-1/2">
			<h4 class="mb-1 lowercase">{m['app.settings.data.importExport.exportTitle']()}</h4>
			<p class="mb-6 text-muted-foreground lowercase">
				{m['app.settings.data.importExport.exportDescription']()}
			</p>
			<Button class="mt-auto w-full" onclick={handleExport} disabled={exporting}>
				<FileDown data-icon="inline-start" />
				{exporting
					? m['app.settings.data.importExport.exportingButton']()
					: m['app.settings.data.importExport.exportButton']()}
			</Button>
		</div>
		<div class="flex w-full flex-col rounded-xl border p-5 lg:w-1/2">
			<h4 class="mb-1 lowercase">{m['app.settings.data.importExport.importTitle']()}</h4>
			<p class="mb-6 text-muted-foreground lowercase">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html m['app.settings.data.importExport.importDescription']()}
			</p>
			<Button class="mt-auto w-full" onclick={handleImportClick} disabled={importing}>
				<FileUp data-icon="inline-start" />
				{importing
					? m['app.settings.data.importExport.importingButton']()
					: m['app.settings.data.importExport.importButton']()}
			</Button>
		</div>
	</div>
</SettingsSection>

<SettingsSection
	title={m['app.settings.data.dangerZone.title']()}
	subtitle={m['app.settings.data.dangerZone.subtitle']()}
>
	<div
		class="flex flex-col gap-4 rounded-xl border border-destructive/20 p-5 lg:flex-row lg:items-center lg:justify-between"
	>
		<p class="text-destructive-text lowercase">
			{m['app.settings.data.dangerZone.description']()}
		</p>
		<Button class="w-full lg:w-auto" onclick={handlePurge} disabled={purging} variant="destructive">
			<Trash2 data-icon="inline-start" />
			{purging
				? m['app.settings.data.dangerZone.purgingButton']()
				: m['app.settings.data.dangerZone.purgeButton']()}
		</Button>
	</div>
</SettingsSection>
