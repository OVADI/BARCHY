import { error } from '@sveltejs/kit';
import { RULE_SECTIONS } from '$lib/facts/rules';
import { rulesOf } from '$lib/server/rules';
import type { EntryGenerator, PageServerLoad } from './$types';

type Material = keyof typeof RULE_SECTIONS;
const isMaterial = (m: string): m is Material => m in RULE_SECTIONS;

export const entries: EntryGenerator = () =>
	(Object.keys(RULE_SECTIONS) as Material[]).flatMap((material) =>
		RULE_SECTIONS[material].flatMap((s) => s.groups.map((group) => ({ material, group })))
	);

// Server-only load: only this group's rules end up in the prerendered page data.
export const load: PageServerLoad = ({ params }) => {
	if (!isMaterial(params.material)) error(404, 'Unknown material');
	const { facts, groups, charts } = rulesOf(params.material);
	const group = groups.find((g) => g.id === params.group);
	if (!group) error(404, 'Unknown rule group');
	return {
		material: params.material,
		group,
		facts: facts.filter((f) => f.group === group.id),
		charts: charts.filter((c) => c.group === group.id)
	};
};
