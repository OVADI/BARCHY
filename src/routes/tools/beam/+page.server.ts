import steelRaw from '../../../../content/facts/steel.json';
import { BEAM_GROUPS, type BeamMaterial } from '$lib/calc/beam';
import { FactFile } from '$lib/schema/fact';
import { rulesOf } from '$lib/server/rules';
import type { PageServerLoad } from './$types';

// Only the rules for spans reach this page, with the notes of their groups.
export const load: PageServerLoad = () => {
	const all = {
		steel: { facts: FactFile.parse(steelRaw).facts, groups: [] },
		timber: rulesOf('timber'),
		concrete: rulesOf('concrete')
	};
	const pick = (m: BeamMaterial) => ({
		facts: all[m].facts.filter((f) => BEAM_GROUPS[m].includes(f.group ?? '')),
		groups: all[m].groups.filter((g) => BEAM_GROUPS[m].includes(g.id))
	});
	return { steel: pick('steel'), timber: pick('timber'), concrete: pick('concrete') };
};
