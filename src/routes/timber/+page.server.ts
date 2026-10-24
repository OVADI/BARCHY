import raw from '../../../content/timber/sections.json';
import { TimberFile } from '$lib/schema/timber';
import { rulesOverview } from '$lib/server/rules';
import type { PageServerLoad } from './$types';

// Server-only load: at build time the sections end up in this page's prerendered data, not in a JS bundle.
export const load: PageServerLoad = () => {
	const { source, origin, method, sections } = TimberFile.parse(raw);
	return { source, origin, method, sections, rules: rulesOverview('timber') };
};
