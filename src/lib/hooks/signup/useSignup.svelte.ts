import { register } from '$lib/services/auth/register.service';
import { getUser, hasExistingUser } from '$lib/services/app/db.service';
import { goto } from '$app/navigation';
import { type RegisterInput, registerSchema } from '$lib/schemas/register.schema';
import { getAuthContext } from '$lib/contexts/auth.context.svelte';
import { resolve } from '$app/paths';
import { m } from '$lib/paraglide/messages';

export function useSignup() {
	const auth = getAuthContext();

	const formData = $state<RegisterInput>({
		username: '',
		password: '',
		password2: ''
	});

	// error general (al crear el diario) y errores de cada campo (validacion)
	let error = $state('');
	let fieldErrors = $state<Partial<Record<keyof RegisterInput, string>>>({});
	let isLoading = $state(false);
	let isChecking = $state(true);

	// formData se rellena con bind:value; al escribir se quitan los errores de ese campo
	const clearError = (field: keyof RegisterInput) => {
		error = '';
		fieldErrors[field] = undefined;
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		error = '';
		fieldErrors = {};
		isLoading = true;

		try {
			const result = await registerSchema.safeParseAsync(formData);

			if (!result.success) {
				// el primer error de cada campo, para mostrarlo debajo de ese campo
				const errors: typeof fieldErrors = {};
				for (const issue of result.error.issues) {
					const field = issue.path[0] as keyof RegisterInput;
					errors[field] ??= issue.message;
				}
				fieldErrors = errors;
				return;
			}

			const { masterKey } = await register(result.data);

			console.log('registration successful!');

			if (auth) {
				auth.masterKey = masterKey;
				const user = await getUser();
				auth.user = user ?? undefined;
			}

			goto(resolve('/'));
		} catch (err) {
			console.error('registration error:', err);
			error = m['signup.error.unexpected']();
		} finally {
			isLoading = false;
		}
	};

	$effect(() => {
		async function checkExistingUser() {
			try {
				const exists = await hasExistingUser();

				if (exists) {
					console.log('User already exists, redirecting to login...');
					goto(resolve('/login'));
					return;
				}
			} catch (err) {
				console.error('error checking user:', err);
			}
			isChecking = false;
		}

		checkExistingUser();
	});

	return {
		get formData() {
			return formData;
		},
		get error() {
			return error;
		},
		get fieldErrors() {
			return fieldErrors;
		},
		get isLoading() {
			return isLoading;
		},
		get isChecking() {
			return isChecking;
		},
		clearError,
		handleSubmit
	};
}
