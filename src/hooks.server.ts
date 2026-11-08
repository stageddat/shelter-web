import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { getTextDirection } from '$lib/paraglide/runtime';
import { fontInitScript, themeInitScript } from 'shelter-assets';
import latinFont from 'shelter-assets/fonts/playpen-sans/latin.woff2?url';

// la app es una SPA: app.html se genera una vez en el build. el tema va primero para que no parpadee
const initHead = [
	`<script>${themeInitScript}</script>`,
	`<script>${fontInitScript}</script>`,
	`<link rel="preload" href="${latinFont}" as="font" type="font/woff2" crossorigin />`
].join('\n\t\t');

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html
					.replace('%shelter.init%', initHead)
					.replace('%lang%', locale)
					.replace('%dir%', getTextDirection(locale));
			}
		});
	});

export const handle: Handle = paraglideHandle;
