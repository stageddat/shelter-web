import { type RegisterInput } from '$lib/schemas/register.schema';
import User from '@lucide/svelte/icons/user';
import Lock from '@lucide/svelte/icons/lock';
import { type LucideIcon } from '@lucide/svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { m } from '$lib/paraglide/messages';

export interface FormFieldConfig {
	id: keyof RegisterInput;
	autocomplete?: HTMLInputAttributes['autocomplete'];
	name: string;
	label: string;
	type: string;
	placeholder?: string;
	icon: LucideIcon;
	hint?: string;
}

export const formFields: FormFieldConfig[] = [
	{
		id: 'username',
		autocomplete: 'username',
		name: 'username',
		label: m['signup.form.username.label'](),
		type: 'text',
		placeholder: m['signup.form.username.placeholder'](),
		icon: User
		// hint: m['signup.form.username.tooltip']()
	},
	{
		id: 'password',
		autocomplete: 'new-password',
		name: 'password',
		label: m['signup.form.password.label'](),
		type: 'password',
		placeholder: m['signup.form.password.placeholder'](),
		icon: Lock,
		hint: m['signup.form.password.hint']()
	},
	{
		id: 'password2',
		autocomplete: 'new-password',
		name: 'password2',
		label: m['signup.form.passwordRepeat.label'](),
		type: 'password',
		placeholder: m['signup.form.passwordRepeat.placeholder'](),
		icon: Lock
	}
];
