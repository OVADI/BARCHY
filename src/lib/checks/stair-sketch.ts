/** Geometry for the stair sketch on the calculator page: a section drawn to the scale of the input. */

export const SKETCH_W = 360;
export const SKETCH_H = 230;

const X0 = 60;
const Y0 = 176;
const Y_TOP = 12;
/** Floor that continues past the top riser. */
const STUB = 24;
const SLAB = 10;
const WAIST = 8;

export type SketchInput = { rise: number; risers: number; going: number };

export type SketchGeometry = {
	/** Drawing units per mm. */
	scale: number;
	x0: number;
	y0: number;
	yTop: number;
	/** Riser height and going in drawing units. */
	h: number;
	g: number;
	n: number;
	/** Width of the drawing: cropped to the stair so it fills the available width. */
	width: number;
	/** Outline of the flight, closed. */
	path: string;
	/** x of the riser at the foot of tread i (1-based), the nosing line. */
	riserX: (i: number) => number;
	/** y of the top of riser i (1-based). */
	riserTop: (i: number) => number;
};

export function sketchGeometry({ rise, risers, going }: SketchInput): SketchGeometry {
	const n = risers;
	const availW = SKETCH_W - 8 - STUB - X0;
	const availH = Y0 - Y_TOP;
	const run = Math.max(n - 1, 1) * going;
	const scale = Math.min(availW / run, availH / rise);
	const h = (rise / n) * scale;
	const g = going * scale;
	const yTop = Y0 - rise * scale;
	const riserX = (i: number) => X0 + (i - 1) * g;
	const riserTop = (i: number) => Y0 - i * h;
	const end = riserX(n) + STUB;

	const width = Math.min(SKETCH_W, Math.max(220, end + 16));

	let d = `M${X0},${Y0}`;
	for (let i = 1; i <= n; i++) {
		d += `L${riserX(i)},${riserTop(i)}`;
		d += i < n ? `L${riserX(i + 1)},${riserTop(i)}` : `L${end},${riserTop(i)}`;
	}
	// Underside parallel to the nosing line, one waist below it.
	const xAt = (y: number) => X0 + ((Y0 - y + WAIST) * g) / h;
	d += `L${end},${yTop + SLAB}L${xAt(yTop + SLAB)},${yTop + SLAB}L${xAt(Y0)},${Y0}Z`;

	return { scale, x0: X0, y0: Y0, yTop, h, g, n, width, path: d, riserX, riserTop };
}
