/**
 * Hatches redrawn as SVG from the Vademecum images (book/instructie/teken_instructies/Images).
 * Geometry is visual only: line spacing follows the images, not a value from the source.
 * Units are SVG user units in a 120 × 60 swatch.
 */

/** Parallel lines; angle 45 runs bottom-left to top-right. Each line is [offset, width]. */
export interface LinesLayer {
	kind: 'lines';
	angle: number;
	period: number;
	lines: [number, number][];
}
export type Layer =
	{ kind: 'fill'; tone: 'black' | 'grey' } | LinesLayer | { kind: 'concrete' } | { kind: 'sand' };

const diagonal = (period: number, lines: [number, number][] = [[0, 0.8]]): LinesLayer => ({
	kind: 'lines',
	angle: 45,
	period,
	lines
});
const cross = (period: number): Layer[] => [
	diagonal(period),
	{ kind: 'lines', angle: -45, period, lines: [[0, 0.8]] }
];

/** Area hatches: drawn as layered fills, so they can fill any shape. */
export const AREA: Record<string, Layer[]> = {
	'baksteen-1': [{ kind: 'fill', tone: 'black' }],
	'baksteen-2': [
		diagonal(22, [
			[0, 0.8],
			[3.5, 0.8]
		])
	],
	steenachtig: cross(15),
	'metselwerk-overige': [diagonal(15)],
	'beton-1': [{ kind: 'fill', tone: 'grey' }, { kind: 'concrete' }],
	'beton-2': [{ kind: 'fill', tone: 'grey' }],
	'beton-prefab-1': [{ kind: 'fill', tone: 'grey' }, { kind: 'concrete' }, diagonal(15)],
	'beton-prefab-2': [{ kind: 'fill', tone: 'grey' }, diagonal(15)],
	hout: [diagonal(15)],
	hardhout: cross(15),
	'hout-plaatmateriaal': [{ kind: 'lines', angle: 0, period: 6, lines: [[0, 0.8]] }],
	'staal-1': [{ kind: 'fill', tone: 'black' }],
	'staal-2': [
		diagonal(30, [
			[0, 3],
			[15, 0.8]
		])
	],
	zand: [{ kind: 'sand' }]
};

/** Hatches that are a symbol rather than an area fill (a strip, a line with dots, a ground line). */
export const SYMBOLS = [
	'lijmverbinding',
	'metalen-overige',
	'lood',
	'zink',
	'glas',
	'maaiveld',
	'water'
] as const;

/** Concrete marks, one tile: two triangles and scattered aggregate dots. */
export const CONCRETE_TILE = { w: 36, h: 28 };
export const CONCRETE_TRIANGLES: [number, number][] = [
	[9, 9],
	[27, 23]
];
export const CONCRETE_DOTS: [number, number][] = [
	[2, 3],
	[17, 2],
	[30, 6],
	[22, 11],
	[4, 15],
	[14, 17],
	[33, 14],
	[2, 25],
	[11, 26],
	[19, 21],
	[26, 3],
	[35, 26]
];

/** Sand: irregular dots, one 30 × 30 tile. */
export const SAND_DOTS: [number, number][] = [
	[3, 4],
	[14, 2],
	[24, 6],
	[8, 11],
	[19, 13],
	[28, 16],
	[4, 21],
	[13, 23],
	[23, 26],
	[29, 27],
	[10, 17],
	[20, 21]
];
