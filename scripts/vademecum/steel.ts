import { gyration } from '../../src/lib/calc/section';
import { STEEL_DENSITY } from '../../src/lib/checks/steel';
import type { Issue } from '../../src/lib/schema/source';
import type { SteelFamily, SteelSection, SteelSeries } from '../../src/lib/schema/steel';
import { dims, num, short, slug, type Table } from './parse';

/** One parsed row before checks: numbers may be missing (null) in the source. */
export interface Draft {
	family: SteelFamily;
	shape: SteelSection['shape'];
	series: SteelSeries;
	variant?: string;
	size: string;
	name: string;
	sourceName: string;
	aliases: string[];
	values: Record<string, number | null>;
	/** Raw cell texts, for the report. */
	raw: string[];
}

/** Column layout per table, with the power of ten the source column is scaled by. */
type Col = [field: string, pow: number];

const I_COLS: Col[] = [
	['G', 0],
	['h', 0],
	['b', 0],
	['tw', 0],
	['tf', 0],
	['A', 2],
	['Iy', 4],
	['Iz', 4],
	['Wy', 3],
	['Wz', 3],
	['iy', 0],
	['iz', 0]
];
// UNP: the header in the source is copied from RHS; the values are h×b, tw, G, A, Iy, Iz, Wy, Wz.
const U_COLS: Col[] = [
	['tw', 0],
	['G', 0],
	['A', 2],
	['Iy', 4],
	['Iz', 4],
	['Wy', 3],
	['Wz', 3]
];
const SHS_COLS: Col[] = [
	['t', 0],
	['G', 0],
	['A', 2],
	['Iy', 4],
	['Wy', 3],
	['iy', 0]
];
// RHS: the header says "Iy = Iz" and repeats Wy = Wz; the values are Iy, Iz, Wy, Wz, iy, iz.
const RHS_COLS: Col[] = [
	['t', 0],
	['G', 0],
	['A', 2],
	['Iy', 4],
	['Iz', 4],
	['Wy', 3],
	['Wz', 3],
	['iy', 0],
	['iz', 0]
];
const CHS_COLS: Col[] = [
	['t', 0],
	['G', 0],
	['A', 2],
	['Iy', 4],
	['Wy', 3],
	['iy', 0]
];

export const LAYOUT = { I: I_COLS, U: U_COLS, SHS: SHS_COLS, RHS: RHS_COLS, CHS: CHS_COLS };

function read(cells: string[], cols: Col[]): Record<string, number | null> {
	const out: Record<string, number | null> = {};
	cols.forEach(([field, pow], i) => (out[field] = num(cells[i] ?? '', 'en', pow)));
	return out;
}

const HE_NAME = /^HE\s*(\d+)\s*(?:(AA|A|B|C|M)|x\s*(\d+))$/;
const IPE_NAME = /^IPE\s*(\d+)\s*(?:(A|O|R|V)|x\s*(\d+))?$/;

function iDraft(family: 'HE' | 'IPE', cells: string[]): Draft {
	const sourceName = cells[0]!;
	const m = (family === 'HE' ? HE_NAME : IPE_NAME).exec(sourceName);
	if (!m) throw new Error(`Unknown ${family} name: "${sourceName}"`);
	const [, size, letter, weight] = m as unknown as [
		string,
		string,
		string | undefined,
		string | undefined
	];
	let series: SteelSeries;
	let name: string;
	let variant: string | undefined;
	const aliases = new Set<string>([sourceName]);
	if (weight) {
		variant = `x${weight}`;
		series = family === 'HE' ? 'HEx' : 'IPEx';
		name = `${family} ${size} x ${weight}`;
		aliases.add(`${family} ${size}x${weight}`);
	} else if (letter) {
		variant = letter;
		if (family === 'HE') {
			series = `HE${letter}` as SteelSeries;
			name = ['A', 'B', 'M', 'AA'].includes(letter)
				? `HE${letter} ${size}`
				: `HE ${size} ${letter}`;
			aliases.add(`HE ${size} ${letter}`).add(`HE${letter}${size}`).add(`HE ${letter} ${size}`);
		} else {
			series = `IPE${letter}` as SteelSeries;
			name = `IPE ${letter} ${size}`;
			aliases.add(`IPE ${size} ${letter}`).add(`IPE${letter} ${size}`).add(`IPE${size}${letter}`);
		}
	} else {
		series = 'IPE';
		name = `IPE ${size}`;
		aliases.add(`IPE${size}`);
	}
	aliases.add(name);
	return {
		family,
		shape: 'I',
		series,
		variant,
		size,
		name,
		sourceName,
		aliases: [...aliases],
		values: read(cells.slice(1), I_COLS),
		raw: cells
	};
}

function boxDraft(family: 'SHS' | 'RHS', cells: string[]): Draft {
	const [h, b] = dims(cells[0]!);
	const values: Record<string, number | null> = {
		h: h!,
		b: b!,
		...read(cells.slice(1), family === 'SHS' ? SHS_COLS : RHS_COLS)
	};
	if (family === 'SHS') {
		// Square: both axes are equal, the source gives one value.
		values.Iz = values.Iy ?? null;
		values.Wz = values.Wy ?? null;
		values.iz = values.iy ?? null;
	}
	const t = short(values.t!);
	const size = `${short(h!)}x${short(b!)}x${t}`;
	const name = `${family} ${size.replace(/x/g, '×')}`;
	return {
		family,
		shape: 'box',
		series: family,
		size,
		name,
		sourceName: `${cells[0]} ${cells[1]}`,
		aliases: [name, `${family} ${size}`, `${family}${size}`],
		values,
		raw: cells
	};
}

