<script lang="ts">
	import { Button, InputGroup, InputGroupAddon, InputGroupInput } from 'shelter-assets';
	import { Label } from 'shelter-assets/interactive';
	import Lock from '@lucide/svelte/icons/lock';
	import PasswordVisibilityButton from '$lib/components/shared/PasswordVisibilityButton.svelte';
	import AuthCard from '$lib/components/shared/AuthCard.svelte';
	import { m } from '$lib/paraglide/messages';
	import { useLogin } from '$lib/hooks/login/useLogin.svelte';

	const login = useLogin();
	let passwordVisible = $state(false);

	function onFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		login.handleSubmit();
	}
</script>

<svelte:head>
	<title>{m['metadata.login.title']()}</title>
</svelte:head>

{#if login.username}
	<AuthCard>
		<form onsubmit={onFormSubmit} class="space-y-6">
			<h1>{m['login.title']({ username: login.username })}</h1>

			<div class="space-y-2">
				<!-- el placeholder ya lo dice: la etiqueta solo para lectores de pantalla -->
				<Label for="password" class="sr-only">{m['login.password.label']()}</Label>
				<InputGroup>
					<InputGroupInput
						type={passwordVisible ? 'text' : 'password'}
						id="password"
						name="password"
						autocomplete="current-password"
						value={login.password}
						oninput={login.handleChange}
						placeholder={m['login.password.placeholder']()}
						aria-invalid={login.error ? true : undefined}
						aria-describedby={login.error ? 'password-error' : undefined}
						required
						disabled={login.isLoading}
					/>
					<InputGroupAddon>
						<Lock />
					</InputGroupAddon>
					<PasswordVisibilityButton bind:visible={passwordVisible} />
				</InputGroup>

				<!-- mostrar error -->
				{#if login.error}
					<p id="password-error" class="text-sm text-destructive-text">{login.error}</p>
				{/if}
			</div>

			<Button type="submit" class="w-full" loading={login.isLoading}>
				{login.isLoading ? m['login.button.loading']() : m['login.button.default']()}
			</Button>
		</form>
	</AuthCard>
{/if}
