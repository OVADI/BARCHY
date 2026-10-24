import { describe, expect, it } from 'vitest';
import concreteRaw from '../../../content/facts/concrete.json';
import steelRaw from '../../../content/facts/steel.json';
import timberRaw from '../../../content/facts/timber.json';
import { FactFile } from '../schema/fact';
import {
	BEAM_GROUPS,
	beamVariants,
	estimateBeam,
	meets,
	needsLegHeight,
	type BeamMaterial
} from './beam';

const facts = {
	steel: FactFile.parse(steelRaw).facts,
	timber: FactFile.parse(timberRaw).facts,
	concrete: FactFile.parse(concreteRaw).facts
};
const variants = (m: BeamMaterial) => beamVariants(facts[m], BEAM_GROUPS[m]);
const variant = (m: BeamMaterial, key: string) => {
	const v = variants(m).find((x) => x.key === key);
	if (!v) throw new Error(`no variant ${key}`);
	return v;
};

describe('beamVariants', () => {
	it('gives every variant a lead rule that starts with the depth or a span size', () => {
		for (const m of ['steel', 'timber', 'concrete'] as const) {
			const list = variants(m);
			expect(list.length).toBeGreaterThan(0);
			for (const v of list) expect(v.facts[0]!.symbol).toMatch(/^h/);
		}
	});

	it('keeps the rules of one table column together, depth first', () => {
		const v = variant('timber', 'hout-ligger-overstek-a025');
		expect(v.facts.map((f) => f.symbol)).toEqual(['h', 'a']);
		expect(variant('timber', 'hout-zadeldakligger').facts.map((f) => f.symbol)).toEqual([
			'h1',
			'h2'
		]);
	});

	it('covers every rule of thumb in the beam groups exactly once', () => {
		for (const m of ['steel', 'timber', 'concrete'] as const) {
			const inGroups = facts[m].filter(
				(f) => f.type === 'rule_of_thumb' && BEAM_GROUPS[m].includes(f.group ?? '')
			);
			const listed = variants(m).flatMap((v) => v.facts.map((f) => f.id));
			expect(listed.sort()).toEqual(inGroups.map((f) => f.id).sort());
		}
	});
});

describe('estimateBeam', () => {
	it('turns h = l/15 – l/20 into a depth band', () => {
		const e = estimateBeam(variant('steel', 'staal-hoofdligger-vloer-i-u-profiel'), 6);
		expect(e.results[0]!.range![0]).toBeCloseTo(0.3);
		expect(e.results[0]!.range![1]).toBeCloseTo(0.4);
		expect(e.outside).toEqual([]);
	});

	it('computes the cantilever a = 0,25 · l next to the depth', () => {
		const [h, a] = estimateBeam(variant('timber', 'hout-ligger-overstek-a025'), 12).results;
		expect(h!.range![0]).toBeCloseTo(12 / 21);
		expect(h!.range![1]).toBeCloseTo(12 / 16);
		expect(a!.kind).toBe('span');
		expect(a!.range).toEqual([3, 3]);
	});

	it('warns when l is outside the span the rule holds for', () => {
		const e = estimateBeam(variant('timber', 'hout-gebogen-ligger'), 5);
		expect(e.outside.map((c) => c.symbol)).toEqual(['l']);
		expect(estimateBeam(variant('timber', 'hout-gebogen-ligger'), 7).outside).toEqual([]);
	});

	it('shows values of their own as fixed and cannot compute (l+g) without g', () => {
		const curved = estimateBeam(variant('timber', 'hout-gebogen-ligger'), 20).results;
		expect(curved.find((r) => r.fact.symbol === 'r')!.kind).toBe('fixed');
		const bent = estimateBeam(variant('timber', 'hout-spant-gebogen-hoh-4-5'), 20).results;
		expect(bent.map((r) => [r.fact.symbol, r.kind])).toEqual([
			['h_knik', 'unknown'],
			['h_nok', 'unknown'],
			['h_voet', 'unknown'],
			['r', 'fixed']
		]);
	});

	it('computes the kinked frame from l + g once g is given', () => {
		const v = variant('timber', 'hout-spant-gebogen-hoh-4-5');
		const [knik, nok, voet, r] = estimateBeam(v, 25, { g: 6 }).results;
		// h_knik = (l+g)/31, h_nok = 0,5 · h_knik, h_voet = 0,67 · h_knik
		expect(knik!.kind).toBe('span');
		expect(knik!.range![0]).toBeCloseTo(31 / 31);
		expect(nok!.kind).toBe('derived');
		expect(nok!.range![0]).toBeCloseTo(0.5);
		expect(voet!.range![0]).toBeCloseTo(0.67);
		expect(r!.kind).toBe('fixed');
		expect(() => estimateBeam(v, 25, { g: 0 })).toThrow(RangeError);
	});

	it('asks for g only where a rule uses (l+g)', () => {
		expect(needsLegHeight(variant('timber', 'hout-spant-geknikt-hoh-4-5'))).toBe(true);
		expect(needsLegHeight(variant('timber', 'hout-gebogen-ligger'))).toBe(false);
	});

	it('reads L in the concrete floor tables as the span', () => {
		const e = estimateBeam(variant('concrete', 'beton-ribbenvloer-vrij-opgelegd'), 9.2);
		expect(e.results[0]!.range![0]).toBeCloseTo(0.4);
		expect(e.outside).toEqual([]);
	});

	it('rejects a span that is not positive', () => {
		expect(() => estimateBeam(variant('steel', 'staal-gording-warmgewalst'), 0)).toThrow(
			RangeError
		);
	});
});

describe('meets', () => {
	it('counts the ends of a range as inside', () => {
		const c = {
			symbol: 'l',
			value: [6, 30] as [number, number],
			unit: 'm',
			bound: 'range' as const
		};
		expect(meets(c, 6)).toBe(true);
		expect(meets(c, 30)).toBe(true);
		expect(meets(c, 30.5)).toBe(false);
	});
});
