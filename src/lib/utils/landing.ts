import { baseLocale, getLocale } from '$lib/paraglide/runtime';

const LANDING_ORIGIN = 'https://shelter.cat';

// the landing lives in another repo: english at the root, other locales under /<locale>
export function landingUrl(path = '/'): string {
	const locale = getLocale();
	const prefix = locale === baseLocale ? '' : `/${locale}`;
	return `${LANDING_ORIGIN}${prefix}${path === '/' && prefix ? '' : path}`;
}
