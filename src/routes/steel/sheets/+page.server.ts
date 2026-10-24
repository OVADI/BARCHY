import raw from '../../../../content/steel/sheets.json';
import { ProfiledSheetFile } from '$lib/schema/steel';
import type { PageServerLoad } from './$types';

// Server-only load: at build time the sheets end up in this page's prerendered data, not in a JS bundle.
export const load: PageServerLoad = () => {
	const { source, origin, sheets } = ProfiledSheetFile.parse(raw);
	return { source, origin, sheets };
};
