import { error } from '@sveltejs/kit';
import raw from '../../../../../content/drawing/conventions.json';
import { HATCH_GROUPS } from '$lib/drawing/constants';
import { DrawingFile } from '$lib/schema/drawing';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => HATCH_GROUPS.map((group) => ({ group }));

// Server-only load: only this group's hatches end up in the prerendered page data.
export const load: PageServerLoad = ({ params }) => {
	const group = HATCH_GROUPS.find((g) => g === params.group);
	if (!group) error(404, 'Unknown hatch group');
	const { source, hatchSource, origin, hatches } = DrawingFile.parse(raw);
	return { group, source, hatchSource, origin, hatches: hatches.filter((h) => h.group === group) };
};
