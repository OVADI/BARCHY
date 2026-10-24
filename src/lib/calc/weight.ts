/**
 * Mass of steel members. Pure functions; G in kg/m, lengths in mm.
 */

/** Mass of `count` members of `lengthMm` with mass per metre G. */
export function memberMass(G: number, lengthMm: number, count = 1): number {
	if (!(G >= 0) || !(lengthMm >= 0) || !(count >= 0)) {
		throw new RangeError('G, length and count must be non-negative numbers');
	}
	return G * (lengthMm / 1000) * count;
}

export interface BomLine {
	G: number;
	length: number;
	count: number;
}

/** Totals for a bill of materials: mass, number of lines (positions) and pieces. */
export function bomTotals(lines: BomLine[]): { mass: number; positions: number; pieces: number } {
	return {
		mass: lines.reduce((sum, l) => sum + memberMass(l.G, l.length, l.count), 0),
		positions: lines.length,
		pieces: lines.reduce((sum, l) => sum + l.count, 0)
	};
}
