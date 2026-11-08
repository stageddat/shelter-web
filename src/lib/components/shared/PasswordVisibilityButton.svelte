<!-- boton del ojo para ver la contraseña; va dentro de un InputGroup.
	etiqueta fija + aria-pressed: el lector dice "show password, pressed" -->
<script lang="ts">
	import { InputGroupAddon, InputGroupButton } from 'shelter-assets';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import { m } from '$lib/paraglide/messages';

	let { visible = $bindable(false) }: { visible?: boolean } = $props();
</script>

<InputGroupAddon align="inline-end">
	<InputGroupButton
		size="icon-xs"
		aria-label={m['app.utils.password.show']()}
		aria-pressed={visible}
		onclick={() => (visible = !visible)}
	>
		{#if visible}<EyeOff />{:else}<Eye />{/if}
	</InputGroupButton>
</InputGroupAddon>
