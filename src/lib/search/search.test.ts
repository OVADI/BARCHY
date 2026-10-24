import { describe, expect, it } from 'vitest';
import bbl from '../../../content/facts/bbl.json';
import steelFacts from '../../../content/facts/steel.json';
import rebar from '../../../content/concrete/rebar.json';
import sheets from '../../../content/steel/sheets.json';
import timber from '../../../content/timber/sections.json';
import chs from '../../../content/steel/chs.json';
import he from '../../../content/steel/he.json';
import ipe from '../../../content/steel/ipe.json';
import rhs from '../../../content/steel/rhs.json';
import shs from '../../../content/steel/shs.json';
import unp from '../../../content/steel/unp.json';
import { RebarFile } from '$lib/schema/concrete';
import { FactFile } from '$lib/schema/fact';
import { ProfiledSheetFile, SteelFile } from '$lib/schema/steel';
import { TimberFile } from '$lib/schema/timber';
import { buildSearchIndex } from './build';
import { search } from './match';
import { normalize } from './normalize';

const index = buildSearchIndex({
	steel: [he, ipe, unp, shs, rhs, chs].map((f) => SteelFile.parse(f)),
	timber: TimberFile.parse(timber),
	rebar: RebarFile.parse(rebar),
	sheets: ProfiledSheetFile.parse(sheets),
	bbl: FactFile.parse(bbl).facts,
	steelFacts: FactFile.parse(steelFacts).facts
});

const { entries } = index;
const top = (q: string) => search(index, q)[0];

describe('normalize', () => {
	it('folds case, accents, × and decimal commas', () => {
		expect(normalize('HE 200 A')).toBe('he 200 a');
		expect(normalize('Ø48,3×4')).toBe('ø48.3x4');
		expect(normalize('Uitzettingscoëfficiënt α')).toBe('uitzettingscoefficient');
		expect(normalize('Bbl art. 4.163 lid 1')).toBe('bbl art 4.163 lid 1');
	});
});

describe('search', () => {
	it('indexes every kind of content', () => {
		const kinds = new Set(entries.map((e) => e.kind));
		for (const k of ['tool', 'page', 'steel', 'timber', 'rebar', 'sheet', 'requirement'] as const) {
			expect(kinds).toContain(k);
		}
		expect(entries.filter((e) => e.kind === 'steel')).toHaveLength(408);
		expect(entries.filter((e) => e.kind === 'requirement')).toHaveLength(56);
	});

	it('finds a section by any spelling', () => {
		for (const q of ['HEA 200', 'HE 200 A', 'hea200', 'HE A 200', 'he 200a']) {
			expect(top(q)?.path, q).toBe('/steel/hea/200');
		}
		expect(top('IPE 200')?.path).toBe('/steel/ipe/200');
	});

	it('lists a series in size order for a partial name', () => {
		const hits = search(index, 'hea 2').slice(0, 3);
		expect(hits.map((h) => h.title)).toEqual(['HEA 200', 'HEA 220', 'HEA 240']);
	});

	it('writes hollow sections in locale decimals and finds them with a comma', () => {
		const hit = top('chs 48,3x4');
		expect(hit?.title).toEqual({ nl: 'CHS 48,3×4', en: 'CHS 48.3×4' });
		expect(top('Ø48.3x4')?.path).toBe(hit?.path);
	});

	it('finds timber, rebar and sheets by size', () => {
		expect(top('69 x 195')?.path).toBe('/timber?kind=sawn&b=69&h=195');
		expect(top('ø12')?.path).toBe('/concrete?d=12');
		expect(top('staalplaat')?.kind).toBe('page');
		expect(search(index, 'gezaagd 69').every((h) => !h.path.includes('glulam'))).toBe(true);
	});

	it('finds the stair tool and the Bbl stair requirements by a word', () => {
		const hits = search(index, 'trap');
		expect(hits[0]?.path).toBe('/tools/stair');
		expect(
			hits.some((h) => h.kind === 'requirement' && h.path.startsWith('/space?tab=circulation'))
		).toBe(true);
	});

	it('finds a Bbl requirement by article number and in English', () => {
		expect(search(index, '4.163').some((h) => h.path.endsWith('#bbl-verblijfsgebied-totaal'))).toBe(
			true
		);
		expect(search(index, 'toilet').some((h) => h.kind === 'requirement')).toBe(true);
		expect(search(index, 'doorway')[0]?.path).toBe('/space?tab=circulation#bbl-doorgang-breedte');
	});

	it('returns nothing for an empty or unknown query', () => {
		expect(search(index, '  ')).toEqual([]);
		expect(search(index, 'xyzzy')).toEqual([]);
	});
});
