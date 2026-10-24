import { box, gyration, iSection, tube, type Props } from '../calc/section';
import type { Issue } from '../schema/source';
import type { SteelSection } from '../schema/steel';

/**
 * Consistency checks for steel sections, shared by the import script and the tests.
 * Errors make a record 'flagged'; warnings are only reported.
 */

/** Density of structural steel, TU Delft Vademecum §12.1 (fact 'staal-volumieke-massa'). */
export const STEEL_DENSITY = 7850; // kg/m³

export const TOL = {
	mass: 0.03,
	gyration: 0.03,
	modulus: 0.03,
	/** Rolled I/U: table area includes root fillets that the idealised geometry leaves out. */
	geometryIMin: -0.02,
	geometryIMax: 0.1,
	/** Tubes are exact up to rounding. */
	geometryTube: 0.02,
	/** Boxes: corner radii assumed (see BOX_CORNER). */
	geometryBox: 0.03
} as const;

/**
 * Corner radii for hot-finished hollow sections used in the geometry warning (ro = 1.5 t, ri = 1.0 t).
 * An assumption for a non-blocking check, not a published value in BARCHY.
 */
export const BOX_CORNER = { ro: 1.5, ri: 1.0 } as const;

const rel = (found: number, expected: number) => (found - expected) / expected;
const pct = (x: number) => `${(x * 100).toFixed(1)} %`;

function issue(
	check: string,
	severity: Issue['severity'],
	message: string,
	field?: string,
	expected?: number,
	found?: number
): Issue {
	const r = (x: number | undefined) => (x === undefined ? undefined : Math.round(x * 1000) / 1000);
	return { check, severity, field, expected: r(expected), found: r(found), message };
}

/** G ≈ A × ρ */
function mass(s: SteelSection): Issue[] {
	const expected = s.A * 1e-6 * STEEL_DENSITY;
	const d = rel(s.G, expected);
	return Math.abs(d) > TOL.mass
		? [
				issue(
					'mass',
					'error',
					`G wijkt ${pct(d)} af van A × ${STEEL_DENSITY} kg/m³`,
					'G',
					expected,
					s.G
				)
			]
		: [];
}

/** i ≈ √(I/A) */
function radii(s: SteelSection): Issue[] {
	const pairs: [string, number, number][] = [['iy', s.iy, s.Iy]];
	if (s.shape !== 'tube') pairs.push(['iz', s.iz, s.Iz]);
	const out: Issue[] = [];
	for (const [field, i, I] of pairs) {
		const expected = gyration(I, s.A);
		const d = rel(i, expected);
		if (Math.abs(d) > TOL.gyration) {
			const axis = field.slice(1);
			out.push(
				issue(
					'gyration',
					'error',
					`${field} wijkt ${pct(d)} af van √(I${axis}/A)`,
					field,
					expected,
					i
				)
			);
		}
	}
	return out;
}

/** W ≈ I / (afstand tot uiterste vezel), voor symmetrische assen */
function moduli(s: SteelSection): Issue[] {
	const pairs: [string, number, number, number][] = [];
	if (s.shape === 'tube') pairs.push(['Wy', s.Wy, s.Iy, s.D / 2]);
	else {
		pairs.push(['Wy', s.Wy, s.Iy, s.h / 2]);
		if (s.shape !== 'U') pairs.push(['Wz', s.Wz, s.Iz, s.b / 2]);
	}
	const out: Issue[] = [];
	for (const [field, W, I, c] of pairs) {
		const expected = I / c;
		const d = rel(W, expected);
		if (Math.abs(d) > TOL.modulus) {
			const axis = field.slice(1);
			out.push(
				issue(
					'modulus',
					'error',
					`${field} wijkt ${pct(d)} af van I${axis}/(${axis === 'y' && s.shape !== 'tube' ? 'h' : s.shape === 'tube' ? 'D' : 'b'}/2)`,
					field,
					expected,
					W
				)
			);
		}
	}
	return out;
}

/** Strong axis must be the strong axis. */
function order(s: SteelSection): Issue[] {
	if (s.shape === 'tube') return [];
	if (s.shape === 'box' && s.h < s.b) return [];
	if (s.shape === 'box' && s.h === s.b) return [];
	const out: Issue[] = [];
	if (!(s.Iy > s.Iz))
		out.push(issue('order', 'error', 'Iy moet groter zijn dan Iz', 'Iz', undefined, s.Iz));
	if (!(s.iy > s.iz))
		out.push(issue('order', 'error', 'iy moet groter zijn dan iz', 'iz', undefined, s.iz));
	return out;
}

