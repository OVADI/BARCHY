/**
 * Section properties from geometry. Pure functions, base units mm.
 * Rolled I- and box-sections are idealised (no root fillets, or the corner radii given),
 * so results are estimates for those; rectangles and tubes are exact.
 */

export interface Props {
	A: number;
	Iy: number;
	Iz: number;
	Wy: number;
	Wz: number;
}

/** Solid rectangle b × h (bending about y = axis parallel to b). */
export function rectangle(b: number, h: number): Props {
	const Iy = (b * h ** 3) / 12;
	const Iz = (h * b ** 3) / 12;
	return { A: b * h, Iy, Iz, Wy: Iy / (h / 2), Wz: Iz / (b / 2) };
}

/** Doubly symmetric I-section without root fillets. */
export function iSection(h: number, b: number, tw: number, tf: number): Props {
	const hw = h - 2 * tf;
	const Iy = (b * h ** 3 - (b - tw) * hw ** 3) / 12;
	const Iz = (2 * tf * b ** 3 + hw * tw ** 3) / 12;
	return { A: 2 * b * tf + hw * tw, Iy, Iz, Wy: Iy / (h / 2), Wz: Iz / (b / 2) };
}

/** Circular hollow section, outer diameter D, wall t. Exact. */
export function tube(D: number, t: number): Props {
	const d = D - 2 * t;
	const A = (Math.PI / 4) * (D ** 2 - d ** 2);
	const I = (Math.PI / 64) * (D ** 4 - d ** 4);
	return { A, Iy: I, Iz: I, Wy: I / (D / 2), Wz: I / (D / 2) };
}

/** Area and centroid offset (from the corner, along each axis) of the spandrel a radius r cuts off. */
const SPANDREL_C = (10 - 3 * Math.PI) / (12 - 3 * Math.PI);
const spandrel = (r: number) => ({ a: (1 - Math.PI / 4) * r ** 2, c: SPANDREL_C * r });

/**
 * Rectangular hollow section h × b × t with outer corner radius ro and inner radius ri.
 * Corners are treated as four spandrels removed outside and added back inside (their own
 * second moment is neglected, < 0.1 % for usual sizes).
 */
export function box(h: number, b: number, t: number, ro = 0, ri = 0): Props {
	const o = spandrel(ro);
	const i = spandrel(ri);
	const A = 2 * t * (b + h - 2 * t) - 4 * o.a + 4 * i.a;
	const corner = (outer: number) =>
		-4 * o.a * (outer / 2 - o.c) ** 2 + 4 * i.a * (outer / 2 - t - i.c) ** 2;
	const Iy = (b * h ** 3 - (b - 2 * t) * (h - 2 * t) ** 3) / 12 + corner(h);
	const Iz = (h * b ** 3 - (h - 2 * t) * (b - 2 * t) ** 3) / 12 + corner(b);
	return { A, Iy, Iz, Wy: Iy / (h / 2), Wz: Iz / (b / 2) };
}

/** Radius of gyration i = √(I/A). */
export function gyration(I: number, A: number): number {
	return Math.sqrt(I / A);
}

/** Total area of n bars of diameter d. */
export function barArea(d: number, n = 1): number {
	return (n * Math.PI * d ** 2) / 4;
}
