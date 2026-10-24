import { join } from 'node:path';
import { barArea } from '../../src/lib/calc/section';
import type { Issue } from '../../src/lib/schema/source';
import { RebarFile } from '../../src/lib/schema/concrete';
import { htmlTables, num } from './parse';
import type { Report } from './report';
import { FILES, SOURCE, load, origin } from './source';

/** Reinforcement bar areas (§13.3). Each cell is checked against n·π·d²/4, rounded. */
export async function importRebar(
	report: Report,
	writeJson: (p: string, d: unknown) => void,
	content: string
) {
	const md = await load(FILES.rebar);
	const [table] = htmlTables(md);
	if (!table) throw new Error('Rebar table not found');
	const rows = table.rows.map((cells) => {
		const d = num(cells[0]!, 'nl')!;
		const As = cells.slice(1, 11).map((c) => num(c, 'nl')!);
		const issues: Issue[] = [];
		As.forEach((value, i) => {
			const expected = barArea(d, i + 1);
			if (Math.abs(value - expected) > 1) {
				issues.push({
					check: 'table',
					severity: 'error',
					field: `As${i + 1}`,
					expected: Math.round(expected),
					found: value,
					message: `${i + 1} × Ø${d}: verwacht ${Math.round(expected)} mm²`
				});
				report.issue('Betonstaal', `Ø${d}, ${i + 1} staven`, issues.at(-1)!);
			}
		});
		return {
			d,
			As,
			issues,
			status: issues.length > 0 ? ('flagged' as const) : ('auto_checked' as const)
		};
	});
	writeJson(
		join(content, 'concrete', 'rebar.json'),
		RebarFile.parse({ source: SOURCE, origin: origin(FILES.rebar, 'Betonstaal (Wapening)'), rows })
	);
	report.count('Betonstaal', rows.length, rows.filter((r) => r.status === 'flagged').length);
}
