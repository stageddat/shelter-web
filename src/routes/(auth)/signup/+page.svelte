<script lang="ts">
	import { useSignup } from '$lib/hooks/signup/useSignup.svelte';
	import { formFields } from '$lib/constants/signup/formFields';
	import FormField from '$lib/components/signup/FormField.svelte';
	import AuthCard from '$lib/components/shared/AuthCard.svelte';
	import LoadingText from '$lib/components/shared/LoadingText.svelte';
	import { Button } from 'shelter-assets';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';

	const signup = useSignup();
</script>

<svelte:head>
	<title>{m['metadata.signup.title']()}</title>
</svelte:head>

<!-- no enseñar nada cuando checkea el usuario -->
{#if !signup.isChecking}
	<AuthCard>
		<form onsubmit={signup.handleSubmit} class="space-y-6" novalidate>
			<!-- header -->
			<div class="space-y-1">
				<h1>{m['signup.title']()}</h1>
				<p class="text-lg text-muted-foreground">{m['signup.subtitle']()}</p>
			</div>

			<!-- form -->
			<div class="space-y-4">
				{#each formFields as field (field.id)}
					<FormField
						{field}
						bind:value={signup.formData[field.id]}
						onInput={() => signup.clearError(field.id)}
						error={signup.fieldErrors[field.id]}
						disabled={signup.isLoading}
					/>
				{/each}
			</div>

			<!-- mostrar error -->
			{#if signup.error}
				<p class="text-destructive-text">{signup.error}</p>
			{/if}

			<!-- btn -->
			<!-- sin el spinner de Button: aquí van los tres puntos animados de LoadingText -->
			<Button
				type="submit"
				class="w-full"
				disabled={signup.isLoading}
				aria-busy={signup.isLoading || undefined}
			>
				{#if signup.isLoading}
					<LoadingText text={m['signup.button.loading']()} />
				{:else}
					{m['signup.button.default']()}
				{/if}
			</Button>
		</form>

		<p class="mt-4 text-center text-muted-foreground">
			{m['signup.alreadyHaveDiary']()}
			<a class="link" href={resolve('/restore')}>{m['signup.restoreDiary']()}</a>
		</p>
	</AuthCard>
{/if}
