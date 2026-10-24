import raw from '../../../../content/facts/bbl.json';
import { FactFile } from '$lib/schema/fact';
import type { PageServerLoad } from './$types';

// Only the stair facts reach this page; the check reads its limits from them.
export const load: PageServerLoad = () => {
	const { facts } = FactFile.parse(raw);
	return { facts: facts.filter((f) => f.group === 'stair') };
};
