import { parse as parseHtml } from 'node-html-parser';

export interface Table {
	/** The '## ' heading the table sits under. */
	section: string;
	/** Text of '**bold**' lines seen before the table within the section. */
	label: string;
	/** Header rows as cell texts (colspan expanded). */
	head: string[][];
	rows: string[][];
}

/** All HTML <table>s in a Markdown file, with the section heading they belong to. */
export function htmlTables(md: string): Table[] {
	const out: Table[] = [];
	const parts = md.split(/^## /m);
	parts.forEach((part, i) => {
		const section = i === 0 ? '' : (part.split('\n')[0] ?? '').trim();
		// Split further on bold labels so each table knows the last label before it.
		const chunks = part.split(/^\*\*(.+)\*\*\s*$/m);
		let label = '';
		chunks.forEach((chunk, j) => {
			if (j % 2 === 1) {
				label = chunk.trim();
				return;
			}
			for (const table of parseHtml(chunk).querySelectorAll('table')) {
				const head = table.querySelectorAll('thead tr').map((tr) =>
					tr.querySelectorAll('th').flatMap((th) => {
						const span = Number(th.getAttribute('colspan') ?? 1);
						return Array<string>(span).fill(th.text.replace(/\s+/g, ' ').trim());
					})
				);
				const rows = table
					.querySelectorAll('tbody tr')
					.map((tr) => tr.querySelectorAll('td').map((td) => td.text.replace(/\s+/g, ' ').trim()));
				out.push({ section, label, head, rows });
			}
		});
	});
	return out;
}

/** Markdown pipe tables under a heading, as rows of cell texts (header row first). */
export function pipeTables(md: string): { section: string; rows: string[][] }[] {
	const out: { section: string; rows: string[][] }[] = [];
	let section = '';
	let current: string[][] | null = null;
	for (const line of md.split('\n')) {
		const heading = /^##\s+(.+)$/.exec(line);
		if (heading) section = heading[1]!.trim();
		if (line.trim().startsWith('|')) {
			const cells = line
				.trim()
				.replace(/^\||\|$/g, '')
				.split('|')
				.map((c) => c.trim());
			if (cells.every((c) => /^-*$/.test(c))) continue; // separator row
			if (!current) {
				current = [];
				out.push({ section, rows: current });
			}
			current.push(cells);
		} else {
			current = null;
		}
	}
	return out;
}

/**
 * Parses a number as written in the source and scales it by 10^pow without float noise.
 * 'en': 1,234.5 · 'nl': 1.234,5. Returns null for an empty cell.
 */
export function num(text: string, locale: 'en' | 'nl', pow = 0): number | null {
	let s = text.replace(/\s/g, '');
	if (s === '') return null;
	if (locale === 'nl') s = s.replace(/\./g, '').replace(',', '.');
	else s = s.replace(/,/g, '');
	if (!/^-?\d+(\.\d+)?$/.test(s)) throw new Error(`Not a number: "${text}"`);
	return Number(`${s}e${pow}`);
}

/** '40x40', '50 x 30' → [40, 40] */
export function dims(text: string): number[] {
	return text.split(/\s*[x×]\s*/i).map((p) => num(p, 'en') ?? NaN);
}

/** Readable number for ids and names: 3.0 → '3', 3.2 → '3.2' */
export function short(n: number): string {
	return String(Number(n.toFixed(3)));
}

/** Slug for ids: 'HE 400 x107' → 'he-400-x107', '48.3x3.2' → '48-3x3-2' */
export function slug(...parts: string[]): string {
	return parts
		.join('-')
		.toLowerCase()
		.replace(/\./g, '-')
		.replace(/[^a-z0-9x-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}
