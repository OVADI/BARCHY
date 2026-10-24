/**
 * Plain constants shared by the Zod schema and the browser code. Kept free of Zod, so importing
 * them on the client does not pull the validator into the bundle.
 */
export const STEEL_SERIES = [
	'HEA',
	'HEB',
	'HEM',
	'HEAA',
	'HEC',
	'HEx',
	'IPE',
	'IPEA',
	'IPEO',
	'IPER',
	'IPEV',
	'IPEx',
	'UNP',
	'SHS',
	'RHS',
	'CHS'
] as const;

export type SteelSeries = (typeof STEEL_SERIES)[number];

/** Shown in the picker by default; the rest sit behind "Meer varianten". */
export const PRIMARY_SERIES: readonly SteelSeries[] = [
	'HEA',
	'HEB',
	'HEM',
	'IPE',
	'UNP',
	'SHS',
	'RHS',
	'CHS'
];
