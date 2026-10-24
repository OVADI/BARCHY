import { describe, expect, it } from 'vitest';
import concrete from '../../../content/facts/concrete.json';
import timber from '../../../content/facts/timber.json';
import { FactFile } from '$lib/schema/fact';
import { RULE_SECTIONS } from './rules';

describe('RULE_SECTIONS', () => {
	it.each([
		['timber', timber],
		['concrete', concrete]
	] as const)('lists every %s group exactly once, so the Rules tab hides nothing', (m, raw) => {
		const listed = RULE_SECTIONS[m].flatMap((s) => s.groups);
		const ids = (FactFile.parse(raw).groups ?? []).map((g) => g.id);
		expect([...listed].sort()).toEqual([...ids].sort());
		expect(new Set(listed).size).toBe(listed.length);
	});
});
