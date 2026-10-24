import { error } from '@sveltejs/kit';
import raw from '../../../../../content/drawing/conventions.json';
import { GUIDE_IDS } from '$lib/drawing/constants';
import { DrawingFile } from '$lib/schema/drawing';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => GUIDE_IDS.map((id) => ({ id }));

// Server-only load: only this guide ends up in the prerendered page data.
export const load: PageServerLoad = ({ params }) => {
	const { source, guideOrigin, lines, guides } = DrawingFile.parse(raw);
	const guide = guides.find((g) => g.id === params.id);
	if (!guide) error(404, 'Unknown drawing guide');
	return { source, origin: guideOrigin, lines, guide };
};
