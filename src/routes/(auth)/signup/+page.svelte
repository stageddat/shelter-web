<script lang="ts">
	import { useSignup } from '$lib/hooks/signup/useSignup.svelte';
	import { formFields } from '$lib/constants/signup/formFields';
	import FormField from '$lib/components/signup/FormField.svelte';
	import { Button } from 'shelter-assets';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';

	const signup = useSignup();
</script>

<svelte:head>
	<title>{m['metadata.signup.title']()}</title>
</svelte:head>

{#if signup.isChecking}
	<!-- add loading? -->
	<!-- <div class="flex min-h-screen items-center justify-center">
		<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
	</div> -->
	<div></div>
{:else}
	<main class="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
		<!-- en movil sin tarjeta: el formulario ocupa la pantalla -->
		<div
			class="w-full max-w-md sm:max-w-lg sm:rounded-xl sm:border sm:bg-card sm:px-8 sm:py-6 sm:shadow-lg lg:max-w-xl"
		>
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
							value={signup.formData[field.id]}
							onChange={signup.handleChange}
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
				<Button type="submit" class="w-full" loading={signup.isLoading}>
					{signup.isLoading ? m['signup.button.loading']() : m['signup.button.default']()}
				</Button>
			</form>

			<p class="mt-4 text-center text-muted-foreground">
				{m['signup.alreadyHaveDiary']()}
				<a class="link" href={resolve('/restore')}>{m['signup.restoreDiary']()}</a>
			</p>
		</div>
	</main>
{/if}
