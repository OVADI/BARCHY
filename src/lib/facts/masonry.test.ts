import { describe, expect, it } from 'vitest';
import raw from '../../../content/facts/masonry.json';
import { FactFile } from '$lib/schema/fact';
import { masonryTable } from './masonry';

const { facts, groups } = FactFile.parse(raw);
const table = (group: string) => masonryTable(facts.filter((f) => f.group === group));

describe('masonryTable', () => {
	it('rebuilds the full source table for each wall type', () => {
		for (const g of groups ?? []) {
			const tb = table(g.id);
			expect(tb.storeys).toEqual([1, 2, 3, 4, 5]);
			expect(tb.spans).toEqual([
				{ l: 4, ht: 180 },
				{ l: 5, ht: 200 },
				{ l: 6, ht: 220 },
				{ l: 7, ht: 240 }
			]);
			for (const n of tb.storeys) for (const s of tb.spans) expect(tb.cell(n, s.l)).toBeDefined();
		}
	});

	it('finds the cell by storeys and bay width', () => {
		expect(table('calcium-silicate-end-wall').cell(5, 4)?.value).toBe(150);
		expect(table('calcium-silicate-party-wall').cell(4, 7)?.value).toBe(214);
		expect(table('calcium-silicate-party-wall').cell(6, 4)).toBeUndefined();
	});
});
