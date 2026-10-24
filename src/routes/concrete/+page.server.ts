import raw from '../../../content/concrete/rebar.json';
import { RebarFile } from '$lib/schema/concrete';
import type { PageServerLoad } from './$types';

// Server-only load: at build time the table ends up in this page's prerendered data, not in a JS bundle.
export const load: PageServerLoad = () => {
	const { source, origin, rows } = RebarFile.parse(raw);
	return { source, origin, rows };
};
