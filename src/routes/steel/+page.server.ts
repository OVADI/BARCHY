import raw from '../../../content/facts/steel.json';
import { FactFile } from '$lib/schema/fact';
import type { PageServerLoad } from './$types';

// Server-only load: at build time the facts end up in this page's prerendered data, not in a JS bundle.
export const load: PageServerLoad = () => {
	const { facts } = FactFile.parse(raw);
	return { facts };
};
