import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { gyration, iSection } from '../calc/section';
import { SteelFile, type ISection, type SteelSection, type USection } from '../schema/steel';
import { checkDuplicates, checkSection, STEEL_DENSITY } from './steel';

/** A consistent I-section built from geometry, with 4 % extra area as rolled fillets give. */
function sample(overrides: Partial<ISection> = {}): ISection {
	const [h, b, tw, tf] = [200, 200, 6.5, 10];
	const g = iSection(h, b, tw, tf);
	const A = g.A * 1.04;
	const Iy = g.Iy * 1.02;
	const Iz = g.Iz * 1.02;
	return {
		id: 'he-200-a',
		family: 'HE',
		series: 'HEA',
		variant: 'A',
		size: '200',
		name: 'HEA 200',
		sourceName: 'HE 200 A',
		aliases: [],
		shape: 'I',
		h,
		b,
		tw,
		tf,
		G: A * 1e-6 * STEEL_DENSITY,
		A,
		Iy,
		Iz,
		Wy: Iy / (h / 2),
		Wz: Iz / (b / 2),
		iy: gyration(Iy, A),
		iz: gyration(Iz, A),
		issues: [],
		corrections: [],
		derived: [],
		status: 'auto_checked',
		...overrides
	};
}

const checks = (s: SteelSection) => checkSection(s).map((i) => `${i.check}:${i.severity}`);

describe('STEEL_DENSITY', () => {
	it('is the sourced value from content/facts/steel.json', () => {
		const facts = JSON.parse(
			readFileSync(
				join(import.meta.dirname, '..', '..', '..', 'content', 'facts', 'steel.json'),
				'utf8'
			)
		);
		const rho = facts.facts.find((f: { id: string }) => f.id === 'staal-volumieke-massa');
		expect(rho.value).toBe(STEEL_DENSITY);
	});
});

describe('checkSection', () => {
	it('passes a consistent section', () => {
		expect(checkSection(sample())).toEqual([]);
	});

	it('flags G that does not match A', () => {
		expect(checks(sample({ G: 50 }))).toContain('mass:error');
	});

	it('flags swapped radii of gyration', () => {
		const s = sample();
		const swapped = checks({ ...s, iy: s.iz, iz: s.iy });
		expect(swapped).toContain('gyration:error');
		expect(swapped).toContain('order:error');
	});

	it('flags a modulus that does not match I/(h/2)', () => {
		expect(checks(sample({ Wy: 1 }))).toContain('modulus:error');
	});

	it('flags implausible dimensions, e.g. a shifted column (h = G)', () => {
		expect(checks(sample({ tw: 12, tf: 10 }))).toContain('plausible:error');
		expect(checks(sample({ h: 42.3 }))).toContain('plausible:error');
	});

	it('warns, but does not error, when the table deviates from geometry', () => {
		const s = sample();
		const result = checkSection({ ...s, A: s.A * 1.2, G: s.A * 1.2 * 1e-6 * STEEL_DENSITY });
		expect(result.some((i) => i.check === 'geometry' && i.severity === 'warning')).toBe(true);
	});
});

describe('checkDuplicates', () => {
	it('flags both rows of a repeated name', () => {
		const a = sample({ id: 'he-1000-a', size: '1000' });
		const b = sample({ id: 'he-1000-a-2', size: '1000' });
		const result = checkDuplicates([a, b]);
		expect(result.get('he-1000-a')?.[0]?.check).toBe('duplicate');
		expect(result.get('he-1000-a-2')?.[0]?.check).toBe('duplicate');
	});

	it('does not confuse weight variants of one size', () => {
		const a = sample({ id: 'he-600-x137', series: 'HEx', size: '600', variant: 'x137' });
		const b = sample({ id: 'he-600-x151', series: 'HEx', size: '600', variant: 'x151' });
		expect(checkDuplicates([a, b]).size).toBe(0);
	});
});

describe('imported steel content', () => {
	const dir = join(import.meta.dirname, '..', '..', '..', 'content', 'steel');
	const families = readdirSync(dir).filter((f) => /^(he|ipe|unp|shs|rhs|chs)\.json$/.test(f));

	it('has all six families', () =>
		expect(families.sort()).toEqual([
			'chs.json',
			'he.json',
			'ipe.json',
			'rhs.json',
			'shs.json',
			'unp.json'
		]));

	for (const f of families) {
		const file = SteelFile.parse(JSON.parse(readFileSync(join(dir, f), 'utf8')));

		it(`${f}: stored issues match a fresh check, and the status follows the errors`, () => {
			const dupes = checkDuplicates(file.sections);
			for (const s of file.sections) {
				const fresh = [...checkSection(s), ...(dupes.get(s.id) ?? [])]
					.map((i) => `${i.check}:${i.field ?? ''}`)
					.sort();
				const stored = s.issues
					.filter((i) => i.check !== 'missing')
					.map((i) => `${i.check}:${i.field ?? ''}`)
					.sort();
				expect(stored, s.id).toEqual(fresh);
				expect(s.status === 'flagged', s.id).toBe(s.issues.some((i) => i.severity === 'error'));
			}
		});

		it(`${f}: ids are unique`, () => {
			const ids = file.sections.map((s) => s.id);
			expect(new Set(ids).size).toBe(ids.length);
		});
	}

	it('catches the known errors in the Vademecum', () => {
		const load = (name: string) =>
			SteelFile.parse(JSON.parse(readFileSync(join(dir, name), 'utf8'))).sections;
		const ipe = new Map(load('ipe.json').map((s) => [s.sourceName, s]));
		const he = load('he.json');
		const rhs = new Map(load('rhs.json').map((s) => [s.sourceName, s]));
		for (const n of ['IPE 240', 'IPE 270', 'IPE 300'])
			expect(ipe.get(n)?.status, n).toBe('flagged');
		for (const n of ['HE 360 A', 'HE 400 A'])
			expect(he.find((s) => s.sourceName === n)?.status, n).toBe('flagged');
		expect(rhs.get('50x30 3.2')?.status).toBe('flagged');
		expect(ipe.get('IPE 200')?.status).toBe('auto_checked');
	});

	it('applies the sourced corrections and then passes all checks', () => {
		const load = (name: string) =>
			SteelFile.parse(JSON.parse(readFileSync(join(dir, name), 'utf8'))).sections;
		const he = new Map(load('he.json').map((s) => [s.id, s]));
		const unp = new Map(load('unp.json').map((s) => [s.id, s]));

		const aa = he.get('he-1000-aa');
		expect(aa?.name).toBe('HEAA 1000');
		expect(aa?.sourceName).toBe('HE 1000 A');
		expect(he.get('he-1000-a')?.G).toBe(272.3);
		expect(he.has('he-1000-a-2')).toBe(false);

		expect((he.get('he-160-m') as ISection | undefined)?.iz).toBe(42.6);
		expect(he.get('he-160-m')?.corrections[0]?.from).toBe(41.1);

		expect(unp.has('unp-150')).toBe(false);
		expect((unp.get('unp-160') as USection | undefined)?.h).toBe(160);
		expect(unp.get('unp-160')?.Iy).toBe(9_247_000); // values untouched

		for (const s of [aa, he.get('he-160-m'), unp.get('unp-160')]) {
			expect(s?.status, s?.id).toBe('auto_checked');
			expect(s?.corrections[0]?.source.title, s?.id).toMatch(/ArcelorMittal/);
		}
	});
});
