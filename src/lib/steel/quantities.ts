import type { ClientSection } from './client';

/**
 * How each stored quantity (base units) is shown: the power of ten it is divided by and the unit.
 * Same scaling as the Vademecum tables, so values can be compared with the source at a glance.
 */
export type Field =
	'h' | 'b' | 'tw' | 'tf' | 't' | 'D' | 'G' | 'A' | 'Iy' | 'Iz' | 'Wy' | 'Wz' | 'iy' | 'iz';

export interface Quantity {
	field: Field;
	pow: number;
	unit: string;
}

const Q: Record<Field, Quantity> = {
	h: { field: 'h', pow: 0, unit: 'mm' },
	b: { field: 'b', pow: 0, unit: 'mm' },
	tw: { field: 'tw', pow: 0, unit: 'mm' },
	tf: { field: 'tf', pow: 0, unit: 'mm' },
	t: { field: 't', pow: 0, unit: 'mm' },
	D: { field: 'D', pow: 0, unit: 'mm' },
	G: { field: 'G', pow: 0, unit: 'kg/m' },
	A: { field: 'A', pow: 2, unit: 'mm²' },
	Iy: { field: 'Iy', pow: 4, unit: 'mm⁴' },
	Iz: { field: 'Iz', pow: 4, unit: 'mm⁴' },
	Wy: { field: 'Wy', pow: 3, unit: 'mm³' },
	Wz: { field: 'Wz', pow: 3, unit: 'mm³' },
	iy: { field: 'iy', pow: 0, unit: 'mm' },
	iz: { field: 'iz', pow: 0, unit: 'mm' }
};

export const quantity = (f: Field) => Q[f];

/** Unit with its scale, e.g. '×10⁴ mm⁴'. */
export function unitLabel(q: Quantity): string {
	const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
	return q.pow ? `×10${[...String(q.pow)].map((d) => sup[Number(d)]).join('')} ${q.unit}` : q.unit;
}

/** Stored value divided by its display power, without float noise (924.7, not 924.6999). */
export function scaled(value: number, q: Quantity): number {
	return Number((value / 10 ** q.pow).toPrecision(12));
}

/** Dimension fields per shape, in display order; then the section properties. */
export function fieldsFor(s: ClientSection): { dims: Field[]; props: Field[] } {
	switch (s.shape) {
		case 'I':
			return { dims: ['h', 'b', 'tw', 'tf'], props: ['A', 'Iy', 'Wy', 'Iz', 'Wz', 'iy', 'iz'] };
		case 'U':
			return {
				dims: s.tf ? ['h', 'b', 'tw', 'tf'] : ['h', 'b', 'tw'],
				props: ['A', 'Iy', 'Wy', 'Iz', 'Wz', 'iy', 'iz']
			};
		case 'box':
			return { dims: ['h', 'b', 't'], props: ['A', 'Iy', 'Wy', 'Iz', 'Wz', 'iy', 'iz'] };
		case 'tube':
			return { dims: ['D', 't'], props: ['A', 'Iy', 'Wy', 'iy'] };
	}
}

export function valueOf(s: ClientSection, f: Field): number | undefined {
	const v = (s as unknown as Record<string, unknown>)[f];
	return typeof v === 'number' ? v : undefined;
}
