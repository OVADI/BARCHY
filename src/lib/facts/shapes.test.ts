import { describe, expect, it } from 'vitest';
import { BEAM_GROUPS } from '$lib/calc/beam';
import { RULE_SECTIONS } from './rules';
import { shapeOf } from './shapes';

describe('shapeOf', () => {
	it('has a drawing for every beam group in the estimator', () => {
		for (const groups of Object.values(BEAM_GROUPS)) {
			for (const g of groups) expect(shapeOf(g), g).toBeDefined();
		}
	});

	it('has a drawing for every group under beams and concrete floors on the Rules tab', () => {
		const groups = [
			...RULE_SECTIONS.timber.find((s) => s.key === 'beams')!.groups,
			...RULE_SECTIONS.concrete.flatMap((s) =>
				s.key === 'beams' || s.key === 'floors' ? s.groups : []
			)
		];
		for (const g of groups) expect(shapeOf(g), g).toBeDefined();
	});

	it('lets a variant override its group, e.g. the truss among steel floor beams', () => {
		expect(shapeOf('beams-floor')).toBe('straight');
		expect(shapeOf('beams-floor', 'staal-hoofdligger-vloer-vakwerk')).toBe('truss');
	});
});