/** Dimensions that cannot be right for this shape. */
function plausible(s: SteelSection): Issue[] {
	const out: Issue[] = [];
	if (s.shape === 'I') {
		if (!(s.tw < s.tf))
			out.push(issue('plausible', 'error', 'tw moet kleiner zijn dan tf', 'tw', undefined, s.tw));
		if (!(s.tf <= s.b))
			out.push(issue('plausible', 'error', 'tf moet kleiner zijn dan b', 'tf', undefined, s.tf));
		if (!(s.h > s.b / 2))
			out.push(issue('plausible', 'error', 'h moet groter zijn dan b/2', 'h', s.b / 2, s.h));
		if (!(2 * s.tf < s.h))
			out.push(issue('plausible', 'error', '2·tf moet kleiner zijn dan h', 'tf', undefined, s.tf));
	}
	if (s.shape === 'U' && !(s.tw < s.b))
		out.push(issue('plausible', 'error', 'tw moet kleiner zijn dan b', 'tw', undefined, s.tw));
	if (s.shape === 'box' && !(2 * s.t < Math.min(s.b, s.h)))
		out.push(issue('plausible', 'error', '2·t moet kleiner zijn dan b en h', 't', undefined, s.t));
	if (s.shape === 'tube' && !(2 * s.t < s.D))
		out.push(issue('plausible', 'error', '2·t moet kleiner zijn dan D', 't', undefined, s.t));
	return out;
}

/** Idealised geometry versus table: a warning, because fillets and corner radii are not in the data. */
function geometry(s: SteelSection): Issue[] {
	let calc: Props;
	let fields: (keyof Props)[];
	let lo: number, hi: number;
	let note: string;
	switch (s.shape) {
		case 'I':
			calc = iSection(s.h, s.b, s.tw, s.tf);
			fields = ['A', 'Iy', 'Wy'];
			lo = TOL.geometryIMin;
			hi = TOL.geometryIMax;
			note = 'zonder afrondingen (r onbekend)';
			break;
		case 'tube':
			calc = tube(s.D, s.t);
			fields = ['A', 'Iy', 'Wy'];
			lo = -TOL.geometryTube;
			hi = TOL.geometryTube;
			note = 'exact';
			break;
		case 'box':
			calc = box(s.h, s.b, s.t, BOX_CORNER.ro * s.t, BOX_CORNER.ri * s.t);
			fields = ['A', 'Iy', 'Wy'];
			lo = -TOL.geometryBox;
			hi = TOL.geometryBox;
			note = 'hoekstralen 1,5t/1,0t aangenomen';
			break;
		default:
			return []; // UNP: tf and taper unknown
	}
	const out: Issue[] = [];
	for (const f of fields) {
		const found = s[f as keyof typeof s] as number;
		const d = rel(found, calc[f]);
		if (d < lo || d > hi) {
			out.push(
				issue(
					'geometry',
					'warning',
					`${f} wijkt ${pct(d)} af van de geometrie (${note})`,
					f,
					calc[f],
					found
				)
			);
		}
	}
	return out;
}

export function checkSection(s: SteelSection): Issue[] {
	return [...plausible(s), ...mass(s), ...radii(s), ...moduli(s), ...order(s), ...geometry(s)];
}

/** Duplicate series + size (+ weight variant) across a list. */
export function checkDuplicates(sections: SteelSection[]): Map<string, Issue[]> {
	const byKey = new Map<string, SteelSection[]>();
	for (const s of sections) {
		const key = `${s.series} ${s.size}${s.variant?.startsWith('x') ? ` ${s.variant}` : ''}`;
		byKey.set(key, [...(byKey.get(key) ?? []), s]);
	}
	const out = new Map<string, Issue[]>();
	for (const [key, list] of byKey) {
		if (list.length < 2) continue;
		for (const s of list) {
			out.set(s.id, [issue('duplicate', 'error', `${key} komt ${list.length}× voor in de bron`)]);
		}
	}
	return out;
}
