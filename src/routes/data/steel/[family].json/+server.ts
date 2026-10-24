import { error, json } from '@sveltejs/kit';
import { SteelFile } from '$lib/schema/steel';
import { toClient } from '$lib/steel/client';
import type { EntryGenerator, RequestHandler } from './$types';

// Content is validated by the build plugin; parsing again here keeps the types honest.
const files = import.meta.glob('../../../../../content/steel/{he,ipe,unp,shs,rhs,chs}.json', {
	eager: true,
	import: 'default'
});

const byFamily = new Map(
	Object.values(files).map((raw) => {
		const file = SteelFile.parse(raw);
		return [file.family.toLowerCase(), toClient(file)];
	})
);

export const prerender = true;

export const entries: EntryGenerator = () => [...byFamily.keys()].map((family) => ({ family }));

export const GET: RequestHandler = ({ params }) => {
	const file = byFamily.get(params.family);
	if (!file) error(404, 'Unknown family');
	return json(file);
};
