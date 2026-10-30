<script lang="ts">
	import { Button, InputGroup, InputGroupAddon, InputGroupInput } from 'shelter-assets';
	import { Label } from 'shelter-assets/interactive';
	import Lock from '@lucide/svelte/icons/lock';
	import PasswordVisibilityButton from '$lib/components/shared/PasswordVisibilityButton.svelte';
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
	<main class="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
		<!-- en movil sin tarjeta: el formulario ocupa la pantalla -->
		<div
			class="w-full max-w-md sm:max-w-lg sm:rounded-xl sm:border sm:bg-card sm:px-8 sm:py-6 sm:shadow-lg lg:max-w-xl"
		>
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
		</div>
	</main>
{/if}
