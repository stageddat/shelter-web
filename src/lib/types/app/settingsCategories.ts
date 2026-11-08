import { UserRound, ShieldCheck, NotebookPen, ArrowDownUp, Info } from '@lucide/svelte';

const settingsCategories = [
	{ id: 'general', icon: UserRound },
	{ id: 'security', icon: ShieldCheck },
	{ id: 'editor', icon: NotebookPen },
	{ id: 'data', icon: ArrowDownUp },
	{ id: 'about', icon: Info }
];

export default settingsCategories;
