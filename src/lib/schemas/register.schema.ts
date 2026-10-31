import { z } from 'zod';
import { m } from '$lib/paraglide/messages';

export const registerSchema = z
	.object({
		username: z
			.string()
			.trim()
			.min(3, { error: () => m['signup.error.usernameMin']() })
			.max(20, { error: () => m['signup.error.usernameMax']() })
			.regex(/^[a-zA-Z0-9_]+$/, { error: () => m['signup.error.usernameChars']() }),
		password: z.string().min(8, { error: () => m['signup.error.passwordMin']() }),
		password2: z.string().min(8, { error: () => m['signup.error.passwordMin']() })
	})
	.refine((data) => data.password === data.password2, {
		error: () => m['signup.error.passwordMismatch'](),
		path: ['password2']
	});

export type RegisterInput = z.infer<typeof registerSchema>;
