import { memberMass } from '$lib/calc/weight';
import type { BomItem } from './saved.svelte';

export interface CsvOptions {
	/** ';' for Dutch spreadsheets (comma decimals), ',' otherwise. */
	separator: ';' | ',';
	/** Formats a number for the target locale. */
	number: (value: number, maxFractionDigits: number) => string;
	headers: [name: string, count: string, length: string, G: string, mass: string];
}

const quote = (cell: string, sep: string) =>
	/["\n\r]/.test(cell) || cell.includes(sep) ? `"${cell.replace(/"/g, '""')}"` : cell;

/** Bill of materials as CSV, one line per position plus a header. */
export function bomCsv(items: readonly BomItem[], o: CsvOptions): string {
	const rows = [
		o.headers,
		...items.map((i) => [
			i.name,
			String(i.count),
			o.number(i.length, 0),
			o.number(i.G, 2),
			o.number(memberMass(i.G, i.length, i.count), 1)
		])
	];
	return `${rows.map((r) => r.map((c) => quote(c, o.separator)).join(o.separator)).join('\r\n')}\r\n`;
}
