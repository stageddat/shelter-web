<script lang="ts">
	import { InputGroup, InputGroupAddon, InputGroupInput } from 'shelter-assets';
	import { Label } from 'shelter-assets/interactive';
	import PasswordVisibilityButton from '$lib/components/shared/PasswordVisibilityButton.svelte';
	import { type FormFieldConfig } from '$lib/constants/signup/formFields';

	interface FormFieldProps {
		field: FormFieldConfig;
		value: string;
		onChange: (e: Event & { currentTarget: HTMLInputElement }) => void;
		error?: string;
		disabled?: boolean;
	}

	let { field, value, onChange, error, disabled = false }: FormFieldProps = $props();

	const Icon = $derived(field.icon);
	let passwordVisible = $state(false);

	const isPassword = $derived(field.type === 'password');
	// el error sustituye a la ayuda mientras se muestra
	const messageId = $derived(
		error ? `${field.id}-error` : field.hint ? `${field.id}-hint` : undefined
	);
</script>

<div class="space-y-2">
	<Label for={field.id}>
		{field.label}
	</Label>

	<InputGroup>
		<InputGroupInput
			type={isPassword && passwordVisible ? 'text' : field.type}
			autocomplete={field.autocomplete}
			id={field.id}
			name={field.name}
			value={value ?? ''}
			oninput={onChange}
			placeholder={field.placeholder}
			aria-invalid={error ? true : undefined}
			aria-describedby={messageId}
			required
			{disabled}
		/>

		<InputGroupAddon>
			<Icon />
		</InputGroupAddon>

		{#if isPassword}
			<PasswordVisibilityButton bind:visible={passwordVisible} />
		{/if}
	</InputGroup>

	{#if error}
		<p id={messageId} class="text-sm text-destructive-text">{error}</p>
	{:else if field.hint}
		<p id={messageId} class="text-sm text-muted-foreground">{field.hint}</p>
	{/if}
</div>
