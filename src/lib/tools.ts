import type { MessageKey } from '$lib/i18n/messages';

/** Calculators in the app; Home shows their number, the Tools tab lists them. */
export const TOOLS: {
	id: string;
	path: '/tools/stair' | '/tools/beam' | '/steel/hea';
	title: MessageKey;
}[] = [
	{ id: 'stair', path: '/tools/stair', title: 'tools.stair' },
	{ id: 'beam', path: '/tools/beam', title: 'tools.beam' },
	{ id: 'steel-weight', path: '/steel/hea', title: 'tools.steelWeight' }
];
