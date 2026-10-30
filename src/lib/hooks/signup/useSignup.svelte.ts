import { register } from '$lib/services/auth/register.service';
import { getUser, hasExistingUser } from '$lib/services/app/db.service';
import { goto } from '$app/navigation';
import { type RegisterInput, registerSchema } from '$lib/schemas/register.schema';
import { getAuthContext } from '$lib/contexts/auth.context.svelte';
import { resolve } from '$app/paths';

export function useSignup() {
	const auth = getAuthContext();

	let formData = $state<RegisterInput>({
		username: '',
		password: '',
		password2: ''
	});

	// error general (al crear el diario) y errores de cada campo (validacion)
	let error = $state('');
	let fieldErrors = $state<Partial<Record<keyof RegisterInput, string>>>({});
	let isLoading = $state(false);
	let isChecking = $state(true);

	const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
		const target = e.currentTarget;
		formData = {
			...formData,
			[target.name]: target.value
		};
		error = '';
		fieldErrors = { ...fieldErrors, [target.name]: undefined };
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
			error = err instanceof Error ? err.message : 'registration failed';
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
		handleChange,
		handleSubmit
	};
}