function tubeDraft(cells: string[], D: number): Draft {
	const values: Record<string, number | null> = { D, ...read(cells.slice(1), CHS_COLS) };
	const size = `${short(D)}x${short(values.t!)}`;
	const name = `CHS ${size.replace('x', '×')}`;
	return {
		family: 'CHS',
		shape: 'tube',
		series: 'CHS',
		size,
		name,
		sourceName: `${short(D)} ${cells[1]}`,
		aliases: [name, `CHS ${size}`, `Ø${size}`],
		values,
		raw: cells
	};
}

function uDraft(cells: string[]): Draft {
	const [h, b] = dims(cells[0]!);
	const size = short(h!);
	return {
		family: 'UNP',
		shape: 'U',
		series: 'UNP',
		size,
		name: `UNP ${size}`,
		sourceName: cells[0]!,
		aliases: [`UNP ${size}`, `UNP${size}`, `U ${size}`],
		values: { h: h!, b: b!, ...read(cells.slice(1), U_COLS) },
		raw: cells
	};
}

/** Maps every steel table in staal.md to drafts, keyed by family. */
export function steelDrafts(
	tables: Table[]
): Map<SteelFamily, { section: string; drafts: Draft[] }> {
	const out = new Map<SteelFamily, { section: string; drafts: Draft[] }>();
	for (const t of tables) {
		const s = t.section;
		let family: SteelFamily;
		let drafts: Draft[];
		if (s.startsWith('IPE')) {
			family = 'IPE';
			drafts = t.rows.map((r) => iDraft('IPE', r));
		} else if (s.startsWith('HEA')) {
			family = 'HE';
			drafts = t.rows.map((r) => iDraft('HE', r));
		} else if (s.startsWith('SHS')) {
			family = 'SHS';
			drafts = t.rows.map((r) => boxDraft('SHS', r));
		} else if (s.startsWith('RHS')) {
			family = 'RHS';
			drafts = t.rows.map((r) => boxDraft('RHS', r));
		} else if (s.startsWith('CHS')) {
			family = 'CHS';
			// An empty diameter cell continues the diameter of the row above.
			let D = NaN;
			drafts = t.rows.map((r) => {
				const d = num(r[0]!, 'en');
				if (d !== null) D = d;
				return tubeDraft(r, D);
			});
		} else if (s.startsWith('UNP')) {
			family = 'UNP';
			drafts = t.rows.map(uDraft);
		} else {
			throw new Error(`Unexpected steel table under "${s}"`);
		}
		out.set(family, { section: s, drafts });
	}
	return out;
}

/** Required fields per shape. */
const REQUIRED: Record<SteelSection['shape'], string[]> = {
	I: ['h', 'b', 'tw', 'tf', 'G', 'A', 'Iy', 'Iz', 'Wy', 'Wz', 'iy', 'iz'],
	U: ['h', 'b', 'tw', 'G', 'A', 'Iy', 'Iz', 'Wy', 'Wz', 'iy', 'iz'],
	box: ['h', 'b', 't', 'G', 'A', 'Iy', 'Iz', 'Wy', 'Wz', 'iy', 'iz'],
	tube: ['D', 't', 'G', 'A', 'Iy', 'Wy', 'iy']
};

/**
 * Fills fields that the source leaves out. UNP has no radii of gyration by design (derived, no issue);
 * an empty cell elsewhere is derived where a formula exists and reported as an error.
 */
export function complete(d: Draft): {
	values: Record<string, number>;
	derived: string[];
	issues: Issue[];
	missing: string[];
} {
	const v = { ...d.values };
	const derived: string[] = [];
	const issues: Issue[] = [];
	const derive = (field: string, value: number | null, how: string, byDesign: boolean) => {
		if (v[field] !== null && v[field] !== undefined) return;
		if (value === null || !Number.isFinite(value)) return;
		v[field] = Math.round(value * 1000) / 1000;
		derived.push(field);
		if (!byDesign)
			issues.push({
				check: 'missing',
				severity: 'error',
				field,
				message: `${field} ontbreekt in de bron; berekend als ${how}`
			});
	};
	const has = (...f: string[]) => f.every((x) => typeof v[x] === 'number');
	const byDesign = d.shape === 'U';
	if (has('Iy', 'A')) derive('iy', gyration(v.Iy!, v.A!), '√(Iy/A)', byDesign);
	if (has('Iz', 'A')) derive('iz', gyration(v.Iz!, v.A!), '√(Iz/A)', byDesign);
	if (has('A')) derive('G', v.A! * 1e-6 * STEEL_DENSITY, `A × ${STEEL_DENSITY} kg/m³`, false);
	if (has('G')) derive('A', v.G! / (1e-6 * STEEL_DENSITY), `G / ${STEEL_DENSITY} kg/m³`, false);
	const missing = REQUIRED[d.shape].filter((f) => typeof v[f] !== 'number');
	return { values: v as Record<string, number>, derived, issues, missing };
}

export function draftId(d: Draft): string {
	return slug(d.family, d.size, d.variant ?? '');
}
